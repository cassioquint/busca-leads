import React from 'react';
import { Star, MessageSquare, Bookmark, Check } from 'lucide-react';
import type { Lead } from '@/types';

// A propriedade hideOnSave nem precisa mais existir aqui!
interface LeadCardProps {
  lead: Lead;
  onSave: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onSave }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md flex flex-col transition-shadow">
      {/* IMAGEM E BADGES SUPERIORES */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={lead.thumbnail}
          alt={lead.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>

      {/* CONTEÚDO DO CARD */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 leading-snug">{lead.title}</h4>
            {lead.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{lead.rating} ({lead.reviews})</span>
              </div>
            )}
          </div>

          <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md">
            {lead.type}
          </span>

          <p className="text-xs text-slate-500 line-clamp-2">{lead.address}</p>
        </div>

        {/* CONTATOS RECONHECIDOS */}
        <div className="flex gap-3 pt-2 text-xs font-semibold">
          {lead.phone && lead.phone !== 'Sem Telefone' && (
            <div className="flex items-center gap-1 text-emerald-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </div>
          )}
          {lead.instagram && (
            <div className="flex items-center gap-1 text-pink-600">
              <img
                src="/instagram.svg"
                alt="Instagram"
                className="w-3.5 h-3.5"
                style={{ filter: 'invert(31%) sepia(80%) saturate(2400%) hue-rotate(310deg)' }}
              />
              <span>{lead.instagram}</span>
            </div>
          )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => !lead.isSaved && onSave(lead.id)}
            disabled={lead.isSaved}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              lead.isSaved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {lead.isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{lead.isSaved ? 'Salvo' : 'Salvar Funil'}</span>
          </button>

          <a
            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Abordar</span>
          </a>
        </div>
      </div>
    </div>
  );
};
