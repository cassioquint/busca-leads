import { useRef, useEffect } from 'react';
import { api } from '@/services/api';
import type { Lead, Bucket, Tag } from '@/types';
import { useToast } from '@/contexts/ToastContext';

interface UseCRMLeadsProps {
  userEmail: string | null | undefined;
  radarLeads: Lead[];
  setRadarLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  funilLeads: Lead[];
  setFunilLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  buckets: Bucket[];
  tags: Tag[];
}

export const useCRMLeads = ({
  userEmail,
  funilLeads,
  setFunilLeads,
  buckets,
  tags
}: UseCRMLeadsProps) => {
  const bucketsRef = useRef<Bucket[]>(buckets);
  const { showToast } = useToast();

  useEffect(() => {
    bucketsRef.current = buckets;
  }, [buckets]);

  const handleSaveLead = async (id: string) => {
    const currentBuckets = bucketsRef.current;
    if (!userEmail || currentBuckets.length === 0) return;
    const firstBucketId = currentBuckets[0].id;

    const cache = localStorage.getItem('locus_last_search_results');
    const actualRadarLeads: Lead[] = cache ? JSON.parse(cache) : [];
    const leadToSave = actualRadarLeads.find(l => l.id === id);

    // 2. Atualização Otimista (Faz o card pular para o Kanban sem esperar o banco)
    if (leadToSave) {
      setFunilLeads(prev => {
        if (prev.some(l => l.googlePlaceId === id || l.id === id)) return prev;
        return [...prev, { ...leadToSave, isSaved: true, bucketId: firstBucketId }];
      });
    }

    try {
      // 3. Salva no banco de dados
      const savedLeadFromDB = await api.saveLeadToFunil(id, userEmail);

      // 4. Troca o lead otimista provisório pelo lead oficial com ID do banco
      setFunilLeads(prev => {
        const leadExists = prev.some(l => l.id === id || l.googlePlaceId === id);
        if (leadExists) {
          return prev.map(l => (l.id === id || l.googlePlaceId === id) ? savedLeadFromDB : l);
        } else {
          return [...prev, savedLeadFromDB];
        }
      });

    } catch (error: unknown) {
      console.error(error);

      const revertedCache = localStorage.getItem('locus_last_search_results');
      if (revertedCache) {
        const revertedRadar: Lead[] = JSON.parse(revertedCache);
        const fixedRadar = revertedRadar.map(l => l.id === id ? { ...l, isSaved: false } : l);
        localStorage.setItem('locus_last_search_results', JSON.stringify(fixedRadar));
      }

      setFunilLeads(prev => prev.filter(l => l.id !== id && l.googlePlaceId !== id));

      showToast("Houve um erro operacional ao salvar o lead.", "error");
    }
  };

  const handleMoveLead = async (id: string, direction: 'forward' | 'backward') => {
    if (!userEmail || buckets.length === 0) return;
    const currentLead = funilLeads.find(l => l.id === id);
    if (!currentLead) return;

    const bucketIds = buckets.map(b => b.id);
    const currentIndex = bucketIds.indexOf(currentLead.bucketId);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= bucketIds.length) return;
    const nextBucketId = bucketIds[nextIndex];

    setFunilLeads(prev => prev.map(l => l.id === id ? { ...l, bucketId: nextBucketId } : l));

    try {
      await api.updateLeadBucket(id, nextBucketId, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(prev => prev.map(l => l.id === id ? { ...l, bucketId: currentLead.bucketId } : l));
      showToast("Não foi possível salvar a movimentação.", "error");
    }
  };

  const handleAddManualLead = async (leadData: Omit<Lead, 'id' | 'userEmail' | 'isSaved' | 'bucketId'>) => {
    if (!userEmail || buckets.length === 0) return;
    const tempId = `manual-${Date.now()}`;
    const firstBucketId = buckets[0].id;

    const optimisticLead: Lead = {
      id: tempId,
      name: leadData.name,
      type: leadData.type || 'Não informado',
      phone: leadData.phone || 'Sem Telefone',
      address: leadData.address || 'Sem endereço',
      city: 'Cadastro Manual',
      notes: leadData.notes || '',
      rating: null,
      reviews: null,
      openState: 'Salvando...',
      isOpen: true,
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop',
      isSaved: true,
      bucketId: firstBucketId
    };

    setFunilLeads(prev => [...prev, optimisticLead]);

    try {
      const savedLeadFromDB = await api.saveManualLeadToFunil(leadData, userEmail);
      setFunilLeads(prev => prev.map(l => l.id === tempId ? savedLeadFromDB : l));
    } catch (error: unknown) {
      console.error(error);
      setFunilLeads(prev => prev.filter(l => l.id !== tempId));

      showToast("Erro ao salvar o lead manual.", "error");
    }
  };

  const handleChangeLeadTag = async (leadId: string, tagId: string | null) => {
    if (!userEmail) return;
    const selectedTag = tags.find(t => t.id === tagId) || null;
    const previousLeads = [...funilLeads];

    setFunilLeads(prev => prev.map(l => l.id === leadId ? { ...l, tagId, tag: selectedTag } : l));

    try {
      await api.updateLeadTag(leadId, tagId, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(previousLeads);
      showToast("Não foi possível atualizar o rótulo.", "error");
    }
  };

  const handleUpdateLeadNotes = async (id: string, notes?: string, phone?: string, aiPitch?: string) => {
    if (!userEmail) return;
    const previousLeads = [...funilLeads];

    setFunilLeads(prev => prev.map(l => l.id === id ? { ...l, notes, phone: phone ?? l.phone, aiPitch: aiPitch ?? l.aiPitch } : l));

    try {
      await api.updateLeadNotes(id, { notes, phone, aiPitch }, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(previousLeads);
      showToast("Falha ao salvar as alterações do lead.", "error");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!userEmail) return;
    const leadToDelete = funilLeads.find(l => l.id === id);
    const previousLeads = [...funilLeads];

    setFunilLeads(prev => prev.filter(l => l.id !== id));

    // 🌟 Libera o botão no cache do Radar se ele for excluído do funil
    if (leadToDelete?.googlePlaceId) {
      const cache = localStorage.getItem('locus_last_search_results');
      if (cache) {
        const actualRadarLeads: Lead[] = JSON.parse(cache);
        const updatedRadar = actualRadarLeads.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: false } : p);
        localStorage.setItem('locus_last_search_results', JSON.stringify(updatedRadar));
      }
    }

    try {
      await api.deleteLead(id, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(previousLeads);

      // Reverte o cache se der erro na exclusão do banco
      if (leadToDelete?.googlePlaceId) {
        const cache = localStorage.getItem('locus_last_search_results');
        if (cache) {
          const actualRadarLeads: Lead[] = JSON.parse(cache);
          const revertedRadar = actualRadarLeads.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: true } : p);
          localStorage.setItem('locus_last_search_results', JSON.stringify(revertedRadar));
        }
      }
      showToast("Erro ao excluir o lead.", "error");
    }
  };

  const handleImportLeadsInBulk = async (newLeads: Partial<Lead>[]) => {
    if (!userEmail) return;

    try {
      const savedLeadsFromServer = await api.importLeadsBulk(newLeads, userEmail);
      setFunilLeads(prev => [...prev, ...savedLeadsFromServer]);
      showToast(`${savedLeadsFromServer.length} leads importados com sucesso!`, "success");
    } catch (error: unknown) {
      console.error(error);

      showToast("Erro ao salvar os leads importados no servidor.", "error");
    }
  };

  const handleUpdateLeadPitch = (id: string, aiPitch: string) => {
    setFunilLeads(prev => prev.map(l => l.id === id ? { ...l, aiPitch } : l));
  };

  return {
    handleSaveLead,
    handleMoveLead,
    handleAddManualLead,
    handleChangeLeadTag,
    handleUpdateLeadNotes,
    handleDeleteLead,
    handleImportLeadsInBulk,
    handleUpdateLeadPitch
  };
};
