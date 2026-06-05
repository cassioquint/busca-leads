import React, { useState } from 'react';
import type { Lead, Tag } from '@/types';
import { Plus, UserPlus, Tag as TagIcon, Loader2 } from 'lucide-react';
import { AddLeadModal, AddColumnModal, FunilColumn } from './';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';

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
  onAddManualLead: (data: { title: string; phone: string; notes?: string }) => void;
  onCreateColumn: (name: string) => void;
  onManageTags: () => void;
  onChangeLeadTag: (leadId: string, tagId: string | null) => void;
  onDeleteLead: (id: string) => void;
  onUpdateLeadNotes: (id: string, notes: string, phone: string) => void;
  onRenameColumn: (id: string, newName: string) => void;
  onDeleteColumn: (id: string) => void;
  onMoveColumn: (id: string, direction: 'left' | 'right') => void;
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
  onChangeLeadTag,
  onDeleteLead,
  onUpdateLeadNotes,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // 🌟 NOVOS ESTADOS: Gerenciamento de Operações das Colunas
  const [activeColumn, setActiveColumn] = useState<Bucket | null>(null);
  const [isEditColumnMode, setIsEditColumnMode] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);

  const savedLeads = leads.filter(l => l.isSaved);

  const handleOpenCreateColumn = () => {
    setActiveColumn(null);
    setIsEditColumnMode(false);
    setIsColumnModalOpen(true);
  };

  const handleOpenRenameColumn = (id: string) => {
    const target = buckets.find(b => b.id === id);
    if (target) {
      setActiveColumn(target);
      setIsEditColumnMode(true);
      setIsColumnModalOpen(true);
    }
  };

  const handleOpenDeleteColumn = (id: string) => {
    const target = buckets.find(b => b.id === id);
    if (target) {
      setActiveColumn(target);
      setShowDeleteColumnModal(true);
    }
  };

  const handleConfirmDeleteColumn = () => {
    if (!activeColumn) return;

    const columnLeads = savedLeads.filter(l => l.bucketId === activeColumn.id);
    if (columnLeads.length > 0) {
      alert("Ação Interrompida: Esta coluna possui leads vinculados. Transfira os leads antes de remover.");
      setShowDeleteColumnModal(false);
      return;
    }

    onDeleteColumn(activeColumn.id);
    setShowDeleteColumnModal(false);
    setActiveColumn(null);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden p-6 space-y-6">

      {/* CABEÇALHO DO FUNIL */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
          <p className="text-sm text-slate-500">
            {isLoading ? 'Buscando seu pipeline...' : `${savedLeads.length} leads no pipeline`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onManageTags}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <TagIcon className="w-4 h-4 text-slate-400" />
            <span>Rótulos</span>
          </button>

          <button
            onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Lead</span>
          </button>

          <button
            onClick={handleOpenCreateColumn}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Coluna</span>
          </button>
        </div>
      </div>

      {/* CORE DE TELAS */}
      {isLoading ? (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <h3 className="text-base font-semibold text-slate-700">Carregando seu CRM...</h3>
        </div>
      ) : savedLeads.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border-2 border-dashed border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-4 overflow-y-auto">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full"><UserPlus className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold text-slate-800">Seu funil está limpo</h3>
          <p className="text-sm text-slate-500 max-w-md">Use o "Radar de Prospecção" ao lado para capturar empresas.</p>
          <button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
            Ou cadastre um lead manualmente agora
          </button>
        </div>
      ) : (
        /* GRID KANBAN REESTRUTURADO */
        <div className="flex-1 flex gap-4 overflow-x-auto pb-3 items-start custom-scrollbar">
          {buckets.map((col, index) => (
            <FunilColumn
              key={col.id}
              col={col}
              columnLeads={savedLeads.filter(l => l.bucketId === col.id)}
              buckets={buckets}
              tags={tags}
              onMoveLead={onMoveLead}
              onChangeLeadTag={onChangeLeadTag}
              onDeleteLead={onDeleteLead}
              onRenameColumn={handleOpenRenameColumn} // 🌟 Escuta o chamado de edição
              onDeleteColumn={handleOpenDeleteColumn} // 🌟 Escuta o chamado de exclusão
              onMoveColumn={onMoveColumn}
              isFirst={index === 0}
              isLast={index === buckets.length - 1}
              onCardClick={(clickedLead) => {
                setEditingLead(clickedLead);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* ADD/EDIT LEAD MODAL */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
        initialLead={editingLead}
        isEditMode={!!editingLead}
        onSubmit={(data) => {
          if (editingLead) {
            onUpdateLeadNotes(editingLead.id, data.notes, data.phone);
          } else {
            onAddManualLead(data);
          }
          setIsModalOpen(false);
          setEditingLead(null);
        }}
      />

      {/* 🌟 ADAPTADO: MODAL DE COLUNA COMPARTILHADO (Cria ou Edita) */}
      <AddColumnModal
        key={activeColumn ? `edit-${activeColumn.id}` : 'create'}
        isOpen={isColumnModalOpen}
        onClose={() => { setIsColumnModalOpen(false); setActiveColumn(null); }}
        initialColumn={activeColumn}
        isEditMode={isEditColumnMode}
        onSubmit={(name) => {
          if (isEditColumnMode && activeColumn) {
            onRenameColumn(activeColumn.id, name);
          } else {
            onCreateColumn(name);
          }
        }}
      />

      {showDeleteColumnModal && activeColumn && (
        <ConfirmDeleteModal
          isOpen={showDeleteColumnModal && !!activeColumn}
          onClose={() => { setShowDeleteColumnModal(false); setActiveColumn(null); }}
          onConfirm={handleConfirmDeleteColumn}
          title="Excluir esta coluna?"
          description={activeColumn.name}
        />
      )}
    </div>
  );
};