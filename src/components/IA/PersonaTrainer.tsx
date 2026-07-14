import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, BrainCircuit, CheckCircle, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'lead' | 'vendor';
  content: string;
}

interface PersonaTrainerProps {
  onClose: () => void;
  onSavePersona: (vendorMessages: string[]) => Promise<void>;
  onLeadReply: (vendorText: string) => Promise<string>; 
  serviceContext?: string;
}

export const PersonaTrainer: React.FC<PersonaTrainerProps> = ({ 
  onClose, 
  onSavePersona,
  onLeadReply,
  serviceContext = "seus serviços"
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'lead',
      content: `Olá! Vi o anúncio de vocês sobre ${serviceContext || "seus serviços"}, mas achei a proposta inicial meio fora do que eu estava planejando. Por que eu deveria fechar com vocês agora?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const vendorRepliesCount = messages.filter(m => m.role === 'vendor').length;
  const targetReplies = 3; 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const vendorText = input;
    const newUserMessage: Message = { id: Date.now().toString(), role: 'vendor', content: vendorText };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsProcessing(true);

    // Se ainda não atingiu a meta, bate no backend para o Groq gerar a objeção
    if (vendorRepliesCount + 1 < targetReplies) {
      try {
        const aiResponse = await onLeadReply(vendorText);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'lead',
          content: aiResponse
        }]);
      } catch (error) {
        console.error("Erro ao obter resposta do lead simulado", error);
        // Fallback genérico caso a rede falhe
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'lead',
          content: "Compreendo. Mas qual seria a principal vantagem a longo prazo?"
        }]);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const finishTraining = async () => {
    setIsProcessing(true);
    try {
      const vendorOnlyMessages = messages
        .filter(m => m.role === 'vendor')
        .map(m => m.content);
      
      await onSavePersona(vendorOnlyMessages);
      setIsTrainingComplete(true);
    } catch (error) {
      console.error(error);
      alert('Erro ao processar o perfil da IA.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isTrainingComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto border border-indigo-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Personalidade Clonada!</h3>
        <p className="text-sm text-slate-500 mb-6">
          A IA analisou seus argumentos e seu modo de escrever. A partir de agora, as respostas geradas terão a sua assinatura.
        </p>
        <button onClick={onClose} className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer">
          Voltar ao Copiloto
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-lg mx-auto bg-slate-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Treinamento de Persona</h3>
            <p className="text-xs text-slate-500">Convencer o Lead ({vendorRepliesCount}/{targetReplies})</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Feed */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
        <div className="text-center mb-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            A simulação começou
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'vendor' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'vendor' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              {msg.role === 'vendor' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-600" />}
            </div>
            <div className={`p-3 text-sm rounded-2xl ${msg.role === 'vendor' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && vendorRepliesCount < targetReplies && (
          <div className="flex items-start gap-2 max-w-[85%] self-start animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {vendorRepliesCount >= targetReplies ? (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in">
            <p className="text-xs text-center text-slate-500 mb-1">Coleta de dados concluída. Pronto para gerar sua persona?</p>
            <button 
              onClick={finishTraining} 
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? 'Extraindo Personalidade...' : 'Finalizar Treinamento'}
              {!isProcessing && <BrainCircuit className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              placeholder="Responda ao lead com suas palavras..."
              className="w-full text-sm bg-transparent resize-none focus:outline-none p-1 custom-scrollbar max-h-32 min-h-[40px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};