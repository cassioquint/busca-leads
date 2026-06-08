import React from 'react';
import { X, Sparkles, AlertCircle, KanbanSquare, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LimitModalProps {
  onGoToPricing: () => void;
}

export const LimitModal: React.FC<LimitModalProps> = ({ onGoToPricing }) => {
  const { limitModalType, setLimitModalType, user } = useAuth();

  // Se o modal não estiver ativo para nenhum bloqueio, não renderiza nada
  if (!limitModalType) return null;

  const onClose = () => setLimitModalType(null);

  const isSearchesLimit = limitModalType === 'SEARCHES_LIMIT';
  const planName = user?.plan?.name || 'Degustação';

  const isFeatureBlocked = user?.plan && (!user.plan.bulkImportAllowed || !user.plan.exportAllowed);

  const getContent = () => {
    if (isSearchesLimit) {
      return {
        title: 'Ah não! Suas buscas acabaram...',
        description: (
          <>
            Você atingiu o limite máximo de <span className="font-bold text-slate-800">{user?.plan?.maxSearchesPerMonth ?? 15} buscas</span> mensais disponíveis no seu plano <span className="text-indigo-600 font-bold">{planName}</span>.
          </>
        ),
        badgeIcon: <Search className="w-4 h-4 fill-indigo-100" />,
        badgeTitle: 'Desbloqueie o Radar Ilimitado',
        badgeText: 'Assine um dos nossos pacotes comerciais para liberar importações em lote, exportação de relatórios e buscas sem travas.'
      };
    }

    if (isFeatureBlocked) {
      return {
        title: 'Ops... Recurso não disponível',
        description: (
          <>
            Faça o upgrade do seu plano para utilizar as ferramentas de <span className="font-bold text-slate-800">importação e exportação via planilha</span> no BuscaLeads.
          </>
        ),
        badgeIcon: <Sparkles className="w-4 h-4 fill-indigo-100 text-indigo-600" />,
        badgeTitle: 'Liberar Ferramentas de Produtividade',
        badgeText: 'Acelere sua rotina trazendo listas prontas do Excel diretamente para o seu pipeline e exporte relatórios comerciais em segundos.'
      };
    }

    // Cenário padrão: O plano permite o recurso, mas atingiu a capacidade volumétrica do Kanban
    return {
      title: 'Atenção! Seu funil está cheio...',
      description: (
        <>
          Você atingiu o limite de armazenamento de <span className="font-bold text-slate-800">{user?.plan?.maxLeadsInFunnel ?? 20} leads ativos</span> simultâneos no quadro do plano <span className="text-indigo-600 font-bold">{planName}</span>.
        </>
      ),
      badgeIcon: <KanbanSquare className="w-4 h-4" />,
      badgeTitle: 'Aumente a Capacidade do Kanban',
      badgeText: 'Gere mais prospecções ativas limpando leads antigos ou fazendo upgrade para gerenciar centenas de empresas sem barreiras.'
    };
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* BACKDROP ESCURO ACETINADO */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CONTAINER DO MODAL */}
      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200 z-10">
        
        {/* BOTÃO FECHAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ILUSTRAÇÃO: CARINHA CHORANDO EM TAILWIND ANIMADA */}
        <div className="relative pt-2">
          {/* Cabeça */}
          <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex flex-col items-center justify-center relative shadow-sm">
            {/* Olhos Tristes */}
            <div className="flex gap-5 mt-2">
              <div className="w-2.5 h-1.5 bg-slate-700 rounded-t-full relative">
                {/* Lágrima Esquerda caindo */}
                <div className="absolute top-2 left-0 w-2 h-3 bg-sky-400 rounded-b-full animate-bounce" />
              </div>
              <div className="w-2.5 h-1.5 bg-slate-700 rounded-t-full relative">
                {/* Lágrima Direita caindo */}
                <div className="absolute top-2 right-0 w-2 h-4 bg-sky-400 rounded-b-full animate-pulse" />
              </div>
            </div>
            
            {/* Boca de Choro Invertida */}
            <div className="w-6 h-3 border-t-2 border-slate-700 rounded-t-full mt-4" />
          </div>
          
          {/* Badge de Alerta sutil */}
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* MENSAGEM DINÂMICA */}
        <div className="space-y-2">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {content.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
            {content.description}
          </p>
        </div>

        {/* CONTEXTO DE BENEFÍCIO DINÂMICO */}
        <div className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 text-left flex items-start gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            {content.badgeIcon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{content.badgeTitle}</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal">
              {content.badgeText}
            </p>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToPricing();
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Ver Planos e Preços</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white hover:bg-slate-50 text-slate-500 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            Voltar depois
          </button>
        </div>
      </div>
    </div>
  );
};