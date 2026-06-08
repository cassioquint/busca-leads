import { useRef, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import type { Lead, Bucket, Tag } from '@/types';

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
  radarLeads,
  setRadarLeads,
  funilLeads,
  setFunilLeads,
  buckets,
  tags
}: UseCRMLeadsProps) => {
  const bucketsRef = useRef<Bucket[]>(buckets);

  const { setLimitModalType, user } = useAuth();

  useEffect(() => {
    bucketsRef.current = buckets;
  }, [buckets]);

  const handleSaveLead = async (id: string) => {
    const currentBuckets = bucketsRef.current;
    if (!userEmail || currentBuckets.length === 0) return;
    const firstBucketId = currentBuckets[0].id;

    setRadarLeads(prev => prev.map(l => l.id === id ? { ...l, isSaved: true } : l));

    const leadToSave = radarLeads.find(l => l.id === id);
    if (leadToSave && !funilLeads.some(l => l.googlePlaceId === id || l.id === id)) {
      setFunilLeads(prev => [...prev, { ...leadToSave, isSaved: true, bucketId: firstBucketId }]);
    }

    try {
      const savedLeadFromDB = await api.saveLeadToFunil(id, userEmail);
      setFunilLeads(prev => prev.map(l => l.id === id ? savedLeadFromDB : l));
    } catch (error: unknown) {
      console.error(error);
      
      // Reverte o estado otimista em tela se der erro
      setRadarLeads(prev => prev.map(l => l.id === id ? { ...l, isSaved: false } : l));
      setFunilLeads(prev => prev.filter(l => l.id !== id));

      if (error instanceof Error && error.message === 'FUNNEL_LIMIT') {
        setLimitModalType('FUNNEL_LIMIT');
      } else {
        alert("Houve um erro operacional ao salvar o lead.");
      }
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
      alert("Não foi possível salvar a movimentação.");
    }
  };

  const handleAddManualLead = async (leadData: Omit<Lead, 'id' | 'userEmail' | 'isSaved' | 'bucketId'>) => {
    if (!userEmail || buckets.length === 0) return;
    const tempId = `manual-${Date.now()}`;
    const firstBucketId = buckets[0].id;

    const optimisticLead: Lead = {
      id: tempId,
      title: leadData.title,
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
      
      // Desfaz a criação otimista
      setFunilLeads(prev => prev.filter(l => l.id !== tempId));

      if (error instanceof Error && error.message === 'FUNNEL_LIMIT') {
        setLimitModalType('FUNNEL_LIMIT');
      } else {
        alert("Erro ao salvar o lead manual.");
      }
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
      alert("Não foi possível atualizar o rótulo.");
    }
  };

  const handleUpdateLeadNotes = async (id: string, notes?: string, phone?: string) => {
    if (!userEmail) return;
    const previousLeads = [...funilLeads];

    setFunilLeads(prev => prev.map(l => l.id === id ? { ...l, notes, phone: phone ?? l.phone } : l));

    try {
      await api.updateLeadNotes(id, { notes, phone }, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(previousLeads);
      alert("Falha ao salvar as alterações do lead.");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!userEmail) return;
    const leadToDelete = funilLeads.find(l => l.id === id);
    const previousLeads = [...funilLeads];

    setFunilLeads(prev => prev.filter(l => l.id !== id));
    if (leadToDelete?.googlePlaceId) {
      setRadarLeads(prev => prev.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: false } : p));
    }

    try {
      await api.deleteLead(id, userEmail);
    } catch (error) {
      console.error(error);
      setFunilLeads(previousLeads);
      if (leadToDelete?.googlePlaceId) {
        setRadarLeads(prev => prev.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: true } : p));
      }
      alert("Erro ao excluir the lead.");
    }
  };

  const handleImportLeadsInBulk = async (newLeads: Partial<Lead>[]) => {
    if (!userEmail) return;

    if (user?.plan && !user.plan.bulkImportAllowed) {
      setLimitModalType('FUNNEL_LIMIT');
      return;
    }
    
    try {
      const savedLeadsFromServer = await api.importLeadsBulk(newLeads, userEmail);
      setFunilLeads(prev => [...prev, ...savedLeadsFromServer]);
      alert(`${savedLeadsFromServer.length} leads importados com sucesso!`);
    } catch (error: unknown) {
      console.error(error);
      
      if (error instanceof Error && error.message === 'FUNNEL_LIMIT') {
        setLimitModalType('FUNNEL_LIMIT');
      } else {
        alert('Erro ao salvar os leads importados no servidor.');
      }
    }
  };

  return {
    handleSaveLead,
    handleMoveLead,
    handleAddManualLead,
    handleChangeLeadTag,
    handleUpdateLeadNotes,
    handleDeleteLead,
    handleImportLeadsInBulk
  };
};