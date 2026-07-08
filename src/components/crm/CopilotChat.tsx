import React, { useState } from 'react';
import { Sparkles, Copy, Settings, MessageCircle, Send } from 'lucide-react';

interface CopilotChatProps {
  aiMessage: string;
  setAiMessage: (msg: string) => void;
  isGeneratingAI: boolean;
  isGeneratingReply?: boolean;
  onGenerateAIPitch: () => void;
  onGenerateReply?: (clientResponse: string) => void;
  onOpenAIConfig?: () => void;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  aiMessage,
  setAiMessage,
  isGeneratingAI,
  isGeneratingReply,
  onGenerateAIPitch,
  onGenerateReply,
  onOpenAIConfig
}) => {
  // Estado local para guardar o que a Elis vai colar do WhatsApp
  const [clientInput, setClientInput] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiMessage);
    alert('Mensagem copiada para a área de transferência!');
  };

  const handleReplySubmit = () => {
    if (!clientInput.trim() || !onGenerateReply) return;
    onGenerateReply(clientInput);
    setClientInput('');
  };

  return (
    <div className="flex flex-col h-full bg-indigo-50/30">
      {/* Header do Chat */}
      <div className="p-4 border-b border-indigo-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-indigo-950">Copiloto de Vendas</h4>
        </div>
        
        <div className="flex items-center gap-2">
          {onOpenAIConfig && (
            <button type="button" onClick={onOpenAIConfig} className="p-1.5 hover:bg-indigo-100 text-indigo-400 hover:text-indigo-700 rounded-md transition-colors cursor-pointer" title="Configurar IA">
              <Settings className="w-4 h-4" />
            </button>
          )}
          <button type="button" onClick={onGenerateAIPitch} disabled={isGeneratingAI || isGeneratingReply} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer">
            {isGeneratingAI ? 'Gerando...' : 'Nova Abordagem'}
          </button>
        </div>
      </div>

      {/* Feed do Chat */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {aiMessage ? (
          <>
            {/* Balão da IA (Sua Mensagem) */}
            <div className="flex flex-col gap-1 items-end animate-in fade-in slide-in-from-right-4 duration-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Mensagem Sugerida</span>
              <div className="relative group w-11/12">
                <textarea
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  className="w-full h-32 text-sm text-indigo-900 p-3 rounded-2xl rounded-tr-sm border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/50 resize-none shadow-sm"
                />
                <button type="button" onClick={copyToClipboard} className="absolute top-2 right-2 p-1.5 bg-white hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm" title="Copiar mensagem">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Input da Resposta do Cliente */}
            <div className="flex flex-col gap-1 items-start mt-auto animate-in fade-in duration-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">O que o cliente respondeu?</span>
              <div className="w-full bg-white border border-slate-200 p-2 rounded-2xl rounded-tl-sm shadow-sm flex items-end gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <MessageCircle className="w-5 h-5 text-slate-400 mb-2 ml-1 shrink-0" />
                <textarea
                  value={clientInput}
                  onChange={(e) => setClientInput(e.target.value)}
                  placeholder="Cole a objeção ou dúvida do cliente aqui..."
                  rows={2}
                  className="w-full text-sm text-slate-700 bg-transparent resize-none focus:outline-none py-1.5"
                />
                <button 
                  type="button" 
                  onClick={handleReplySubmit}
                  disabled={!clientInput.trim() || isGeneratingReply}
                  className="p-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 mb-0.5"
                  title="Gerar Tréplica"
                >
                  {isGeneratingReply ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  ) : (
                    <Send className="w-4 h-4 ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
            <p className="text-xs text-indigo-900 font-medium">O Copiloto está aguardando.</p>
            <p className="text-[10px] text-indigo-600 mt-1">Gere uma nova abordagem para iniciar a conversa.</p>
          </div>
        )}
      </div>
    </div>
  );
};