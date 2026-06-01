import React from 'react';
import { SearchBar } from './SearchBar';
import { RadarResults } from './RadarResults';
import { useRadar } from '../hooks/useRadar';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import type { Lead } from '../types';

interface RadarViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  hasSearched: boolean;
  setHasSearched: (value: boolean) => void;
  onSaveLead: (id: string) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ 
  leads, 
  setLeads, 
  hasSearched, 
  setHasSearched, 
  onSaveLead 
}) => {
  const [animationParent] = useAutoAnimate();
  
  // Consome toda a inteligência e estado do hook isolado
  const {
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
  } = useRadar(leads, setLeads, setHasSearched, onSaveLead);

  return (
    <div className="space-y-6">
      <SearchBar
        onSearch={handleSearch}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Buscando leads no radar... Isso pode levar alguns segundos.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {!isLoading && !error && hasSearched && (
        <RadarResults
          filteredLeads={filteredLeads}
          activeSubTab={activeSubTab}
          hideSavedLeads={hideSavedLeads}
          setHideSavedLeads={setHideSavedLeads}
          pagination={pagination}
          isLoadingMore={isLoadingMore}
          animationParent={animationParent}
          onSave={handleSave}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
};