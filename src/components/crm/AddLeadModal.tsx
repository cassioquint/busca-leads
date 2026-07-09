import React, { useState, useEffect } from 'react';
import type { Lead, LeadInteraction } from '@/types';
import { AddLeadModalLayout } from '../layout/AddLeadModalLayout';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; phone: string; address: string; notes: string, aiPitch: string }) => void;
  initialLead?: Lead | null;
  isEditMode?: boolean;
  onGenerateAIPitch?: (leadId: string) => Promise<string>;
  onFetchInteractions?: (leadId: string) => Promise<LeadInteraction[]>;
  onOpenAIConfig?: () => void;
  onGenerateAIReply?: (leadId: string, lastMessage: string, clientResponse: string) => Promise<string>;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen, onClose, onSubmit, initialLead = null, isEditMode = false,
  onGenerateAIPitch, onFetchInteractions, onOpenAIConfig, onGenerateAIReply
}) => {
  const [formData, setFormData] = useState({
    name: isEditMode ? (initialLead?.name || '') : '',
    type: isEditMode ? (initialLead?.type || '') : '',
    phone: isEditMode ? (initialLead?.phone || '') : '',
    address: isEditMode ? (initialLead?.address || '') : '',
    notes: isEditMode ? (initialLead?.notes || '') : ''
  });

  const [aiMessage, setAiMessage] = useState(isEditMode ? (initialLead?.aiPitch || '') : '');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [interactions, setInteractions] = useState<LeadInteraction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && isEditMode && initialLead?.id && onFetchInteractions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingHistory(true);
      onFetchInteractions(initialLead.id)
        .then(data => {
          setInteractions(data);
          const lastMsg = data[data.length - 1];
          if (lastMsg && lastMsg.role === 'ai') {
            setAiMessage(lastMsg.content);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoadingHistory(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, initialLead?.id]);

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
      setInteractions(prev => [
        ...prev,
        { id: Date.now().toString(), leadId: initialLead.id, role: 'ai', content: pitch }
      ]);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar abordagem com IA.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleGenerateReply = async (clientResponse: string) => {
    if (!initialLead?.id || !onGenerateAIReply) return;

    setInteractions(prev => [
      ...prev,
      { id: Date.now().toString(), leadId: initialLead.id, role: 'client', content: clientResponse }
    ]);

    setIsGeneratingReply(true);

    try {
      const newReply = await onGenerateAIReply(initialLead.id, aiMessage, clientResponse);
      setAiMessage(newReply);

      setInteractions(prev => [
        ...prev, 
        { id: Date.now().toString(), leadId: initialLead.id, role: 'ai', content: newReply }
      ]);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar tréplica com IA.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const isSplitView = Boolean(isEditMode && initialLead?.id);

  return (
    <AddLeadModalLayout
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      isSplitView={isSplitView}
      formData={formData}
      setFormData={setFormData}
      aiMessage={aiMessage}
      setAiMessage={setAiMessage}
      interactions={interactions}
      isLoadingHistory={isLoadingHistory}
      isGeneratingAI={isGeneratingAI}
      isGeneratingReply={isGeneratingReply}
      onGeneratePitch={handleGeneratePitch}
      onGenerateReply={handleGenerateReply}
      onOpenAIConfig={onOpenAIConfig}
    />
  );
};