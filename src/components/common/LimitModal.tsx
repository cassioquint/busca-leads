import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, KanbanSquare, Search, Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/services/api/users';

interface LimitModalProps {
  onGoToPricing: () => void;
}

// 1. DICIONÁRIO DE CONTEÚDOS
// Mapeamos os erros específicos conhecidos. O que não estiver aqui, cai no DEFAULT.
const MODAL_CONTENT_MAP: Record<string, any> = {
  SEARCHES_LIMIT: {
    title: 'Ah não! Suas buscas acabaram...',
    getDescription: (planName: string, max: number) => (
      <>Você atingiu o limite máximo de <span className="font-bold text-slate-800">{max} buscas</span> mensais disponíveis no seu plano <span className="text-indigo-600 font-bold">{planName}</span>.</>
    ),
    badgeIcon: <Search className="w-4 h-4 fill-indigo-100" />,
    badgeTitle: 'Desbloqueie o Radar Ilimitado',
    badgeText: 'Assine um dos nossos pacotes comerciais para liberar importações em lote, exportação de relatórios e buscas sem travas.'
  },
  FUNNEL_LIMIT: {
    title: 'Atenção! Seu funil está cheio...',
    getDescription: (planName: string, max: number) => (
      <>Você atingiu o limite de armazenamento de <span className="font-bold text-slate-800">{max} leads ativos</span> simultâneos no quadro do plano <span className="text-indigo-600 font-bold">{planName}</span>.</>
    ),
    badgeIcon: <KanbanSquare className="w-4 h-4" />,
    badgeTitle: 'Aumente a Capacidade do Kanban',
    badgeText: 'Gere mais prospecções ativas limpando leads antigos ou fazendo upgrade para gerenciar centenas de empresas sem barreiras.'
  },
  AI_USAGE_LIMIT: {
    title: 'Degustação da IA Concluída!',
    getDescription: () => (
      <>Você utilizou todos os seus créditos gratuitos de <span className="font-bold text-slate-800">Inteligência Artificial</span>. Faça o upgrade para automatizar suas respostas ilimitadamente.</>
    ),
    badgeIcon: <Zap className="w-4 h-4 text-indigo-600 fill-indigo-100" />,
    badgeTitle: 'Automatize suas Vendas',
    badgeText: 'Deixe a IA analisar o perfil do cliente e redigir objeções personalizadas com o seu tom de voz em segundos.'
  },
  DEFAULT: {
    title: 'Recurso Exclusivo PRO',
    getDescription: () => (
      <>Faça o upgrade do seu plano para utilizar esta e outras <span className="font-bold text-slate-800">ferramentas avançadas</span> de produtividade no BuscaLeads.</>
    ),
    badgeIcon: <Sparkles className="w-4 h-4 fill-indigo-100 text-indigo-600" />,
    badgeTitle: 'Acelere sua Rotina',
    badgeText: 'O plano PRO desbloqueia ferramentas de automação, relatórios, importação de planilhas e muito mais para escalar seu negócio.'
  }
};

export const LimitModal: React.FC<LimitModalProps> = ({ onGoToPricing }) => {
  const { limitModalType, setLimitModalType, getFirebaseToken, user } = useAuth();
  const [isConnectingGateway, setIsConnectingGateway] = useState(false);

  if (!limitModalType) return null;

  const onClose = () => setLimitModalType(null);

  const planName = user?.plan?.name || 'Degustação';

  // 2. SELEÇÃO DINÂMICA
  // Pega o conteúdo do dicionário com base na string do state. Se não achar, usa o DEFAULT.
  const contentConfig = MODAL_CONTENT_MAP[limitModalType] || MODAL_CONTENT_MAP.DEFAULT;

  // Como as buscas e funil precisam de variáveis numéricas, passamos dinamicamente (usando fallback para não quebrar)
  const maxLimit = limitModalType === 'SEARCHES_LIMIT'
    ? (user?.plan?.maxSearchesPerMonth ?? 15)
    : (user?.plan?.maxLeadsInFunnel ?? 20);

  const handleUpgradeAction = async () => {
    // 3. CHECKOUT RÁPIDO GENÉRICO
    // Qualquer trava permite o checkout rápido se o usuário já tiver o ID do Asaas
    if (user?.asaasCustomerId) {
      setIsConnectingGateway(true);
      try {
        const token = await getFirebaseToken();

        if (!token) throw new Error('Token ausente.');

        const response = await userApi.initializeCheckout(token, {
          planKey: 'pro',
          billingType: 'UNDEFINED'
        });

        if (response.url) {
          window.open(response.url, '_blank');
          onClose();
          return;
        }
      } catch (error) {
        console.error('❌ Falha ao acionar checkout rápido:', error);
        onClose();
        onGoToPricing();
      } finally {
        setIsConnectingGateway(false);
      }
    } else {
      onClose();
      onGoToPricing();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200 z-10">

        <button
          type="button"
          onClick={onClose}
          disabled={isConnectingGateway}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer focus:outline-none disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative pt-2">
          <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex flex-col items-center justify-center relative shadow-sm">
            <div className="flex gap-5 mt-2">
              <div className="w-2.5 h-1.5 bg-slate-700 rounded-t-full relative">
                <div className="absolute top-2 left-0 w-2 h-3 bg-sky-400 rounded-b-full animate-bounce" />
              </div>
              <div className="w-2.5 h-1.5 bg-slate-700 rounded-t-full relative">
                <div className="absolute top-2 right-0 w-2 h-4 bg-sky-400 rounded-b-full animate-pulse" />
              </div>
            </div>
            <div className="w-6 h-3 border-t-2 border-slate-700 rounded-t-full mt-4" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {contentConfig.title}
          </h2>
          <div className="text-xs text-slate-500 font-medium leading-relaxed px-2">
            {contentConfig.getDescription(planName, maxLimit)}
          </div>
        </div>

        <div className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 text-left flex items-start gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            {contentConfig.badgeIcon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{contentConfig.badgeTitle}</h4>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal">
              {contentConfig.badgeText}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleUpgradeAction}
            disabled={isConnectingGateway}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isConnectingGateway ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Conectando ao Asaas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>{user?.asaasCustomerId ? 'Ativar Plano Pro Agora' : 'Ver Planos e Preços'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isConnectingGateway}
            className="w-full bg-white hover:bg-slate-50 text-slate-500 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer focus:outline-none disabled:opacity-30"
          >
            Voltar depois
          </button>
        </div>
      </div>
    </div>
  );
};
