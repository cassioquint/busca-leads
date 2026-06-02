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
  animationParent: React.Ref<any>;
  onSave: (id: string) => void;
  onLoadMore: () => void;
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
  onLoadMore
}) => {
  return (
    <>
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {activeSubTab === 'maps' ? 'Estabelecimentos encontrados' : 'Negócios recém-abertos na sua região'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{filteredLeads.length} leads exibidos</p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-sm font-semibold text-slate-600 cursor-pointer" onClick={() => setHideSavedLeads(!hideSavedLeads)}>
            Ocultar leads salvos
          </span>
          <button
            onClick={() => setHideSavedLeads(!hideSavedLeads)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              hideSavedLeads ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hideSavedLeads ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
          <p className="text-slate-500 font-medium">Nenhum estabelecimento encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div ref={animationParent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onSave={onSave} />
            ))}
          </div>

          {pagination.hasMore && (
            <div className="flex justify-center pt-4">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm bg-indigo-50 px-6 py-3 rounded-xl border border-indigo-100">
                  <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span>Buscando próximos resultados...</span>
                </div>
              ) : (
                <button
                  onClick={onLoadMore}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 font-bold rounded-xl text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer hover:shadow"
                >
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                  <span>Ver mais leads</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
