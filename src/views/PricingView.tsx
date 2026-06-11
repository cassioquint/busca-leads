import React, { useState, useEffect } from 'react';
import { Shield, Zap, Crown, HelpCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi, type CheckoutPayload, type PlanData } from '@/services/api/users';
import { PricingCard } from '@/components/plans/PricingCard';
import { BillingFormModal, type BillingModalData } from '@/components/plans/BillingFormModal';

export const PricingView: React.FC = () => {
  const { user, getFirebaseToken } = useAuth();

  // Estados para dados do banco
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState('');

  // Estados para controle de faturamento
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Carrega os planos do banco de dados na inicialização da tela
  useEffect(() => {
    const fetchPlansData = async () => {
      try {
        const token = await getFirebaseToken();
        if (!token) throw new Error('Sessão inválida.');
        
        const data = await userApi.getPlans(token);
        setPlans(data);
      } catch (error) {
        console.error(error);
        setPageError('Não foi possível carregar os planos. Tente recarregar a página.');
      } finally {
        setLoadingPage(false);
      }
    };

    fetchPlansData();
  }, [getFirebaseToken]);

  // Função auxiliar para encontrar um plano específico no array e formatar o preço
  const getPlanPrice = (slug: string): string => {
    const plan = plans.find((p) => p.slug === slug);
    if (!plan) return '0,00';
    
    return plan.price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // 🌟 CORREÇÃO 2: Mapeamento dinâmico para os nomes no modal
  const getPlanDisplayName = (key: string | null) => {
    if (!key) return '';
    if (key.includes('starter')) return 'Starter (Autônomos)';
    if (key.includes('pro')) return 'Pro (Agências)';
    return '';
  };

  const handleSelectPlan = async (basePlanName: 'starter' | 'pro') => {
    // Monta a chave exata que o banco de dados espera (ex: 'starter_anual')
    const finalPlanKey = `${basePlanName}_${isAnnual ? 'anual' : 'mensal'}`;

    setSelectedPlanKey(finalPlanKey);
    setFormError('');
    setShowFormModal(true);
  };

  const executeCheckout = async (planKey: string, additionalData: Partial<BillingModalData>) => {
    setLoadingPlan(planKey);
    setFormError('');

    try {
      const token = await getFirebaseToken();
      if (!token) throw new Error('Sessão expirada. Refaça o login.');

      const response = await userApi.initializeCheckout(token, {
        planKey: planKey,
        billingType: 'UNDEFINED',
        ...additionalData
      } as CheckoutPayload);

      if (response.url) {
        window.open(response.url, '_blank');
        setShowFormModal(false);
      }
    } catch (error) {
      console.error('Erro no fluxo de checkout:', error);
      const msg = error instanceof Error ? error.message : 'Falha ao conectar com o gateway.';
      setFormError(msg);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleModalSubmit = (modalData: BillingModalData) => {
    if (
      !modalData.name.trim() ||
      !modalData.cpfCnpj.trim() ||
      !modalData.mobilePhone.trim() ||
      !modalData.postalCode.trim() ||
      !modalData.address.trim() ||
      !modalData.addressNumber.trim() ||
      !modalData.province.trim()
    ) {
      setFormError('Todos os campos de endereço, telefone e documento são obrigatórios para emissão fiscal.');
      return;
    }

    if (selectedPlanKey) {
      executeCheckout(selectedPlanKey, modalData);
    }
  };

  // Previne renderizar a tela quebrada se os planos ainda estão carregando
  if (loadingPage) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-[#f8fafc] gap-2">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Sincronizando tabela de preços...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto px-4 py-12 custom-scrollbar">
      <div className="max-w-[1140px] mx-auto space-y-12">

        <div className="text-center space-y-3 mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Planos flexíveis para acelerar suas vendas
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Encontre o radar de prospecção e CRM ideal para o seu volume de leads. Comece de graça e mude quando quiser.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Mensal
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Anual
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              2 Meses Grátis
            </span>
          </span>
        </div>

        {pageError && (
          <div className="text-center mt-4">
             <p className="text-sm font-semibold text-rose-500 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl inline-block">
               {pageError}
             </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">

          <PricingCard
            name="free"
            title="Free"
            subtitle="Degustação"
            description="Tudo o que você precisa para testar o potencial da ferramenta."
            price="0"
            period=""
            aspect="Grátis para sempre"
            buttonText="Plano Atual"
            isCurrent={!user?.plan || user?.plan?.slug === 'free'}
            icon={<Shield className="w-[18px] h-[18px]" />}
            features={[
              { text: '15 buscas no Radar por mês', included: true },
              { text: 'Até 50 leads salvos no Funil', included: true },
              { text: 'Importação de Planilha', included: false },
              { text: 'Exportação (Excel/CSV)', included: false },
            ]}
            onSelect={() => { }}
          />

          <PricingCard
            name="starter"
            title="Starter"
            subtitle="Autônomos"
            description="Mais capacidade de busca e automação para sua operação crescer."
            price={isAnnual ? getPlanPrice('starter_anual') : getPlanPrice('starter_mensal')}
            period={isAnnual ? "por ano" : "por mês"}
            aspect="Acesso imediato às automações"
            buttonText="Escolher Starter"
            isPopular={true}
            isCurrent={user?.plan?.slug?.includes('starter')}
            isLoading={loadingPlan === `starter_${isAnnual ? 'anual' : 'mensal'}`}
            icon={<Zap className="w-[18px] h-[18px] fill-indigo-100" />}
            features={[
              { text: '200 buscas no Radar por mês', included: true },
              { text: 'Leads no Funil Ilimitados', included: true },
              { text: 'Importação de Planilha', included: true },
              { text: 'Exportação para Excel/CSV', included: true },
            ]}
            onSelect={() => handleSelectPlan('starter')}
          />

          <PricingCard
            name="pro"
            title="Pro"
            subtitle="Agências"
            description="Potência máxima de extração de leads em larga escala."
            price={isAnnual ? getPlanPrice('pro_anual') : getPlanPrice('pro_mensal')}
            period={isAnnual ? "por ano" : "por mês"}
            aspect="Ideal para equipes comerciais"
            buttonText="Escolher Pro"
            isCurrent={user?.plan?.slug?.includes('pro')}
            isLoading={loadingPlan === `pro_${isAnnual ? 'anual' : 'mensal'}`}
            icon={<Crown className="w-[18px] h-[18px] fill-amber-50" />}
            features={[
              { text: '1000 buscas no Radar por mês', included: true },
              { text: 'Leads no Funil Ilimitados', included: true },
              { text: 'Importação de Planilha ativa', included: true },
              { text: 'Exportação para Excel/CSV', included: true },
            ]}
            onSelect={() => handleSelectPlan('pro')}
          />

        </div>

        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 font-medium bg-slate-100/60 py-3 px-4 rounded-2xl border border-slate-200/40 max-w-md mx-auto">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Precisa de mais buscas? Fale conosco para um plano Enterprise personalizado.</span>
        </div>

      </div>

      <BillingFormModal
        isOpen={showFormModal}
        isLoading={loadingPlan !== null}
        initialData={user ? {
          name: user.name,
          cpfCnpj: user.cpfCnpj,
          mobilePhone: user.mobilePhone,
          postalCode: user.postalCode,
          address: user.address,
          addressNumber: user.addressNumber,
          province: user.province,
        } : undefined}
        planName={getPlanDisplayName(selectedPlanKey)}
        error={formError}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleModalSubmit}
      />
    </div >
  );
};