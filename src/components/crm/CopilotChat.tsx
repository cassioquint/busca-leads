import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Settings, MessageCircle, Send, Paperclip } from 'lucide-react';
import type { LeadInteraction } from '@/types';
import { ClientBubble } from './ClientBubble';
import { useToast } from '@/contexts/ToastContext';

interface CopilotChatProps {
  aiMessage: string;
  setAiMessage: (msg: string) => void;
  isGeneratingAI: boolean;
  isGeneratingReply?: boolean;
  onGenerateAIPitch: () => void;
  interactions: LeadInteraction[];
  isLoadingHistory?: boolean;
  onGenerateReply?: (clientResponse: string) => void;
  onTranscribeAudio?: (file: File) => Promise<string>;
  onOpenAIConfig?: () => void;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  aiMessage,
  setAiMessage,
  isGeneratingAI,
  isGeneratingReply,
  onGenerateAIPitch,
  interactions,
  isLoadingHistory,
  onGenerateReply,
  onTranscribeAudio,
  onOpenAIConfig
}) => {
  const [clientInput, setClientInput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interactions, aiMessage]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiMessage);
    showToast('Mensagem copiada para a área de transferência!', 'success');
  };

  const handleReplySubmit = () => {
    if (!clientInput.trim() || !onGenerateReply) return;
    onGenerateReply(clientInput);
    setClientInput('');
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onTranscribeAudio) return;

    setIsTranscribing(true);
    try {
      const text = await onTranscribeAudio(file);
      
      const finalMessage = clientInput.trim() 
        ? `${clientInput}\n[Áudio]: ${text}` 
        : `[Áudio]: ${text}`;
      
      if (onGenerateReply) {
        onGenerateReply(finalMessage);
        setClientInput('');
      }
    } catch (error) {
      console.error(error);
      showToast('Erro ao transcrever o áudio.', 'error');
    } finally {
      setIsTranscribing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      
      if (clientInput.trim() && !isGeneratingReply) {
        handleReplySubmit();
      }
    }
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
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
        
        {isLoadingHistory ? (
           <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold">
             <span className="animate-pulse">Carregando conversa...</span>
           </div>
        ) : interactions.length > 0 || aiMessage ? (
          <>
            {/* 🌟 Mapeia o Histórico */}
            {interactions.map((msg, index) => {
              const isLastMessage = index === interactions.length - 1;
              const isAI = msg.role === 'ai';

              // Se for a IA E for a última mensagem, renderiza o componente Editável
              if (isAI && isLastMessage) {
                return (
                  <div key={msg.id} className="flex flex-col gap-1 items-end animate-in fade-in slide-in-from-right-2 duration-300">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Mensagem Atual (Editável)</span>
                    <div className="relative group w-11/12">
                      <textarea
                        value={aiMessage}
                        onChange={(e) => setAiMessage(e.target.value)}
                        className="w-full min-h-[120px] text-sm text-indigo-900 p-3 rounded-2xl rounded-tr-sm border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/80 resize-y shadow-sm font-medium"
                      />
                      <button type="button" onClick={copyToClipboard} className="absolute top-2 right-2 p-1.5 bg-white hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm" title="Copiar mensagem">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Se for mensagem antiga da IA (Estática)
              if (isAI) {
                return (
                  <div key={msg.id} className="flex flex-col gap-1 items-end opacity-75 hover:opacity-100 transition-opacity">
                    <div className="w-10/12 bg-indigo-100 text-indigo-900 text-sm p-3 rounded-2xl rounded-tr-sm shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // 🌟 Se for mensagem do Cliente, usamos o nosso novo Componente Inteligente
              return <ClientBubble key={msg.id} content={msg.content} />;
            })}

            {/* Input da Nova Resposta do Cliente */}
            <div className="flex flex-col gap-1 items-start mt-4 animate-in fade-in duration-300 border-t border-slate-200/60 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Responder Cliente</span>
              <div className="w-full bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex items-end gap-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <MessageCircle className="w-5 h-5 text-slate-400 mb-2 ml-1 shrink-0" />
                <textarea
                  value={clientInput}
                  onChange={(e) => setClientInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isTranscribing ? "Transcrevendo áudio..." : "Cole a resposta ou suba o áudio do cliente..."}
                  disabled={isTranscribing}
                  rows={2}
                  className="w-full text-sm text-slate-700 bg-transparent resize-none focus:outline-none py-1.5"
                />
                <input 
                  type="file" 
                  accept="audio/*, video/mp4" 
                  ref={fileInputRef} 
                  onChange={handleAudioUpload} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTranscribing || isGeneratingReply}
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50 shrink-0 mb-0.5"
                  title="Transcrever Áudio"
                >
                  {isTranscribing ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin inline-block" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleReplySubmit}
                  disabled={!clientInput.trim() || isGeneratingReply}
                  className="p-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 mb-0.5"
                >
                  {isGeneratingReply ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Estado Vazio */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
            <p className="text-xs text-indigo-900 font-medium">O Copiloto está aguardando.</p>
            <p className="text-[10px] text-indigo-600 mt-1">Gere uma nova abordagem para iniciar a conversa.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};