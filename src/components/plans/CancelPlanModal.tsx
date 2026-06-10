import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface CancelPlanModalProps {
  isOpen: boolean;
  isLoading: boolean;
  maxSearches: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelPlanModal: React.FC<CancelPlanModalProps> = ({
  isOpen,
  isLoading,
  maxSearches,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-[420px] w-full overflow-hidden p-6 relative">
        
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          {/* ÍCONE DE ALERTA */}
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>

          {/* TEXTO PRINCIPAL */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Tem certeza que quer reduzir suas vendas?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ao cancelar a sua assinatura ativa, você perderá acesso imediato a recursos que alavancam seus leads diariamente:
            </p>
          </div>

          {/* LISTA DE PERDAS E DANOS (CONVERSÃO) */}
          <ul className="w-full bg-slate-50 rounded-xl p-3.5 text-left text-xs space-y-2.5 font-medium text-slate-600 border border-slate-100">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Sua cota cairá de <strong>{maxSearches}</strong> para apenas <strong>10</strong> buscas/mês.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>A exportação ativa de planilhas Excel/CSV será <strong>bloqueada</strong>.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Seu histórico acumulado no Funil do CRM será pausado.</span>
                </li>
              </ul>

          <p className="text-[10px] text-slate-400 font-medium">
            Sua assinatura atual continuará válida até o término do período faturado.
          </p>

          {/* AÇÕES DE BOTÃO */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50"
            >
              Manter meu Plano & Continuar Vendendo
            </button>
            
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className="w-full bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-500 font-bold text-[11px] py-2.5 rounded-xl transition-all cursor-pointer flex justify-center items-center h-10 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
              ) : (
                'Confirmar cancelamento e perder benefícios'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};