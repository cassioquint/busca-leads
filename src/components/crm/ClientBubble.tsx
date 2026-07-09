import React, { useState } from 'react';
import { Mic, ChevronDown, ChevronUp } from 'lucide-react';

interface ClientBubbleProps {
  content: string;
}

export const ClientBubble: React.FC<ClientBubbleProps> = ({ content }) => {
  const hasAudio = content.includes('[Áudio]:');
  const [isExpanded, setIsExpanded] = useState(false);

  // Se a mensagem contiver a tag de áudio, renderiza a versão expansível
  if (hasAudio) {
    const parts = content.split('[Áudio]:');
    const manualText = parts[0].trim();
    const audioText = parts[1].trim();

    return (
      <div className="flex flex-col gap-1 items-start w-full">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cliente</span>
        <div className="w-10/12 bg-white border border-slate-200 text-slate-700 text-sm p-3 rounded-2xl rounded-tl-sm shadow-sm">
          
          {/* Se a pessoa digitou algo antes de anexar o áudio, mostra aqui no topo */}
          {manualText && <div className="mb-3">{manualText}</div>}

          {/* Cardzinho do Áudio */}
          <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600">
              <Mic className="w-4 h-4 shrink-0" />
              <span className="font-semibold text-xs">Áudio recebido</span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 bg-white shadow-sm border border-slate-200 hover:border-indigo-200 px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {isExpanded ? 'Ocultar' : 'Transcrição'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* O texto transcrito expandido */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-slate-600 italic text-sm animate-in slide-in-from-top-2 fade-in duration-200">
              "{audioText}"
            </div>
          )}
        </div>
      </div>
    );
  }

  // Se for uma mensagem de texto normal, desenha o balão clássico
  return (
    <div className="flex flex-col gap-1 items-start w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cliente</span>
      <div className="w-10/12 bg-white border border-slate-200 text-slate-700 text-sm p-3 rounded-2xl rounded-tl-sm shadow-sm">
        {content}
      </div>
    </div>
  );
};