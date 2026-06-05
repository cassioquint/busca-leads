import React from 'react';
import { Radar, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  // Puxa o usuário logado e a função de sair do Contexto de Autenticação
  const { user, logout } = useAuth();

  return (
    <header className="shrink-0 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-50">

      {/* LOGO E IDENTIFICAÇÃO DO PRODUTO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <Radar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">BuscaLeads</h1>
          <p className="text-xs text-slate-500 font-medium">Radar de prospecção · CRM</p>
        </div>
      </div>

      {/* ESPAÇO CENTRAL FLUIDO (Mantém o alinhamento correto dos lados) */}
      <div className="flex-1" />

      {/* PERFIL E LOGOUT */}
      <div className="flex items-center gap-4">

        {/* Identificação do Usuário */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 hidden md:flex">
          <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <UserIcon className="w-4 h-4 text-slate-500" />
          </div>
          <span className="truncate max-w-[150px]">
            {user?.displayName || user?.email}
          </span>
        </div>

        {/* Separador vertical */}
        <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

        {/* Botão de Sair */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 cursor-pointer"
          title="Sair da conta"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:block">Sair</span>
        </button>
      </div>
    </header>
  );
};