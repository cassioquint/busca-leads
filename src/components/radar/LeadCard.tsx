import React from 'react';
import { Star, Bookmark, Check } from 'lucide-react';
import type { Lead } from '@/types';

interface LeadCardProps {
  lead: Lead;
  onSave: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSave }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-sm hover:border-slate-300 transition-all flex gap-3 relative">
      
      {/* MINIATURA QUADRADA À ESQUERDA */}
      <div className="w-14 h-14 bg-indigo-50 rounded-lg overflow-hidden shrink-0 border border-indigo-100 flex items-center justify-center">
        {lead.thumbnail ? (
          <img
            src={lead.thumbnail}
            alt={lead.name}
            className="w-full h-full object-cover bg-white p-1"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Se a URL do logo falhar, exibe um placeholder limpo
              e.currentTarget.src = 'https://placehold.co/150x150/e2e8f0/64748b?text=Logo+Off';
            }}
          />
        ) : (
          <span className="text-2xl font-black text-indigo-400 uppercase">
            {lead.name ? lead.name.charAt(0) : '?'}
          </span>
        )}
      </div>

      {/* BLOCO DE TEXTOS E INFORMAÇÕES */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5">
        
        {/* TÍTULO E SEGMENTO */}
        <div className="space-y-0.5">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-bold text-slate-900 text-xs leading-snug truncate pr-1 flex-1" title={lead.name}>
              {lead.name}
            </h4>
            
            {/* Avaliação Estrelas Compacta */}
            {lead.rating && (
              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-black shrink-0 pt-0.5">
                <Star className="w-3 h-3 fill-current" />
                <span>{lead.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] bg-slate-50 border border-slate-200/50 text-slate-500 font-bold px-1 py-0.5 rounded capitalize">
              {lead.type}
            </span>
            {lead.instagram && (
              <a 
                href={lead.instagram.startsWith('http') ? lead.instagram : `https://${lead.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-5 h-5 bg-pink-50 text-pink-500 hover:bg-pink-100 hover:text-pink-600 rounded border border-pink-100 transition-colors cursor-pointer"
                title="Ver Instagram"
              >
               <img src="/instagram.svg" alt="Instagram" className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* ENDEREÇO E TELEFONE COMPACTADOS */}
        <div className="text-[11px] text-slate-500 space-y-0.5">
          {lead.phone && lead.phone !== 'Sem Telefone' && (
            <p className="font-semibold text-slate-700">{lead.phone}</p>
          )}
          <p className="truncate text-slate-400" title={lead.address}>{lead.address}</p>
        </div>

        {/* BOTÃO ÚNICO DE SALVAMENTO */}
        <div className="pt-1.5 border-t border-slate-50">
          <button
            type="button"
            onClick={() => !lead.isSaved && onSave(lead.id)}
            disabled={lead.isSaved}
            className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
              lead.isSaved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:shadow-sm'
            }`}
          >
            {lead.isSaved ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Salvo no Funil</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3 h-3" />
                <span>Mover para o Kanban</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};