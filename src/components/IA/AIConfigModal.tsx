import React, { useState } from 'react';
import { X, Bot, BrainCircuit, Settings2 } from 'lucide-react';
import type { AiConfigData } from '@/types';
import { PersonaTrainer } from './PersonaTrainer';
import { AIConfigModalForm } from '../layout/AIConfigModalForm';
import { api } from '@/services/api';

interface AIConfigModalProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: AiConfigData | null;
  onSave: (data: AiConfigData) => Promise<void>;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({
  userEmail,
  isOpen,
  onClose,
  initialConfig,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'treinamento'>('manual');

  const [formData, setFormData] = useState<AiConfigData>({
    aiTone: initialConfig?.aiTone || 'profissional',
    service: initialConfig?.service || '',
    pricing: initialConfig?.pricing || '',
    generalRule: initialConfig?.generalRule || '',
    objectionsPlaybook: initialConfig?.objectionsPlaybook || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar config da IA:', error);
      alert('Falha ao salvar as configurações da IA.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

        {/* Cabeçalho principal */}
        <div className="bg-gradient-to-r from-indigo-50 to-white px-8 pt-6 mb-4 pb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 shadow-lg shadow-indigo-200 rounded-xl flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-950">
                Cérebro do Copiloto
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Configure como a Inteligência Artificial deve atuar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sistema de Abas */}
        <div className="flex px-8 border-b border-slate-200 shrink-0 gap-6 bg-white">
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 outline-none cursor-pointer ${activeTab === 'manual'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <Settings2 className="w-4 h-4" />
            Ajustes Manuais
          </button>
          <button
            onClick={() => setActiveTab('treinamento')}
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 outline-none cursor-pointer ${activeTab === 'treinamento'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <BrainCircuit className="w-4 h-4" />
            Treinar Persona (Clone)
            <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded-md ml-1 uppercase tracking-wider font-extrabold">
              Novo
            </span>
          </button>
        </div>

        {/* Renderização Condicional do Conteúdo */}
        {activeTab === 'manual' ? (
          <AIConfigModalForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSaving={isSaving}
          />
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 flex items-start justify-center custom-scrollbar">
            <PersonaTrainer
              onClose={() => setActiveTab('manual')}
              serviceContext={formData.service}
              onLeadReply={async (vendorText) => {
                return await api.simulateLeadReply(userEmail, vendorText, formData.service);
              }}
              onSavePersona={async (msgs) => {
                await api.trainPersona(userEmail, msgs);
                alert('Cérebro treinado e salvo com sucesso!');
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};