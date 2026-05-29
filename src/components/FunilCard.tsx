import React from 'react';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Lead } from '../types';

interface FunilCardProps {
  lead: Lead;
  colId: string;
  onMoveLead: (id: string, direction: 'forward' | 'backward') => void;
}

export const FunilCard: React.FC<FunilCardProps> = ({ lead, colId, onMoveLead }) => {
  const isUrgent = lead.followUpDate === '26/05/2026'; // Mock de urgência

  const getWhatsAppLink = (phone?: string, title?: string) => {
    if (!phone || phone === 'Sem Telefone') return '';
    
    let numbers = phone.replace(/\D/g, '');
    if (numbers.length === 0) return '';

    if (!numbers.startsWith('55') && numbers.length >= 10) {
      numbers = `55${numbers}`;
    }

    const text = `Olá, ${title}! Tudo bem? Encontrei o perfil de vocês e gostaria de conversar rapidamente.`;
    
    return `https://wa.me/${numbers}?text=${encodeURIComponent(text)}`;
  };

  const waLink = getWhatsAppLink(lead.phone, lead.title);
  const hasValidPhone = waLink !== '';

  // SVG Oficial do WhatsApp isolado para manter o código limpo
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm space-y-3 relative ${
      isUrgent ? 'border-amber-400 ring-2 ring-amber-400/10' : 'border-slate-200/80'
    }`}>
      
      {/* Alerta de Retomada */}
      {isUrgent && (
        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md w-fit mb-1 border border-amber-200">
          <span>🔔 Retomar Contato Hoje!</span>
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-bold text-sm text-slate-900 leading-tight">{lead.title}</h5>
          <Clock className={`w-4 h-4 shrink-0 cursor-pointer ${isUrgent ? 'text-amber-500' : 'text-slate-400'}`} />
        </div>
        <span className="inline-block bg-slate-50 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
          {lead.type}
        </span>
      </div>

      <p className="text-xs text-slate-600 font-medium">{lead.phone}</p>
      
      {lead.followUpDate && (
        <p className="text-[11px] text-slate-400 font-medium">Follow-up: {lead.followUpDate}</p>
      )}

      {/* CONTROLES DE MOVIMENTAÇÃO */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-indigo-600 font-bold">
        <button 
          disabled={colId === 'abordar'}
          onClick={() => onMoveLead(lead.id, 'backward')}
          className="flex items-center gap-0.5 hover:text-indigo-800 disabled:opacity-0 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>
        
        {/* BOTÃO DO WHATSAPP AQUI */}
        {hasValidPhone ? (
          <a 
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="Abordar via WhatsApp"
            className="text-[#25D366] hover:text-[#1ebe57] hover:scale-110 transition-all cursor-pointer bg-[#25D366]/10 p-1.5 rounded-lg"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
        ) : (
          <div 
            title="Lead sem número de WhatsApp"
            className="text-slate-300 bg-slate-50 p-1.5 rounded-lg cursor-not-allowed"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </div>
        )}

        <button 
          disabled={colId === 'negociacao'}
          onClick={() => onMoveLead(lead.id, 'forward')}
          className="flex items-center gap-0.5 hover:text-indigo-800 disabled:opacity-0 cursor-pointer transition-colors"
        >
          <span>Avançar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};