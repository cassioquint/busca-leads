import React, { useState, useEffect } from 'react';
import type { Lead, Tag, AiConfigData, LeadInteraction } from '@/types';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AddLeadModal, AddColumnModal, FunilColumn, FunilHeader } from './';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { ManageTagsModal } from './ManageTagsModal';
import { AIConfigModal } from './AIConfigModal';

interface Bucket {
  id: string;
  name: string;
}

interface FunilViewProps {
  leads: Lead[];
  buckets: Bucket[];
  tags: Tag[];
  isLoading?: boolean;
  userEmail: string;
  onMoveLead: (id: string, direction: 'forward' | 'backward') => void;
  onAddManualLead: (data: {
    name: string;
    phone: string;
    type: string;
    address: string;
    notes?: string
  }) => void;
  onCreateColumn: (name: string) => void;
  onCreateTag: (name: string, color: string) => Promise<void>;
  onUpdateTag: (id: string, name: string, color: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  onChangeLeadTag: (leadId: string, tagId: string | null) => void;
  onDeleteLead: (id: string) => void;
  onUpdateLeadNotes: (id: string, notes: string, phone: string, aiPitch?: string) => void;
  onRenameColumn: (id: string, newName: string) => void;
  onDeleteColumn: (id: string) => void;
  onMoveColumn: (id: string, direction: 'left' | 'right') => void;
  onImportLeadsInBulk: (leads: Partial<Lead>[]) => Promise<void>;
  onGenerateAIPitch?: (leadId: string) => Promise<string>;
  onFetchInteractions?: (leadId: string) => Promise<LeadInteraction[]>;
  onGenerateAIReply?: (id: string, lastMessage: string, clientResponse: string) => Promise<string>;
  onTranscribeAudio?: (id: string, file: File) => Promise<string>;
  onSaveAiConfig: (data: AiConfigData) => Promise<void>;
}

export const FunilView: React.FC<FunilViewProps> = ({
  leads,
  buckets,
  tags,
  isLoading = false,
  userEmail,
  onMoveLead,
  onAddManualLead,
  onCreateColumn,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  onChangeLeadTag,
  onDeleteLead,
  onUpdateLeadNotes,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn,
  onImportLeadsInBulk,
  onGenerateAIPitch,
  onFetchInteractions,
  onGenerateAIReply,
  onTranscribeAudio,
  onSaveAiConfig
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeColumn, setActiveColumn] = useState<Bucket | null>(null);
  const [isEditColumnMode, setIsEditColumnMode] = useState(false);
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiConfigData | null>(null);
  const savedLeads = leads.filter(l => l.isSaved);

  // Hook para soltar confetes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('status') === 'success') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      const urlLimpa = window.location.pathname;
      window.history.replaceState({}, document.title, urlLimpa);
    }
  }, []);

  // 2. Hook de Busca de Dados (IA)
  useEffect(() => {
    const fetchConfig = async () => {
      if (!userEmail) return;
      try {
        const config = await api.getAiConfig(userEmail);
        if (config) setAiConfig(config);
      } catch (error) {
        console.error("Erro ao buscar configurações da IA", error);
      }
    };
    fetchConfig();
  }, [userEmail]);

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

      <FunilHeader
        savedLeads={savedLeads}
        buckets={buckets}
        tags={tags}
        isLoading={isLoading}
        onNewLeadClick={() => { setEditingLead(null); setIsModalOpen(true); }}
        onManageTagsClick={() => setIsTagsModalOpen(true)}
        onNewColumnClick={handleOpenCreateColumn}
        onImportLeadsInBulk={onImportLeadsInBulk}
        onManageAIConfigClick={() => setIsAIModalOpen(true)}
      />

      {/* CORE DE TELAS */}
      {isLoading ? (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <h3 className="text-base font-semibold text-slate-700">Carregando seu CRM...</h3>
        </div>
      ) : savedLeads.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border-2 border-dashed border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-4 overflow-y-auto">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Seu funil está limpo</h3>
          <p className="text-sm text-slate-500 max-w-md">Use o "Radar de Prospecção" ao lado para capturar empresas.</p>
          <button type="button" onClick={() => { setEditingLead(null); setIsModalOpen(true); }} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">
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
              onRenameColumn={handleOpenRenameColumn}
              onDeleteColumn={handleOpenDeleteColumn}
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
        key={`lead-modal-${isModalOpen ? (editingLead?.id || 'new') : 'closed'}`}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
        initialLead={editingLead}
        isEditMode={!!editingLead}
        onGenerateAIPitch={onGenerateAIPitch}
        onFetchInteractions={onFetchInteractions}
        onGenerateAIReply={onGenerateAIReply}
        onTranscribeAudio={onTranscribeAudio}
        onOpenAIConfig={() => setIsAIModalOpen(true)}
        onSubmit={(data) => {
          if (editingLead) {
            onUpdateLeadNotes(editingLead.id, data.notes, data.phone, data.aiPitch);
          } else {
            onAddManualLead(data);
          }
          setIsModalOpen(false);
          setEditingLead(null);
        }}
      />

      {/* MODAL DE COLUNA COMPARTILHADO (Cria ou Edita) */}
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

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE COLUNA */}
      <ConfirmDeleteModal
        isOpen={showDeleteColumnModal && !!activeColumn}
        onClose={() => { setShowDeleteColumnModal(false); setActiveColumn(null); }}
        onConfirm={handleConfirmDeleteColumn}
        title="Excluir esta coluna?"
        description={activeColumn ? activeColumn.name : ''}
      />

      {/* MODAL DE GERENCIAMENTO DE TAGS */}
      <ManageTagsModal
        key={isTagsModalOpen ? 'tags-open' : 'tags-closed'}
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        tags={tags}
        onCreateTag={onCreateTag}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />

      {/* MODAL DO CÉREBRO DA IA */}
      <AIConfigModal
        key={`ai-modal-${isAIModalOpen ? 'open' : 'closed'}`}
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialConfig={aiConfig}
        onSave={async (data) => {
          await onSaveAiConfig(data);
          setAiConfig(data);
        }}
      />
    </div>
  );
};