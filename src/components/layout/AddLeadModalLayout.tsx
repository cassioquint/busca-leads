import React from 'react';
import { X, Plus, FileText } from 'lucide-react';
import { LeadDetailsForm } from './LeadDetailsForm';
import { CopilotChat } from '../crm/CopilotChat';
import type { LeadFormData, LeadInteraction } from '@/types';

// Tipagem exclusiva para a visualização
interface AddLeadModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditMode: boolean;
  isSplitView: boolean;
  
  // Estados do Form
  formData: LeadFormData;
  setFormData: React.Dispatch<React.SetStateAction<LeadFormData>>;
  
  // Estados e Funções do Chat
  aiMessage: string;
  setAiMessage: React.Dispatch<React.SetStateAction<string>>;
  interactions: LeadInteraction[];
  isLoadingHistory: boolean;
  isGeneratingAI: boolean;
  isGeneratingReply: boolean;
  onGeneratePitch: () => void;
  onGenerateReply: (clientResponse: string) => void;
  onOpenAIConfig?: () => void;
}

export const AddLeadModalLayout: React.FC<AddLeadModalLayoutProps> = ({
  isOpen, onClose, onSubmit, isEditMode, isSplitView,
  formData, setFormData,
  aiMessage, setAiMessage, interactions, isLoadingHistory,
  isGeneratingAI, isGeneratingReply, onGeneratePitch, onGenerateReply, onOpenAIConfig
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className={`relative w-full ${isSplitView ? 'max-w-5xl' : 'max-w-lg'} bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]`}>
        
        {/* Cabeçalho */}
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isEditMode ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {isEditMode ? <FileText className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditMode ? 'Detalhes do Lead e Copiloto' : 'Novo Lead Manual'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditMode ? 'Gerencie informações e gere abordagens inteligentes' : 'Cadastre um contato fora do radar'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <form onSubmit={onSubmit} className="flex flex-1 overflow-hidden">
          
          {/* Esquerda: Formulário */}
          <div className={`flex-1 p-8 overflow-y-auto ${isSplitView ? 'border-r border-slate-200' : ''}`}>
            <LeadDetailsForm formData={formData} setFormData={setFormData} isEditMode={isEditMode} />
            <div className="pt-6 flex gap-3 mt-auto">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                Fechar
              </button>
              <button type="submit" className={`flex-2 px-4 py-3 ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer`}>
                {isEditMode ? 'Salvar Alterações' : 'Adicionar ao Funil'}
              </button>
            </div>
          </div>

          {/* Direita: Copiloto */}
          {isSplitView && (
            <div className="w-[450px] shrink-0 bg-slate-50/50 flex flex-col">
              <CopilotChat 
                aiMessage={aiMessage} setAiMessage={setAiMessage}
                interactions={interactions} isLoadingHistory={isLoadingHistory}
                isGeneratingAI={isGeneratingAI} isGeneratingReply={isGeneratingReply}
                onGenerateAIPitch={onGeneratePitch} onGenerateReply={onGenerateReply}
                onOpenAIConfig={onOpenAIConfig}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};