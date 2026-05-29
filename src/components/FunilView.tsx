import React, { useState } from 'react';
import type { Lead } from '../types';
import { Plus, UserPlus } from 'lucide-react';
import { FunilCard } from './FunilCard';
import { AddLeadModal } from './AddLeadModal';

interface FunilViewProps {
  leads: Lead[];
  onMoveLead: (id: string, direction: 'forward' | 'backward') => void;
  onAddManualLead: (data: any) => void;
}

export const FunilView: React.FC<FunilViewProps> = ({ leads, onMoveLead, onAddManualLead }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: 'abordar', title: 'A Abordar' },
    { id: 'contato', title: 'Contato Efetuado' },
    { id: 'proposta', title: 'Proposta Enviada' },
    { id: 'negociacao', title: 'Em Negociação' },
  ];

  const savedLeads = leads.filter(l => l.isSaved);

  return (
    <div className="space-y-6">

      {/* CABEÇALHO DO FUNIL */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
          <p className="text-sm text-slate-500">{savedLeads.length} leads no pipeline</p>
        </div>
        <div className="flex items-center gap-3">

          {/* BOTÃO NOVO LEAD MANUAL */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nova Coluna</span>
          </button>
        </div>
      </div>

      {savedLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200/80 p-16 text-center shadow-sm max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center space-y-4">
          {/* ... conteúdo do estado vazio ... */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
          >
            Ou cadastre um lead manualmente agora
          </button>
        </div>
      ) : (
        /* GRID DO KANBAN POPULADO */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {columns.map((col) => {
            const columnLeads = savedLeads.filter(l => l.bucket === col.id);

            return (
              <div key={col.id} className="w-80 bg-slate-100/70 border border-slate-200/60 rounded-2xl p-4 flex flex-col space-y-3 shrink-0">

                {/* TÍTULO DA COLUNA */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-bold text-sm text-slate-700">{col.title}</h4>
                  <span className="bg-slate-200/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">
                    {columnLeads.length}
                  </span>
                </div>

                {/* LISTA DE CARDS */}
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {columnLeads.map((lead) => (
                    // 🔥 Olha como a chamada do card ficou limpa!
                    <FunilCard
                      key={lead.id}
                      lead={lead}
                      colId={col.id}
                      onMoveLead={onMoveLead}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE ADICIONAR LEAD */}
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