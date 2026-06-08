import React from 'react';
import { SearchBar, RadarResults } from './';
import { useRadar } from '@/hooks/useRadar';
import { useAuth } from '@/hooks/useAuth';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ChevronLeft, ChevronRight, Radar } from 'lucide-react';
import type { Lead } from '@/types';

interface RadarViewProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  hasSearched: boolean;
  setHasSearched: (value: boolean) => void;
  onSaveLead: (id: string) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  isOpen,
  setIsOpen,
  leads,
  setLeads,
  hasSearched,
  setHasSearched,
  onSaveLead
}) => {
  const [animationParent] = useAutoAnimate();
  const { refreshUserData } = useAuth();

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

  // 🌟 3. Intercepta a busca: executa a prospecção e atualiza a cota do plano logo em seguida
  const handleSearchWithUsageUpdate = async (query: string, city: string) => {
    // Dispara a busca do radar encapsulada no seu hook existente
    await handleSearch(query, city);
    
    // Se a busca finalizou com sucesso (o estado isLoading voltou a ser falso e não gerou erro)
    // nós sincronizamos o saldo de buscas no Header de forma transparente
    await refreshUserData();
  };

  return (
    <div 
      className={`h-full bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative z-20
        ${isOpen ? 'w-[380px]' : 'w-[52px]'}`}
    >
      {/* BOTÃO DE TRIGGER LATERAL (Aba flutuante) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-3.5 z-50 w-7 h-7 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center shadow-md hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer"
        title={isOpen ? "Recolher painel" : "Expandir painel"}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* BLOCO INTERNO COM LARGURA FIXA */}
      <div className={`flex flex-col h-full w-[380px] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* 1. TOPO FIXO: Sombra projetada estritamente para baixo */}
        <div className="shrink-0 px-5 pt-5 pb-4 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] relative z-30">
          <SearchBar
            onSearch={handleSearchWithUsageUpdate} // 🌟 4. Substituído pelo gatilho atualizado com refresh
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
          />
        </div>

        {/* 2. CORPO ROLÁVEL */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 pr-2 custom-scrollbar relative z-10">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium text-center max-w-[240px]">
                Buscando leads no radar... Isso pode levar alguns segundos.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs text-center font-medium border border-red-100">
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

          {!isLoading && !error && !hasSearched && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Digite uma palavra-chave acima para iniciar o radar de prospecção.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ICONE DO RADAR VERTICAL QUANDO COMPACTADO */}
      {!isOpen && (
        <div className="absolute inset-0 flex flex-col items-center pt-16 text-slate-300 pointer-events-none animate-in fade-in duration-300">
          <Radar className="w-5 h-5 text-slate-400/70" />
          <span className="text-[9px] font-black tracking-widest text-slate-400/60 uppercase [writing-mode:vertical-lr] mt-4">
            Radar de Leads
          </span>
        </div>
      )}
    </div>
  );
};