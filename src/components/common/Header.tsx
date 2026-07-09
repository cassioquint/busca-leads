import React from 'react';
import { LogOut, User as UserIcon, CreditCard, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onLogoClick?: () => void;
  onProfileClick: () => void;
  onPricingClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, onLogoClick, onPricingClick }) => {
  // Puxa o usuário logado e a função de sair do Contexto de Autenticação
  const { user, logout } = useAuth();

  // Extrai dados de buscas reais do usuário atualizado
  const buscasRealizadas = user?.searchesThisMonth ?? 0;
  const limiteBuscas = user?.plan?.maxSearchesPerMonth ?? 15;

  const isFreeUser = !user?.plan || user?.plan?.slug === 'free';

  return (
    <header className="shrink-0 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-50">

      {/* BLOCO DA ESQUERDA: LOGO + NAVEGAÇÃO */}
      <div className="flex items-center gap-6">
        {/* LOGO E IDENTIFICAÇÃO DO PRODUTO */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <img 
              src="/favicon.svg" 
              alt="Locus Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-tight text-[#073c59] group-hover:text-indigo-600 transition-colors">Locus</h1>
            <p className="text-xs text-slate-500 font-medium">Radar de prospecção · CRM</p>
          </div>
        </button>

        {isFreeUser && (
          <>
            {/* Separador vertical sutil entre a logo e os links */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Link/Botão de Navegação para a página de Planos */}
            <button
              type="button"
              onClick={onPricingClick}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            >
              <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span>Planos e Preços</span>
            </button>
          </>
        )}
      </div>

      {/* ESPAÇO CENTRAL FLUIDO */}
      <div className="flex-1" />

      {/* PERFIL E LOGOUT */}
      <div className="flex items-center gap-4">
        
        <div 
          className="hidden md:flex items-center gap-2 border border-slate-200/80 bg-slate-50/50 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 shadow-sm"
          title="Consumo de buscas no radar este mês"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Radar:</span>
          <span className={`font-bold ${buscasRealizadas >= limiteBuscas ? 'text-amber-600' : 'text-slate-600'}`}>
            {buscasRealizadas}/{limiteBuscas}
          </span>
        </div>

        {/* Separador vertical quando o contador está visível */}
        <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          title="Ver meu perfil"
        >
          <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
            <UserIcon className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
          </div>
          <span className="truncate max-w-[150px] font-semibold pr-1">
            {user?.displayName || user?.email}
          </span>
        </button>

        {/* Separador vertical */}
        <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

        {/* Botão de Sair */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 cursor-pointer focus:outline-none"
          title="Sair da conta"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:block">Sair</span>
        </button>
      </div>
    </header>
  );
};