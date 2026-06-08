import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Settings, Tag, Download, Plus, FileSpreadsheet, Upload, Sparkles } from 'lucide-react';
import type { Lead, Tag as TagType } from '@/types';
import { exportLeadsToExcel } from '@/utils/excelUtils';
import { downloadTemplateExcel, processExcelImport } from '@/utils/excelImportUtils';
import { useAuth } from '@/hooks/useAuth';

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
  onImportLeadsInBulk: (leads: Partial<Lead>[]) => Promise<void>;
}

export const FunilHeader: React.FC<FunilHeaderProps> = ({
  savedLeads,
  buckets,
  tags,
  isLoading,
  onNewLeadClick,
  onManageTagsClick,
  onNewColumnClick,
  onImportLeadsInBulk
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Acessa os dados do plano e o gatilho do modal dinâmico
  const { user, setLimitModalType } = useAuth();
  
  // Atalhos booleanos de permissão para simplificar as condicionais
  const canImport = user?.plan?.bulkImportAllowed ?? false;
  const canExport = user?.plan?.exportAllowed ?? false;

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || buckets.length === 0) return;

    // Dupla checagem de segurança caso o input oculto seja burlado via DOM
    if (!canImport) {
      setLimitModalType('FUNNEL_LIMIT');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const firstBucketId = buckets[0].id;
      const parsedLeads = await processExcelImport(file, firstBucketId);
      await onImportLeadsInBulk(parsedLeads);
    } catch (error) { 
      const errorMessage = error instanceof Error ? error.message : 'Falha ao processar arquivo de importação.';
      alert(errorMessage);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
        <p className="text-sm text-slate-500">
          {isLoading ? 'Buscando seu pipeline...' : `${savedLeads.length} leads no pipeline`}
        </p>
      </div>

      {/* Input invisível protegido logicamente pelo disabled reativo */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden"
        disabled={!canImport}
      />

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
            <div className="absolute right-0 mt-2 w-54 bg-white border border-slate-200/80 rounded-xl shadow-2xl p-1.5 z-[50] text-left space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => { onManageTagsClick(); setShowSettingsMenu(false); }}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Gerenciar Rótulos</span>
              </button>

              {/* EXPORTAR PARA EXCEL */}
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(false);
                  if (!canExport) {
                    setLimitModalType('FUNNEL_LIMIT');
                    return;
                  }
                  exportLeadsToExcel(savedLeads, buckets, tags);
                }}
                disabled={savedLeads.length === 0}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center justify-between cursor-pointer disabled:opacity-40"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exportar para Excel</span>
                </div>
                {!canExport && <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100 animate-pulse" />}
              </button>

              <div className="border-t border-slate-100 my-1" />

              {/* BAIXAR MODELO EXCEL */}
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(false);
                  if (!canImport) {
                    setLimitModalType('FUNNEL_LIMIT');
                    return;
                  }
                  downloadTemplateExcel();
                }}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                  <span>Baixar Modelo Excel</span>
                </div>
                {!canImport && <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100 animate-pulse" />}
              </button>

              {/* IMPORTAR PLANILHA */}
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(false);
                  if (!canImport) {
                    setLimitModalType('FUNNEL_LIMIT');
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Importar Planilha</span>
                </div>
                {!canImport && <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100 animate-pulse" />}
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