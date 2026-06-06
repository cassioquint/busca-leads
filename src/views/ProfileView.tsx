import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileDataForm } from './profile/ProfileDataForm';
import { SecurityForm } from './profile/SecurityForm';

interface ProfileViewProps {
  onNavigateBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateBack }) => {
  const { user } = useAuth();

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
        <ProfileDataForm user={user} />

        {/* Só mostra o formulário de senha se o usuário NÃO for do Google */}
        {user?.providerData?.some(p => p.providerId === 'password') && (
          <SecurityForm user={user} />
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