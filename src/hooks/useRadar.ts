import { useState } from 'react';
import { api } from '../services/api';
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

  const { user } = useAuth();

  const handleSearch = async (query: string, city: string) => {
    const cleanCity = city.split(' - ')[0].trim();
    if (!query || !cleanCity) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchParams({ query, city: cleanCity });

    try {
      const data = await api.searchLeads(query, cleanCity, user?.email || undefined, 0);
      setLeads(data.results);
      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });
    } catch (err) {
      console.error("Erro na busca:", err);
      setError('Ocorreu um erro ao buscar os leads. Verifique a conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const { query, city } = lastSearchParams;
    if (!query || !city || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const data = await api.searchLeads(query, city, user?.email || undefined, pagination.nextStart);
      setLeads(prev => [...prev, ...data.results]);
      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });
    } catch (err) {
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