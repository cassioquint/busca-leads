import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Settings, Tag, Download, Plus } from 'lucide-react';
import type { Lead, Tag as TagType } from '@/types';
import { exportLeadsToExcel } from '@/utils/excelUtils';

interface Bucket {
  id: string;
  name: string;
}

interface FunilHeaderProps {
  savedLeads: Lead[];
  buckets: Bucket[];
  tags: TagType[];
  isLoading: boolean;
  onNewLeadClick: () => void;
  onManageTagsClick: () => void;
  onNewColumnClick: () => void;
}

export const FunilHeader: React.FC<FunilHeaderProps> = ({
  savedLeads,
  buckets,
  tags,
  isLoading,
  onNewLeadClick,
  onManageTagsClick,
  onNewColumnClick,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Fecha o menu de configurações automaticamente ao detectar cliques fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
        <p className="text-sm text-slate-500">
          {isLoading ? 'Buscando seu pipeline...' : `${savedLeads.length} leads no pipeline`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* AÇÃO PRIMÁRIA */}
        <button
          type="button"
          onClick={onNewLeadClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>

        {/* MENU DE CONFIGURAÇÕES DROPDOWN */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            disabled={isLoading}
            className={`p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center ${
              showSettingsMenu ? 'bg-slate-100 border-slate-300' : ''
            }`}
            title="Opções do Painel"
          >
            <Settings className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showSettingsMenu ? 'rotate-45' : ''}`} />
          </button>

          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-xl shadow-2xl p-1.5 z-[50] text-left space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => { onManageTagsClick(); setShowSettingsMenu(false); }}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Gerenciar Rótulos</span>
              </button>

              <button
                type="button"
                onClick={() => { exportLeadsToExcel(savedLeads, buckets, tags); setShowSettingsMenu(false); }}
                disabled={savedLeads.length === 0}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Exportar para Excel</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                type="button"
                onClick={() => { onNewColumnClick(); setShowSettingsMenu(false); }}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>Nova Coluna</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};