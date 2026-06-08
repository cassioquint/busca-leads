import { useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Lead } from '../types';

export const useRadar = (
  leads: Lead[],
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>,
  setHasSearched: (value: boolean) => void,
  onSaveLead: (id: string) => void
) => {
  const [activeSubTab, setActiveSubTab] = useState<'maps' | 'inauguracoes'>('maps');
  const [hideSavedLeads, setHideSavedLeads] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({ hasMore: false, nextStart: 20 });
  const [lastSearchParams, setLastSearchParams] = useState({ query: '', city: '' });

  // 🌟 Injetado o setLimitModalOpen que estava faltando
  const { setLimitModalOpen } = useAuth();

  const handleSearch = async (query: string, city: string) => {
    const cleanCity = city.split(' - ')[0].trim();
    if (!query || !cleanCity) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchParams({ query, city: cleanCity });

    try {
      // 🌟 Atualizado para usar a nova api estruturada
      const data = await api.searchLeads(query, cleanCity, undefined, 0);
      
      setLeads(data.results);
      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });
    } catch (err: unknown) {
      // 🌟 Remoção do 'any': Trata o erro tipando como um objeto estruturado de erro
      const errorMessage = err instanceof Error ? err.message : 'Falha desconhecida';
      
      // Checa tanto a propriedade customizada status mapeada pela api quanto strings contidas na mensagem
      const isRateLimited = (err as { status?: number }).status === 429 || errorMessage.includes('limite de buscas');

      if (isRateLimited) {
        setLimitModalOpen(true);
      } else {
        console.error("Erro na busca:", err);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const { query, city } = lastSearchParams;
    if (!query || !city || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const data = await api.searchLeads(query, city, undefined, pagination.nextStart);
      setLeads(prev => [...prev, ...data.results]);
      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });
    } catch (err: unknown) {
      console.error("Erro ao carregar mais leads:", err);
      alert("Não foi possível carregar mais registros. Tente novamente.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSave = (id: string) => {
    setLeads(currentLeads =>
      currentLeads.map(lead => (lead.id === id ? { ...lead, isSaved: true } : lead))
    );
    onSaveLead(id);
  };

  const filteredLeads = leads.filter(lead => {
    const matchTab = activeSubTab === 'inauguracoes' ? !!lead.daysOpenText : !lead.daysOpenText;
    const matchSaved = hideSavedLeads ? !lead.isSaved : true;
    return matchTab && matchSaved;
  });

  return {
    activeSubTab,
    setActiveSubTab,
    hideSavedLeads,
    setHideSavedLeads,
    isLoading,
    isLoadingMore,
    error,
    filteredLeads,
    pagination,
    handleSearch,
    handleLoadMore,
    handleSave
  };
};