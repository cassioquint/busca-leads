import React, { useState } from 'react';
import { Check, X, Shield, Zap, Crown, HelpCircle } from 'lucide-react';

export const PricingView: React.FC = () => {
  // Estado para fins de simulação de clique/loading nos botões de assinatura
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setLoadingPlan(planName);
    setTimeout(() => {
      setLoadingPlan(null);
      alert(`Fluxo de checkout iniciado para o plano: ${planName}`);
    }, 1200);
  };

  return (
    <div className="flex-1 h-full bg-[#f8fafc] overflow-y-auto px-4 py-12 custom-scrollbar">
      <div className="max-w-[1140px] mx-auto space-y-12">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Planos flexíveis para acelerar suas vendas
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Encontre o radar de prospecção e CRM ideal para o seu volume de leads. Comece de graça e mude quando quiser.
          </p>
        </div>

        {/* CONTAINER DOS CARDS LADO A LADO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* PLANO 1: FREE */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between relative transition-all hover:shadow-md">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-[18px] h-[18px]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Free</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Degustação</h2>
                <p className="text-xs text-slate-500">Tudo o que você precisa para testar o potencial da ferramenta.</p>
              </div>

              {/* PREÇO */}
              <div className="pt-2">
                <div className="flex items-baseline text-slate-900">
                  <span className="text-3xl font-extrabold tracking-tight">R$ 0</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500">/mês</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Grátis para sempre</p>
              </div>

              {/* RECURSOS */}
              <ul className="space-y-3.5 border-t border-slate-100 pt-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>15 buscas</strong> no Radar por mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Até <strong>10 leads</strong> salvos no Funil</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Importação de Planilha</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <span>Exportação (Excel/CSV)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled={true}
                className="w-full bg-slate-100 text-slate-500 font-bold text-sm py-3 rounded-xl transition-all cursor-not-allowed text-center"
              >
                Plano Atual
              </button>
            </div>
          </div>

          {/* PLANO 2: STARTER (DESTACADO / MAIS POPULAR) */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 shadow-xl shadow-indigo-100/40 flex flex-col justify-between relative transition-all transform md:-translate-y-4 scale-[1.02] z-10">
            {/* TAG MAIS POPULAR */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
              Mais Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Zap className="w-[18px] h-[18px] fill-indigo-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">Starter</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Autônomos</h2>
                <p className="text-xs text-slate-500">Mais capacidade de busca e automação para sua operação crescer.</p>
              </div>

              {/* PREÇO */}
              <div className="pt-2">
                <div className="flex items-baseline text-slate-900">
                  <span className="text-sm font-extrabold mr-0.5">R$</span>
                  <span className="text-4xl font-extrabold tracking-tight">49,00</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500">/mês</span>
                </div>
                <p className="text-[11px] text-indigo-600 font-bold mt-1">Acesso imediato às automações</p>
              </div>

              {/* RECURSOS */}
              <ul className="space-y-3.5 border-t border-slate-100 pt-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>150 buscas</strong> no Radar por mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Leads no Funil <strong>Ilimitados</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Importação</strong> de Planilha ativa</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Exportação</strong> para Excel/CSV liberada</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleSelectPlan('starter')}
                disabled={loadingPlan !== null}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-[0.99] flex justify-center items-center h-11"
              >
                {loadingPlan === 'starter' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Escolher Starter'
                )}
              </button>
            </div>
          </div>

          {/* PLANO 3: PRO */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between relative transition-all hover:shadow-md">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600">
                  <Crown className="w-[18px] h-[18px] fill-amber-50" />
                  <span className="text-xs font-bold uppercase tracking-wider">Pro</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Agências</h2>
                <p className="text-xs text-slate-500">Potência máxima de extração de leads em larga escala.</p>
              </div>

              {/* PREÇO */}
              <div className="pt-2">
                <div className="flex items-baseline text-slate-900">
                  <span className="text-sm font-extrabold mr-0.5">R$</span>
                  <span className="text-4xl font-extrabold tracking-tight">119,00</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500">/mês</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Ideal para equipes comerciais</p>
              </div>

              {/* RECURSOS */}
              <ul className="space-y-3.5 border-t border-slate-100 pt-6">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>600 buscas</strong> no Radar por mês</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Leads no Funil <strong>Ilimitados</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Importação</strong> de Planilha ativa</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Exportação</strong> para Excel/CSV liberada</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleSelectPlan('pro')}
                disabled={loadingPlan !== null}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold text-sm py-3 rounded-xl transition-all shadow-sm active:scale-[0.99] flex justify-center items-center h-11"
              >
                {loadingPlan === 'pro' ? (
                  <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  'Escolher Pro'
                )}
              </button>
            </div>
          </div>

        </div>

        {/* NOTA DE SUPORTE ADICIONAL */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 font-medium bg-slate-100/60 py-3 px-4 rounded-2xl border border-slate-200/40 max-w-md mx-auto">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Precisa de mais buscas? Fale conosco para um plano Enterprise personalizado.</span>
        </div>

      </div>
    </div>
  );
};