// src/views/PricingView.tsx
import React, { useState } from 'react';
import { Shield, Zap, Crown, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi, type CheckoutPayload } from '@/services/api/users';
import { PricingCard } from '@/components/plans/PricingCard';
import { BillingFormModal, type BillingModalData } from '@/components/plans/BillingFormModal';

export const PricingView: React.FC = () => {
  const { user, getFirebaseToken } = useAuth();
  
  // Estados para controle de faturamento
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'pro' | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  // 🌟 CORREÇÃO: Tipagem do estado restrita aos planos aceitos pelo gateway
  const [selectedPlanKey, setSelectedPlanKey] = useState<'starter' | 'pro' | null>(null);
  const [formError, setFormError] = useState('');

  // Mapeamento de nomes de exibição amigáveis
  const planNamesMapping: Record<string, string> = {
    starter: 'Starter (Autônomos)',
    pro: 'Pro (Agências)'
  };

  const handleSelectPlan = async (planKey: 'starter' | 'pro') => {
    setSelectedPlanKey(planKey);
    
    // 🌟 SE O USUÁRIO JÁ FOR CLIENTE NO ASAAS: Dispara direto sem abrir o modal
    if (user?.asaasCustomerId) {
      await executeCheckout(planKey, {});
    } else {
      // 🌟 SE FOR A PRIMEIRA COMPRA: Abre o modal para colher os dados completos de endereço/telefone
      setFormError('');
      setShowFormModal(true);
    }
  };

  const executeCheckout = async (planKey: 'starter' | 'pro', additionalData: Partial<BillingModalData>) => {
    setLoadingPlan(planKey);
    setFormError('');
    
    try {
      const token = await getFirebaseToken();
      if (!token) throw new Error('Sessão expirada. Refaça o login.');

      // 🚀 ENVIO CORRETO: Repassa o planKey selecionado e os dados fiscais reais informados no modal
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
    // Validação estrita no frontend dos campos adicionados
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
    
    // 🌟 CORREÇÃO: Garante o casamento estrito de tipos ao repassar o estado para a execução
    if (selectedPlanKey) {
      executeCheckout(selectedPlanKey, modalData);
    }
  };

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto px-4 py-12 custom-scrollbar">
      <div className="max-w-[1140px] mx-auto space-y-12">
        
        {/* CABEÇALHO */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Planos flexíveis para acelerar suas vendas
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Encontre o radar de prospecção e CRM ideal para o seu volume de leads. Comece de graça e mude quando quiser.
          </p>
        </div>

        {/* CONTAINER DOS CARDS REFACTORADOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* DECO DE DEGUSTAÇÃO (FREE) */}
          <PricingCard
            name="free"
            title="Free"
            subtitle="Degustação"
            description="Tudo o que você precisa para testar o potencial da ferramenta."
            price="0"
            aspect="Grátis para sempre"
            buttonText="Plano Atual"
            isCurrent={!user?.plan || user?.plan?.id === 'free'} 
            icon={<Shield className="w-[18px] h-[18px]" />}
            features={[
              { text: '10 buscas no Radar por mês', included: true },
              { text: 'Até 10 leads salvos no Funil', included: true },
              { text: 'Importação de Planilha', included: false },
              { text: 'Exportação (Excel/CSV)', included: false },
            ]}
            onSelect={() => {}}
          />

          {/* PLANO STARTER */}
          <PricingCard
            name="starter"
            title="Starter"
            subtitle="Autônomos"
            description="Mais capacidade de busca e automação para sua operação crescer."
            price="49,00"
            aspect="Acesso imediato às automações"
            buttonText="Escolher Starter"
            isPopular={true}
            isCurrent={user?.plan?.id === 'starter'}
            isLoading={loadingPlan === 'starter'}
            icon={<Zap className="w-[18px] h-[18px] fill-indigo-100" />}
            features={[
              { text: '150 buscas no Radar por mês', included: true },
              { text: 'Leads no Funil Ilimitados', included: true },
              { text: 'Importação de Planilha active', included: true },
              { text: 'Exportação para Excel/CSV liberada', included: true },
            ]}
            onSelect={() => handleSelectPlan('starter')}
          />

          {/* PLANO PRO */}
          <PricingCard
            name="pro"
            title="Pro"
            subtitle="Agências"
            description="Potência máxima de extração de leads em larga escala."
            price="119,00"
            aspect="Ideal para equipes comerciais"
            buttonText="Escolher Pro"
            isCurrent={user?.plan?.id === 'pro'}
            isLoading={loadingPlan === 'pro'}
            icon={<Crown className="w-[18px] h-[18px] fill-amber-50" />}
            features={[
              { text: '600 buscas no Radar por mês', included: true },
              { text: 'Leads no Funil Ilimitados', included: true },
              { text: 'Importação de Planilha ativa', included: true },
              { text: 'Exportação para Excel/CSV liberada', included: true },
            ]}
            onSelect={() => handleSelectPlan('pro')}
          />

        </div>

        {/* NOTA DE SUPORTE */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 font-medium bg-slate-100/60 py-3 px-4 rounded-2xl border border-slate-200/40 max-w-md mx-auto">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Precisa de mais buscas? Fale conosco para um plano Enterprise personalizado.</span>
        </div>

      </div>

      {/* MODAL EXPANDIDO DE CAPTURA GEOGRÁFICA E FISCAL */}
      <BillingFormModal
        isOpen={showFormModal}
        isLoading={loadingPlan !== null}
        initialName={user?.displayName || ''}
        planName={selectedPlanKey ? planNamesMapping[selectedPlanKey] : ''}
        error={formError}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};