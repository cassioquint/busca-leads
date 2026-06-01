import { useState } from 'react';
import { Header } from './components/Header';
import { RadarView } from './components/RadarView';
import { FunilView } from './components/FunilView';
import { LoginView } from './components/LoginView';
import { useCRM } from './hooks/useCRM';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentTab, setCurrentTab] = useState<'radar' | 'funil'>('radar');
  
  // Consome a inteligência do contexto de autenticação
  const { user, loading } = useAuth();

  // Se o Firebase ainda estiver pensando, mostra uma tela vazia ou um spinner
  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Carregando...</div>;
  }

  // O CADEADO: Se não tiver usuário logado, barra no LoginView
  if (!user) {
    return <LoginView />;
  }
  
  // 🔥 Desestruturamos as novas propriedades dinâmicas do Kanban vindas do hook
  const { 
    radarLeads, 
    setRadarLeads, 
    hasSearched, 
    setHasSearched, 
    funilLeads, 
    handleSaveLead, 
    handleMoveLead,
    handleAddManualLead,
    buckets,
    tags,
    handleCreateColumn,
    handleManageTags,
    handleChangeLeadTag
  } = useCRM();

  // Se chegou aqui, o usuário está logado! Renderiza o CRM:
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'radar' ? (
          <RadarView 
            leads={radarLeads} 
            setLeads={setRadarLeads}
            hasSearched={hasSearched}
            setHasSearched={setHasSearched}
            onSaveLead={handleSaveLead} 
          />
        ) : (
          /* 🔥 Injetamos os dados dinâmicos mapeando os novos props do FunilView */
          <FunilView 
            leads={funilLeads} 
            buckets={buckets}
            tags={tags}
            onMoveLead={handleMoveLead} 
            onAddManualLead={handleAddManualLead}
            onCreateColumn={handleCreateColumn}
            onManageTags={handleManageTags}
            onChangeLeadTag={handleChangeLeadTag}
          />
        )}
      </main>
    </div>
  );
}

export default App;