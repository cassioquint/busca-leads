import React, { useState } from 'react';
import { X, Bot, MessageSquare, Briefcase, DollarSign, ShieldAlert, Info } from 'lucide-react';
import type { AiConfigData } from '@/types';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: AiConfigData | null;
  onSave: (data: AiConfigData) => Promise<void>;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onSave
}) => {
  const [formData, setFormData] = useState<AiConfigData>({
    aiTone: initialConfig?.aiTone || 'profissional',
    service: initialConfig?.service || '',
    pricing: initialConfig?.pricing || '',
    generalRule: initialConfig?.generalRule || '',
    objectionsPlaybook: initialConfig?.objectionsPlaybook || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToneHelp, setShowToneHelp] = useState(false);

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
        
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 shadow-lg shadow-indigo-200 rounded-xl flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-indigo-950">
                Treinamento da Inteligência Artificial
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Defina como a IA deve apresentar o seu negócio aos leads
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

        {/* Formulário */}
        <form id="ai-config-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Tom de Voz */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Tom de Voz da Abordagem
              </label>
              <button
                type="button"
                onClick={() => setShowToneHelp(!showToneHelp)}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50 cursor-pointer flex items-center gap-1"
                title="Ver exemplos de abordagem"
              >
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">Exemplos</span>
              </button>
            </div>
            
            <select
              value={formData.aiTone}
              onChange={(e) => setFormData({...formData, aiTone: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-700 font-medium cursor-pointer"
            >
              <option value="profissional">Profissional e Polido (Ideal para B2B corporativo)</option>
              <option value="amigavel">Amigável e Empático (Ideal para serviços e B2C)</option>
              <option value="direta">Direto ao Ponto (Foco na dor e na solução rápida)</option>
              <option value="descontraida">Descontraído e Moderno (Ideal para agências e tech)</option>
            </select>

            {/* Painel de Ajuda Condicional */}
            {showToneHelp && (
              <div className="mt-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-slate-600 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <p className="font-semibold text-indigo-900 mb-1">O que esperar de cada tom:</p>
                <div className="space-y-2">
                  <p><strong>👔 Profissional:</strong> "Olá, [Nome]. Notei o destaque da sua empresa na região. Gostaria de apresentar uma solução projetada para otimizar seus processos..."</p>
                  <p><strong>🤝 Amigável:</strong> "Oi, [Nome]! Tudo bem? Vi que vocês têm um trabalho incrível. Imagino como deve ser a correria, por isso queria te mostrar algo que pode facilitar..."</p>
                  <p><strong>🎯 Direto ao Ponto:</strong> "Olá, [Nome]. Serei breve: ajudo empresas do seu setor a reduzir custos rapidamente. Tem 2 minutos para eu explicar como?"</p>
                  <p><strong>🤙 Descontraído:</strong> "Fala, [Nome]! Beleza? Curti muito o perfil de vocês. A gente tem uma solução super bacana que tem tudo a ver com o momento da sua empresa..."</p>
                </div>
              </div>
            )}
          </div>

          {/* O que a empresa vende */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              O que sua empresa faz ou vende?
            </label>
            <textarea 
              required
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              placeholder="Ex: Somos uma fábrica de software especializada em sistemas Node.js e integrações complexas. Vendemos automação e desenvolvimento de CRMs customizados..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-700 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Preços e Produtos */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              Tabela de Preços ou Produtos Foco (Opcional)
            </label>
            <textarea 
              value={formData.pricing}
              onChange={(e) => setFormData({...formData, pricing: e.target.value})}
              placeholder="Ex: Planos a partir de R$ 97,00 mensais. Não cobramos taxa de adesão. Focar na venda do plano anual que tem 20% de desconto."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-700 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Regras Gerais */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-500" />
              Regras e Restrições do Script (Opcional)
            </label>
            <textarea 
              value={formData.generalRule}
              onChange={(e) => setFormData({...formData, generalRule: e.target.value})}
              placeholder="Ex: Nunca dê desconto na primeira mensagem. Evite usar a palavra 'barato', use 'custo-benefício'. Sempre termine com uma pergunta aberta."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-700 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Matriz de objeções */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
              Contorno de Objeções (Playbook)
              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                Opcional
              </span>
            </label>
            <p className="text-xs text-slate-500 mb-1">
              Ensine a IA como lidar com as resistências mais comuns dos seus clientes.
            </p>
            <textarea
              value={formData.objectionsPlaybook}
              onChange={(e) => setFormData({ ...formData, objectionsPlaybook: e.target.value })}
              rows={4}
              placeholder={`Exemplos:\n- Se o cliente disser "está caro", foque no custo-benefício e ofereça parcelamento em 12x.\n- Se disser "já tenho fornecedor", pergunte sobre o tempo de resposta do suporte atual.\n- Se disser "vou pensar", pergunte qual é a principal dúvida que o impede de avançar agora.`}
              className="w-full text-sm text-slate-700 bg-white border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y custom-scrollbar placeholder:text-slate-300 placeholder:italic"
            />
          </div>

        </form>
        
        {/* Footer com botões */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-white transition-all cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="ai-config-form"
            disabled={isSaving}
            className="flex-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando Cérebro...
              </>
            ) : (
              'Salvar Configurações da IA'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};