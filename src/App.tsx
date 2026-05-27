import { useState } from 'react';
import { Radar, Kanban, Plus } from 'lucide-react';

function App() {
  // Estado que controla qual aba principal está ativa na tela
  const [currentTab, setCurrentTab] = useState<'radar' | 'funil'>('radar');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. CABEÇALHO SUPERIOR (A CASCA FIXA) */}
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
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
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
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              currentTab === 'funil'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Funil</span>
          </button>
        </nav>
      </header>

      {/* 2. ÁREA DINÂMICA DE CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {currentTab === 'radar' ? (
          /* CONTAINER PARA O MÓDULO RADAR (BUSCA) */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              {/* O componente de barra de buscas e filtros entrará exatamente aqui */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
                Área reservada para a Barra de Busca & Sub-abas (Google Maps / Inaugurações)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Onde os cards de estabelecimentos encontrados vão renderizar */}
              <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 md:col-span-3">
                Os Cards de Leads (Mercados, Oficinas, etc.) aparecerão aqui em formato Grid
              </div>
            </div>
          </div>
        ) : (
          /* CONTAINER PARA O MÓDULO FUNIL (CRM KANBAN) */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Funil de Vendas</h2>
                <p className="text-sm text-slate-500">Gerencie a evolução das suas abordagens</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Adicionar Nova Coluna</span>
              </button>
            </div>

            {/* Layout horizontal para as colunas do CRM */}
            <div className="flex gap-4 overflow-x-auto pb-4 items-start">
              <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 w-full">
                Área reservada para o painel Kanban (Colunas: A Abordar, Contato Efetuado, etc.)
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}

export default App;