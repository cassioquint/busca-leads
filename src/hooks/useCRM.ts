import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Lead } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useCRM = () => {
  const [radarLeads, setRadarLeads] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [funilLeads, setFunilLeads] = useState<Lead[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const loadFunilLeads = async () => {
      if (!user?.email) return;

      try {
        const data = await api.getFunilLeads(user.email);
        setFunilLeads(data);
      } catch (error) {
        console.error('Falha ao carregar leads salvos:', error);
      }
    };

    loadFunilLeads();
  }, [user?.email]);

  const handleSaveLead = async (id: string) => {
    if (!user?.email) return;

    // 1. Atualização otimista na tela (Radar)
    setRadarLeads(prevLeads => 
      prevLeads.map(lead => lead.id === id ? { ...lead, isSaved: true } : lead)
    );

    // 2. Atualização otimista na tela (Funil)
    // Usamos o ID do Google temporariamente para o card aparecer instantaneamente
    const leadToSave = radarLeads.find(lead => lead.id === id);
    if (leadToSave && !funilLeads.some(l => l.googlePlaceId === id || l.id === id)) {
      setFunilLeads(prevFunil => [
        ...prevFunil, 
        { ...leadToSave, isSaved: true, bucket: 'abordar' }
      ]);
    }

    try {
      // 3. Salva no banco de dados e pega o registro oficial criado (com o UUID definitivo)
      const savedLeadFromDB = await api.saveLeadToFunil(id, user.email);
      
      // 4. Substitui o lead temporário pelo lead oficial no funil
      setFunilLeads(prevFunil => prevFunil.map(lead => 
        (lead.id === id) ? savedLeadFromDB : lead
      ));

    } catch (error) {
      console.error(error);
      // Rollback caso a API falhe
      setRadarLeads(prevLeads => prevLeads.map(lead => lead.id === id ? { ...lead, isSaved: false } : lead));
      setFunilLeads(prevFunil => prevFunil.filter(lead => lead.id !== id));
      alert("Houve um erro ao salvar o lead. Tente novamente.");
    }
  };

  const handleMoveLead = async (id: string, direction: 'forward' | 'backward') => {
    if (!user?.email) return;

    const order: Lead['bucket'][] = ['abordar', 'contato', 'proposta', 'negociacao'];
    
    // Identifica onde o lead está agora
    const currentLead = funilLeads.find(l => l.id === id);
    if (!currentLead) return;

    const currentIndex = order.indexOf(currentLead.bucket);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex < 0 || nextIndex >= order.length) return;
    
    const nextBucket = order[nextIndex];

    // 1. Atualiza visualmente na mesma hora (Optimistic UI)
    setFunilLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id !== id) return lead;
        return { ...lead, bucket: nextBucket };
      })
    );

    try {
      // 2. Avisa o banco de dados da movimentação usando o UUID real
      await api.updateLeadBucket(id, nextBucket, user.email);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      // 3. Desfaz o movimento na tela se a internet cair ou o banco recusar
      setFunilLeads(prevLeads => 
        prevLeads.map(lead => lead.id === id ? { ...lead, bucket: currentLead.bucket } : lead)
      );
      alert("Não foi possível salvar a movimentação. O card retornou à coluna anterior.");
    }
  };

  const handleAddManualLead = async (leadData: any) => {
    if (!user?.email) return;

    const tempId = `manual-${Date.now()}`;
    const optimisticLead: Lead = {
      id: tempId,
      title: leadData.title,
      type: leadData.type || 'Não informado',
      phone: leadData.phone || 'Sem Telefone',
      address: leadData.address || 'Sem endereço',
      city: 'Cadastro Manual', // Adicionado campo obrigatório
      rating: null,
      reviews: null,
      openState: 'Salvando...',
      isOpen: true,
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop', 
      isSaved: true,
      bucket: 'abordar'
    };

    setFunilLeads(prev => [...prev, optimisticLead]);

    try {
      const savedLeadFromDB = await api.saveManualLeadToFunil(leadData, user.email);
      
      setFunilLeads(prev => prev.map(lead => 
        lead.id === tempId ? savedLeadFromDB : lead
      ));
    } catch (error) {
      console.error('Erro ao salvar lead manual:', error);
      setFunilLeads(prev => prev.filter(lead => lead.id !== tempId));
      alert("Houve um erro ao salvar o lead. Tente novamente.");
    }
  };

  return {
    radarLeads,
    setRadarLeads,
    hasSearched,
    setHasSearched,
    funilLeads,
    handleSaveLead,
    handleMoveLead,
    handleAddManualLead
  };
};