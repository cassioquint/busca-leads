import { useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCRMData } from './useCRMData';
import type { Lead } from '@/types';

export const useCRM = () => {
  const { user } = useAuth();

  // Estados compartilhados com a view do Radar mantidos na raiz do CRM
  const [radarLeads, setRadarLeads] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Consome a infraestrutura carregada do banco de dados
  const {
    funilLeads,
    setFunilLeads,
    buckets,
    setBuckets,
    tags,
    setTags,
    isLoadingCRM
  } = useCRMData();

  // AÇÃO 1: Salvar Prospect do Radar no Funil
  const handleSaveLead = async (id: string) => {
    if (!user?.email || buckets.length === 0) return;

    const firstBucketId = buckets[0].id;

    setRadarLeads(prevLeads =>
      prevLeads.map(lead => lead.id === id ? { ...lead, isSaved: true } : lead)
    );

    const leadToSave = radarLeads.find(lead => lead.id === id);
    if (leadToSave && !funilLeads.some(l => l.googlePlaceId === id || l.id === id)) {
      setFunilLeads(prevFunil => [
        ...prevFunil,
        { ...leadToSave, isSaved: true, bucketId: firstBucketId }
      ]);
    }

    try {
      const savedLeadFromDB = await api.saveLeadToFunil(id, user.email);
      setFunilLeads(prevFunil => prevFunil.map(lead =>
        (lead.id === id) ? savedLeadFromDB : lead
      ));
    } catch (error) {
      console.error(error);
      setRadarLeads(prevLeads => prevLeads.map(lead => lead.id === id ? { ...lead, isSaved: false } : lead));
      setFunilLeads(prevFunil => prevFunil.filter(lead => lead.id !== id));
      alert("Houve um erro ao salvar o lead. Tente novamente.");
    }
  };

  // AÇÃO 2: Mover Lead de coluna no Kanban
  const handleMoveLead = async (id: string, direction: 'forward' | 'backward') => {
    if (!user?.email || buckets.length === 0) return;

    const currentLead = funilLeads.find(l => l.id === id);
    if (!currentLead) return;

    const bucketIds = buckets.map(b => b.id);
    const currentIndex = bucketIds.indexOf(currentLead.bucketId);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= bucketIds.length) return;

    const nextBucketId = bucketIds[nextIndex];

    setFunilLeads(prevLeads =>
      prevLeads.map(lead => lead.id === id ? { ...lead, bucketId: nextBucketId } : lead)
    );

    try {
      await api.updateLeadBucket(id, nextBucketId, user.email);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      setFunilLeads(prevLeads =>
        prevLeads.map(lead => lead.id === id ? { ...lead, bucketId: currentLead.bucketId } : lead)
      );
      alert("Não foi possível salvar a movimentação. O card retornou à coluna anterior.");
    }
  };

  // AÇÃO 3: Adicionar Lead Manual
  const handleAddManualLead = async (leadData: any) => {
    if (!user?.email || buckets.length === 0) return;

    const tempId = `manual-${Date.now()}`;
    const firstBucketId = buckets[0].id;

    const optimisticLead: Lead = {
      id: tempId,
      title: leadData.title,
      type: leadData.type || 'Não informado',
      phone: leadData.phone || 'Sem Telefone',
      address: leadData.address || 'Sem endereço',
      city: 'Cadastro Manual',
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
      const savedLeadFromDB = await api.saveManualLeadToFunil(leadData, user.email);
      setFunilLeads(prev => prev.map(lead => lead.id === tempId ? savedLeadFromDB : lead));
    } catch (error) {
      console.error('Erro ao salvar lead manual:', error);
      setFunilLeads(prev => prev.filter(lead => lead.id !== tempId));
      alert("Houve um erro ao salvar o lead. Tente novamente.");
    }
  };

  // AÇÃO 4: Alterar Etiqueta do Lead
  const handleChangeLeadTag = async (leadId: string, tagId: string | null) => {
    if (!user?.email) return;

    const selectedTag = tags.find(t => t.id === tagId) || null;
    const previousFunilLeads = [...funilLeads];

    setFunilLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;
      return { ...lead, tagId, tag: selectedTag };
    }));

    try {
      await api.updateLeadTag(leadId, tagId, user.email);
    } catch (error) {
      console.error('Erro ao atualizar tag do lead:', error);
      setFunilLeads(previousFunilLeads);
      alert("Não foi possível atualizar o rótulo do card. Tente novamente.");
    }
  };

  // 🔥 NOVA AÇÃO 5: Salvar as Observações/Notas do Lead
  const handleUpdateLeadNotes = async (id: string, notes: string) => {
    if (!user?.email) return;

    const previousFunilLeads = [...funilLeads];

    // Optimistic UI update local
    setFunilLeads(prev => prev.map(lead => lead.id === id ? { ...lead, notes } : lead));

    try {
      await api.updateLeadNotes(id, notes, user.email);
    } catch (error) {
      console.error('Erro ao atualizar notas do lead:', error);
      setFunilLeads(previousFunilLeads);
      alert("Não foi possível salvar as anotações no servidor.");
    }
  };

  // 🔥 NOVA AÇÃO 6: Excluir definitivamente o Lead do Funil
  const handleDeleteLead = async (id: string) => {
    if (!user?.email) return;

    const leadToDelete = funilLeads.find(lead => lead.id === id);
    const previousFunilLeads = [...funilLeads];

    // Remove visualmente de imediato
    setFunilLeads(prev => prev.filter(lead => lead.id !== id));

    // Se o lead veio do radar, marca como "Não salvo" novamente na visualização de pesquisa
    if (leadToDelete?.googlePlaceId) {
      setRadarLeads(prev => prev.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: false } : p));
    }

    try {
      await api.deleteLead(id, user.email);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      // Rollback completo
      setFunilLeads(previousFunilLeads);
      if (leadToDelete?.googlePlaceId) {
        setRadarLeads(prev => prev.map(p => p.id === leadToDelete.googlePlaceId ? { ...p, isSaved: true } : p));
      }
      alert("Houve uma falha ao remover o lead no servidor.");
    }
  };

  // CONFIGURAÇÃO: Criar colunas
  const handleCreateColumn = async () => {
    if (!user?.email) return;

    const name = prompt("Digite o nome da nova coluna para o seu Kanban:");
    if (!name || !name.trim()) return;

    try {
      const order = buckets.length + 1;
      const newBucket = await api.createBucket(name.trim(), user.email, order);
      setBuckets(prev => [...prev, newBucket]);
    } catch (error) {
      console.error("Erro ao criar coluna:", error);
      alert("Não foi possível criar a coluna. Verifique se o nome já existe.");
    }
  };

  // CONFIGURAÇÃO: Criar tags
  const handleManageTags = () => {
    if (!user?.email) return;

    const name = prompt("Deseja criar um novo rótulo customizado? Digite o nome:");
    if (!name || !name.trim()) return;

    const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    api.createTag(name.trim(), randomColor, user.email)
      .then(newTag => setTags(prev => [...prev, newTag]))
      .catch(err => console.error("Erro ao gerenciar tags:", err));
  };

  return {
    isLoadingCRM,
    radarLeads,
    setRadarLeads,
    hasSearched,
    setHasSearched,
    funilLeads,
    buckets,
    tags,
    handleSaveLead,
    handleMoveLead,
    handleAddManualLead,
    handleCreateColumn,
    handleManageTags,
    handleChangeLeadTag,
    handleUpdateLeadNotes,
    handleDeleteLead
  };
};
