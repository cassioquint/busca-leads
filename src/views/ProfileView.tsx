import React from 'react';
import { ShieldCheck, Award, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProfileDataForm } from './profile/ProfileDataForm';
import { SecurityForm } from './profile/SecurityForm';
import type { User as FirebaseUser } from 'firebase/auth';

interface ProfileViewProps {
  onNavigateBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateBack }) => {
  const { user } = useAuth();

  // Extrai os dados estendidos do plano vinculados ao usuário
  const plano = user?.plan; 
  const buscasRealizadas = user?.searchesThisMonth ?? 0;
  const limiteBuscas = plano?.maxSearchesPerMonth ?? 15;
  
  // Cálculo percentual para a barra de progresso da tela de perfil
  const percentualUso = Math.min(Math.round((buscasRealizadas / limiteBuscas) * 100), 100);

  // 🌟 Converte de forma segura o usuário estendido para o tipo base que os subformulários esperam
  const firebaseUserInstance = user as unknown as FirebaseUser;

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
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none"
          >
            Voltar ao Funil
          </button>
        </div>

        {/* COMPONENTE FRAGMENTADO 1: FORMULÁRIO DE DADOS */}
        <ProfileDataForm user={firebaseUserInstance} />

        {/* NOVO CARD: DETALHES DO PLANO ATUAL DO USUÁRIO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
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
            
            <span className="inline-flex items-center gap-1 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm shadow-indigo-100">
              <Zap className="w-2.5 h-2.5 fill-white" />
              {plano?.name || 'Degustação'}
            </span>
          </div>

          {/* Barra de Progresso de Consumo de Créditos de Busca */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Buscas efetuadas este mês</span>
              <span className="text-slate-900">{buscasRealizadas} / {limiteBuscas}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentualUso > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${percentualUso}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Sua cota de buscas de radar é renovada automaticamente a cada ciclo de 30 dias.
            </p>
          </div>
        </div>

        {firebaseUserInstance?.providerData?.some(p => p.providerId === 'password') && (
          <SecurityForm user={firebaseUserInstance} />
        )}

        {/* RODAPÉ DE SEGURANÇA */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sua conta é protegida por criptografia de ponta a ponta.</span>
        </div>

      </div>
    </div>
  );
};