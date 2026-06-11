import React, { useState } from 'react';
import { ShieldCheck, Award, Zap, ExternalLink, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileDataForm } from './profile/ProfileDataForm';
import { BillingDataForm } from './profile/BillingDataForm';
import { SecurityForm } from './profile/SecurityForm';
import { userApi } from '@/services/api/users';
import { CancelPlanModal } from '@/components/plans/CancelPlanModal';
import type { User as FirebaseUser } from 'firebase/auth';

interface ProfileViewProps {
  onNavigateBack: () => void;
  onNavigateToPricing?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateBack, onNavigateToPricing }) => {
  const { user, getFirebaseToken, refreshUserData } = useAuth();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [portalError, setPortalError] = useState('');

  // Estados para controle de retenção/cancelamento
  const [showCancelModal, setShowCancelModal] = useState(false);

  const plano = user?.plan;
  const buscasRealizadas = user?.searchesThisMonth ?? 0;
  const limiteBuscas = plano?.maxSearchesPerMonth ?? 15;
  const percentualUso = Math.min(Math.round((buscasRealizadas / limiteBuscas) * 100), 100);
  const firebaseUserInstance = user as unknown as FirebaseUser;

  const isFreeUser = !plano || plano.id === 'free';

  // Abre o painel financeiro do cliente direto no Asaas
  const handleOpenBillingPortal = async () => {
    setLoadingPortal(true);
    setPortalError('');
    try {
      const token = await getFirebaseToken();
      if (!token) throw new Error('Sessão expirada. Refaça o login.');
      const response = await userApi.getCustomerPortal(token);
      if (response.url) {
        window.open(response.url, '_blank');
        await refreshUserData();
      }
    } catch (error) {
      console.error('Erro ao acessar o portal financeiro:', error);
      setPortalError(error instanceof Error ? error.message : 'Não foi possível carregar o painel de faturamento.');
    } finally {
      setLoadingPortal(false);
    }
  };

  // Executa a solicitação de cancelamento de plano (rebaixamento para Free)
  const handleCancelSubscription = async () => {
    setLoadingCancel(true);
    try {
      const token = await getFirebaseToken();
      if (!token) throw new Error('Sessão expirada. Refaça o login.');

      await userApi.cancelSubscription(token);
      
      // Sincroniza o novo estado do usuário (planId voltando para o free, etc.)
      await refreshUserData();
      
      // Fecha o modal de retenção de forma limpa
      setShowCancelModal(false);
      
      onNavigateBack();

    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      const msg = error instanceof Error ? error.message : 'Falha interna ao processar cancelamento.';
      
      // Aqui mantemos um feedback ou setamos em um estado de erro caso o backend recuse
      alert(`Não foi possível cancelar: ${msg}`);
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto px-4 py-8 custom-scrollbar">
      <div className="max-w-[640px] mx-auto space-y-6 pb-12">

        {/* TÍTULO E BOTÃO VOLTAR */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
            <p className="text-xs text-slate-500">Gerencie as configurações da sua conta BuscaLeads</p>
          </div>

          <button
            type="button"
            onClick={onNavigateBack}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao Funil
          </button>
        </div>

        {/* COMPONENTE 1: FORMULÁRIO DE DADOS CADASTRAIS */}
        <ProfileDataForm user={firebaseUserInstance} />

        {/* ENDEREÇO E FATURAMENTO */}
        <BillingDataForm user={user} />

        {/* DETALHES DO PLANO ATUAL DO USUÁRIO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Plano Atual</h3>
                <p className="text-xs text-slate-500">Sua assinatura ativa na plataforma</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="inline-flex items-center gap-1 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                <Zap className="w-2.5 h-2.5 fill-white" />
                {plano?.name || 'Degustação'}
              </span>

              {/* 🌟 LINK DE UPGRADE/MIGRAÇÃO DE PLANO */}
              {onNavigateToPricing && (
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  <RefreshCw className="w-3 h-3" />
                  {isFreeUser ? 'Fazer Upgrade' : 'Alterar plano'}
                </button>
              )}
            </div>
          </div>

          {/* Barra de Progresso de Consumo de Créditos de Busca */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Buscas efetuadas este mês</span>
              <span className="text-slate-900">{buscasRealizadas} / {limiteBuscas}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${percentualUso > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                style={{ width: `${percentualUso}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Sua cota de buscas de radar é renovada automaticamente a cada ciclo de 30 dias.
            </p>
          </div>

          {/* GESTÃO FINANCEIRA (Exibida apenas se o usuário tiver cadastro no Asaas) */}
          {user?.asaasCustomerId && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Dados de Faturamento & Notas</span>
                  <span className="text-[10px] text-slate-400 font-medium">Altere o cartão, veja o PIX atual ou baixe suas Notas Fiscais.</span>
                </div>

                <button
                  type="button"
                  disabled={loadingPortal}
                  onClick={handleOpenBillingPortal}
                  className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none disabled:opacity-50"
                >
                  {loadingPortal ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Painel Financeiro</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </>
                  )}
                </button>
              </div>

              {portalError && (
                <p className="text-[10px] font-semibold text-rose-500 bg-rose-50/50 border border-rose-100 p-2 rounded-xl text-center mt-1">
                  {portalError}
                </p>
              )}
            </div>
          )}
        </div>

        {firebaseUserInstance?.providerData?.some(p => p.providerId === 'password') && (
          <SecurityForm user={firebaseUserInstance} />
        )}

        {/* BOTÃO DE CANCELAMENTO TOTALMENTE ESCONDIDO E DISCRETO NO RODAPÉ */}
        {!isFreeUser && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="text-[10px] font-medium text-slate-400 hover:text-rose-500 underline transition-colors cursor-pointer focus:outline-none"
            >
              Desejo encerrar ou cancelar minha assinatura recorrente
            </button>
          </div>
        )}

        {/* RODAPÉ DE SEGURANÇA */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sua conta é protegida por criptografia de ponta a ponta.</span>
        </div>
      </div>

      {/* 🌟 MODAL DE RETENÇÃO ANTI-CHURN (Corta na dor do cliente) */}
      {showCancelModal && (
        <CancelPlanModal
          isOpen={showCancelModal}
          isLoading={loadingCancel}
          maxSearches={limiteBuscas}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelSubscription}
        />
      )}
    </div>
  );
};