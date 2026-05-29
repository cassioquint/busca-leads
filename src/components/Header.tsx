import React from 'react';
import { Radar, Kanban, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentTab: 'radar' | 'funil';
  setCurrentTab: (tab: 'radar' | 'funil') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  // Puxa o usuário logado e a função de sair do Contexto de Autenticação
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      
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

      {/* CONTROLE DE NAVEGAÇÃO DE ABAS */}
      <nav className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setCurrentTab('radar')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentTab === 'radar'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Radar</span>
        </button>
        
        <button
          onClick={() => setCurrentTab('funil')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            currentTab === 'funil'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Funil</span>
        </button>
      </nav>

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
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Sair da conta"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:block">Sair</span>
        </button>
      </div>
    </header>
  );
};