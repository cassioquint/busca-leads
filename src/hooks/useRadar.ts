import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { Lead } from '@/types';
import { formatSearchLabel } from '@/utils/stringUtils';
import { useToast } from '@/contexts/ToastContext';

export const useRadar = (
  leads: Lead[],
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>,
  setHasSearched: (value: boolean) => void,
  onSaveLead: (id: string) => void
) => {
  const { showToast } = useToast();

  // 1. Inicialização puxando os dados do cache do navegador (LocalStorage)
  const [activeSubTab, setActiveSubTab] = useState<'maps' | 'inauguracoes'>(() => {
    return (localStorage.getItem('locus_active_tab') as 'maps' | 'inauguracoes') || 'maps';
  });

  const [hideSavedLeads, setHideSavedLeads] = useState(() => {
    const cache = localStorage.getItem('locus_hide_saved');
    return cache ? JSON.parse(cache) : true;
  });

  const [pagination, setPagination] = useState(() => {
    const cache = localStorage.getItem('locus_pagination');
    return cache ? JSON.parse(cache) : { hasMore: false, nextStart: 20 };
  });

  const [lastSearchParams, setLastSearchParams] = useState(() => {
    const cache = localStorage.getItem('locus_last_search_params');
    return cache ? JSON.parse(cache) : { query: '', city: '' };
  });

  const [lastSearchLabel, setLastSearchLabel] = useState<string>(() => {
    return localStorage.getItem('locus_last_search_label') || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Efeitos para gravar no LocalStorage automaticamente quando os estados internos mudarem
  useEffect(() => localStorage.setItem('locus_active_tab', activeSubTab), [activeSubTab]);
  useEffect(() => localStorage.setItem('locus_hide_saved', JSON.stringify(hideSavedLeads)), [hideSavedLeads]);
  useEffect(() => localStorage.setItem('locus_pagination', JSON.stringify(pagination)), [pagination]);
  useEffect(() => localStorage.setItem('locus_last_search_params', JSON.stringify(lastSearchParams)), [lastSearchParams]);

  const handleSearch = async (query: string, city: string) => {
    const cleanCity = city.split(' - ')[0].trim();
    if (!query || !cleanCity) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setLastSearchParams({ query, city: cleanCity });

    try {
      const data = await api.searchLeads(query, cleanCity, undefined, 0);

      setLeads(data.results);
      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });

      localStorage.setItem('locus_last_search_results', JSON.stringify(data.results));
      localStorage.setItem('locus_has_searched', 'true');

      const label = formatSearchLabel(query, cleanCity);
      setLastSearchLabel(label);
      localStorage.setItem('locus_last_search_label', label);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Falha desconhecida';
      console.error("Erro na busca:", err);
      setError(errorMessage);
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

      setLeads(prev => {
        const updatedLeads = [...prev, ...data.results];
        localStorage.setItem('locus_last_search_results', JSON.stringify(updatedLeads));
        return updatedLeads;
      });

      setPagination({
        hasMore: data.pagination.hasMore,
        nextStart: data.pagination.nextStart
      });
    } catch (err: unknown) {
      console.error("Erro ao carregar mais leads:", err);
      showToast("Não foi possível carregar mais registros. Tente novamente.", "error");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSave = (id: string) => {
    setLeads(currentLeads => {
      const updatedLeads = currentLeads.map(lead => (lead.id === id ? { ...lead, isSaved: true } : lead));

      localStorage.setItem('locus_last_search_results', JSON.stringify(updatedLeads));

      return updatedLeads;
    });
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
    handleSave,
    lastSearchParams,
    lastSearchLabel
  };
};
