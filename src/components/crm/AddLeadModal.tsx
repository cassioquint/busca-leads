import React, { useState } from 'react';
import { X, Plus, FileText } from 'lucide-react';
import type { Lead } from '@/types';
import { LeadDetailsForm } from '../forms/LeadDetailsForm';
import { CopilotChat } from './CopilotChat';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; phone: string; address: string; notes: string, aiPitch: string }) => void;
  initialLead?: Lead | null;
  isEditMode?: boolean;
  onGenerateAIPitch?: (leadId: string) => Promise<string>;
  onOpenAIConfig?: () => void;
  onGenerateAIReply?: (leadId: string, lastMessage: string, clientResponse: string) => Promise<string>;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialLead = null,
  isEditMode = false,
  onGenerateAIPitch,
  onOpenAIConfig,
  onGenerateAIReply
}) => {
  const [formData, setFormData] = useState({
    name: isEditMode ? (initialLead?.name || '') : '',
    type: isEditMode ? (initialLead?.type || '') : '',
    phone: isEditMode ? (initialLead?.phone || '') : '',
    address: isEditMode ? (initialLead?.address || '') : '',
    notes: isEditMode ? (initialLead?.notes || '') : ''
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState(isEditMode ? (initialLead?.aiPitch || '') : '');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, aiPitch: aiMessage });
    onClose();
  };

  const handleGeneratePitch = async () => {
    if (!initialLead?.id || !onGenerateAIPitch) return;
    setIsGeneratingAI(true);
    try {
      const pitch = await onGenerateAIPitch(initialLead.id);
      setAiMessage(pitch);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar abordagem com IA.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateReply = async (clientResponse: string) => {
    if (!initialLead?.id || !onGenerateAIReply) return;
    setIsGeneratingReply(true);
    try {
      // Envia o ID do lead, a última mensagem gerada (aiMessage atual) e a resposta do cliente
      const newReply = await onGenerateAIReply(initialLead.id, aiMessage, clientResponse);
      
      // Substitui o texto do painel pela nova tréplica pronta para uso
      setAiMessage(newReply);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar tréplica com IA.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const isSplitView = isEditMode && initialLead?.id;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Largura dinâmica: Muito largo para Split View, normal para Novo Lead */}
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
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo (Formulário) */}
        <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
          
          {/* Coluna da Esquerda: Dados do Lead */}
          <div className={`flex-1 p-8 overflow-y-auto ${isSplitView ? 'border-r border-slate-200' : ''}`}>
            <LeadDetailsForm 
              formData={formData} 
              setFormData={setFormData} 
              isEditMode={isEditMode} 
            />

            {/* Ações inferiores da Coluna Esquerda */}
            <div className="pt-6 flex gap-3 mt-auto">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer">
                Fechar
              </button>
              <button type="submit" className={`flex-2 px-4 py-3 ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer`}>
                {isEditMode ? 'Salvar Alterações' : 'Adicionar ao Funil'}
              </button>
            </div>
          </div>

          {/* Coluna da Direita: Copiloto de IA (Aparece apenas na edição) */}
          {isSplitView && (
            <div className="w-[450px] shrink-0 bg-slate-50/50 flex flex-col">
              <CopilotChat 
                aiMessage={aiMessage}
                setAiMessage={setAiMessage}
                isGeneratingAI={isGeneratingAI}
                isGeneratingReply={isGeneratingReply}
                onGenerateAIPitch={handleGeneratePitch}
                onGenerateReply={handleGenerateReply}
                onOpenAIConfig={onOpenAIConfig}
              />
            </div>
          )}

        </form>
      </div>
    </div>
  );
};