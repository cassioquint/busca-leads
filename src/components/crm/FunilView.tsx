import React, { useState } from 'react';
import type { Lead, Tag } from '@/types';
import { Plus, UserPlus, Tag as TagIcon, Loader2 } from 'lucide-react';
import { FunilCard, AddLeadModal } from './';

interface Bucket {
  id: string;
  name: string;
}

interface FunilViewProps {
  leads: Lead[];
  buckets: Bucket[];
  tags: Tag[];
  isLoading?: boolean;
  onMoveLead: (id: string, direction: 'forward' | 'backward') => void;
  onAddManualLead: (data: any) => void;
  onCreateColumn: () => void;
  onManageTags: () => void;
  onChangeLeadTag: (leadId: string, tagId: string | null) => void;
}

export const FunilView: React.FC<FunilViewProps> = ({
  leads,
  buckets,
  tags,
  isLoading = false,
  onMoveLead,
  onAddManualLead,
  onCreateColumn,
  onManageTags,
  onChangeLeadTag
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const savedLeads = leads.filter(l => l.isSaved);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO FUNIL */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
          <p className="text-sm text-slate-500">
            {isLoading ? 'Buscando seu pipeline...' : `${savedLeads.length} leads no pipeline`}
          </p>
        </div>
        <div className="flex items-center gap-3">

          {/* BOTÃO GERENCIAR RÓTULOS */}
          <button
            onClick={onManageTags}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <TagIcon className="w-4 h-4 text-slate-400" />
            <span>Rótulos</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>

          <button
            onClick={onCreateColumn}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Coluna</span>
          </button>
        </div>
      </div>

      {/* 🌟 TRATAMENTO DOS ESTADOS DE TELA */}
      {isLoading ? (
        /* 1. TELA DE CARREGAMENTO (Aparece enquanto o Neon responde) */
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3 min-h-[400px]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <h3 className="text-base font-semibold text-slate-700">Carregando seu CRM...</h3>
          <p className="text-sm text-slate-400 max-w-xs">Buscando as colunas e os cards salvos direto do servidor.</p>
        </div>
      ) : savedLeads.length === 0 ? (
        /* 2. TELA DE ESTADO VAZIO DEFINITIVO (Só aparece se terminar de carregar e não tiver nada) */
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200/80 p-16 text-center shadow-sm max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Seu funil está limpo</h3>
          <p className="text-sm text-slate-500 max-w-md">Use a aba "Radar" para capturar empresas locais da sua região ou insira um registro customizado manual.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
            Ou cadastre um lead manualmente agora
          </button>
        </div>
      ) : (
        /* 3. GRID DO KANBAN DINÂMICO (Quando há leads carregados) */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {buckets.map((col) => {
            const columnLeads = savedLeads.filter(l => l.bucketId === col.id);

            return (
              <div key={col.id} className="w-80 bg-slate-100/70 border border-slate-200/60 rounded-2xl p-4 flex flex-col space-y-3 shrink-0">
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-bold text-sm text-slate-700">{col.name}</h4>
                  <span className="bg-slate-200/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {columnLeads.map((lead) => (
                    <FunilCard
                      key={lead.id}
                      lead={lead}
                      colId={col.id}
                      buckets={buckets}
                      tags={tags}
                      onMoveLead={onMoveLead}
                      onChangeLeadTag={onChangeLeadTag}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          onAddManualLead(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
