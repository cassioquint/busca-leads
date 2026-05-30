import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Lead } from '../types';
import { useAuth } from '../contexts/AuthContext';

// 🔥 Interface para tipar as colunas dinâmicas
interface Bucket {
  id: string;
  name: string;
}

export const useCRM = () => {
  const [radarLeads, setRadarLeads] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [funilLeads, setFunilLeads] = useState<Lead[]>([]);
  // 🔥 NOVO: Estado para armazenar as colunas vindas da API/Banco
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const { user } = useAuth();

  // 🔥 Carrega os Buckets (Colunas) e os Leads salvos assim que o usuário logar
  useEffect(() => {
    const loadData = async () => {
      if (!user?.email) return;

      try {
        // Carrega primeiro as colunas do Kanban (Garante que o backend já rode o seed se for novo usuário)
        const bucketsData = await api.getBuckets(user.email);
        setBuckets(bucketsData);

        // Depois carrega os leads vinculados a essas colunas
        const leadsData = await api.getFunilLeads(user.email);
        setFunilLeads(leadsData);
      } catch (error) {
        console.error('Falha ao carregar dados do CRM:', error);
      }
    };

    loadData();
  }, [user?.email]);

  // 🔥 NOVO: Função para criar uma nova coluna customizada via cabeçalho do Kanban
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

  const handleSaveLead = async (id: string) => {
    if (!user?.email || buckets.length === 0) return;

    // A primeira coluna do banco será o destino padrão inicial dos leads salvos
    const firstBucketId = buckets[0].id;

    // 1. Atualização otimista na tela (Radar)
    setRadarLeads(prevLeads => 
      prevLeads.map(lead => lead.id === id ? { ...lead, isSaved: true } : lead)
    );

    // 2. Atualização otimista na tela (Funil)
    const leadToSave = radarLeads.find(lead => lead.id === id);
    if (leadToSave && !funilLeads.some(l => l.googlePlaceId === id || l.id === id)) {
      setFunilLeads(prevFunil => [
        ...prevFunil, 
        // 🔥 Agora salvamos apontando para o bucketId dinâmico da primeira coluna
        { ...leadToSave, isSaved: true, bucketId: firstBucketId }
      ]);
    }

    try {
      // 3. Salva no banco de dados e pega o registro oficial criado (com UUID definitivo e relações prontas)
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
    if (!user?.email || buckets.length === 0) return;

    // Identifica onde o lead está agora no estado do React
    const currentLead = funilLeads.find(l => l.id === id);
    if (!currentLead) return;

    // 🔥 MUDANÇA: Acha o índice atual comparando os UUIDs dentro do array dinâmico de buckets
    const bucketIds = buckets.map(b => b.id);
    const currentIndex = bucketIds.indexOf(currentLead.bucketId);
    const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex < 0 || nextIndex >= bucketIds.length) return;
    
    const nextBucketId = bucketIds[nextIndex];

    // 1. Atualiza visualmente na mesma hora (Optimistic UI)
    setFunilLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id !== id) return lead;
        return { ...lead, bucketId: nextBucketId }; // Muta o bucketId temporariamente
      })
    );

    try {
      // 2. Avisa o banco de dados da movimentação passando o UUID da nova coluna
      await api.updateLeadBucket(id, nextBucketId, user.email);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      // 3. Desfaz o movimento na tela se a requisição falhar
      setFunilLeads(prevLeads => 
        prevLeads.map(lead => lead.id === id ? { ...lead, bucketId: currentLead.bucketId } : lead)
      );
      alert("Não foi possível salvar a movimentação. O card retornou à coluna anterior.");
    }
  };

  const handleAddManualLead = async (leadData: any) => {
    if (!user?.email || buckets.length === 0) return;

    const tempId = `manual-${Date.now()}`;
    const firstBucketId = buckets[0].id; // Primeira coluna dinâmica como padrão

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
      bucketId: firstBucketId // 🔥 Associado dinamicamente à primeira coluna
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
    handleAddManualLead,
    buckets,
    handleCreateColumn
  };
};