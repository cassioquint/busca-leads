import React from 'react';
import { LeadCard } from './';
import type { Lead } from '@/types';
import { ChevronDown } from 'lucide-react';

interface RadarResultsProps {
  filteredLeads: Lead[];
  activeSubTab: 'maps' | 'inauguracoes';
  hideSavedLeads: boolean;
  setHideSavedLeads: (value: boolean) => void;
  pagination: { hasMore: boolean; nextStart: number };
  isLoadingMore: boolean;
  animationParent: React.Ref<HTMLDivElement>;
  onSave: (id: string) => void;
  onLoadMore: () => void;
  searchLabel: string;
}

export const RadarResults: React.FC<RadarResultsProps> = ({
  filteredLeads,
  activeSubTab,
  hideSavedLeads,
  setHideSavedLeads,
  pagination,
  isLoadingMore,
  animationParent,
  onSave,
  onLoadMore,
  searchLabel
}) => {
  return (
    <div className="space-y-4">
      
      {/* SEÇÃO DO CABEÇALHO */}
      <div className="flex flex-col gap-2.5 pb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            {searchLabel ? searchLabel : (activeSubTab === 'maps' ? 'Estabelecimentos no Radar' : 'Negócios Recém-Abertos')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{filteredLeads.length} leads exibidos</p>
        </div>

        {/* Chave de Filtro Otimizada */}
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60 w-full">
          <span 
            className="text-xs font-bold text-slate-600 cursor-pointer select-none" 
            onClick={() => setHideSavedLeads(!hideSavedLeads)}
          >
            Ocultar leads já salvos
          </span>
          <button
            type="button"
            onClick={() => setHideSavedLeads(!hideSavedLeads)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              hideSavedLeads ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                hideSavedLeads ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed px-4">
          <p className="text-slate-400 text-xs font-semibold leading-relaxed">
            Nenhum estabelecimento encontrado para este filtro.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* LISTA VERTICAL */}
          <div ref={animationParent} className="flex flex-col gap-2.5">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onSave={onSave} />
            ))}
          </div>

          {/* ÁREA DO BOTÃO VER MAIS */}
          {pagination.hasMore && (
            <div className="flex justify-center pt-2">
              {isLoadingMore ? (
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50/60 w-full py-2.5 rounded-xl border border-indigo-100/50">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Carregando mais...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver mais leads</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};