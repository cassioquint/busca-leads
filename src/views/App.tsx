import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { RadarView } from '../components/radar/RadarView';
import { FunilView } from '../components/crm/FunilView';
import { LoginView } from './LoginView';
import { useCRM } from '../hooks/useCRM';
import { useAuth } from '../contexts/AuthContext';

function App() {
  const [currentTab, setCurrentTab] = useState<'radar' | 'funil'>('radar');

  // Consome a inteligência do contexto de autenticação
  const { user, loading } = useAuth();

  // Desestrutura as novas propriedades dinâmicas do Kanban vindas do hook
  const {
    isLoadingCRM,
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

  // Se o Firebase ainda estiver pensando, mostra uma tela vazia ou um spinner
  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Carregando...</div>;
  }

  // O CADEADO: Se não tiver usuário logado, barra no LoginView
  if (!user) {
    return <LoginView />;
  }

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
          <FunilView
            leads={funilLeads}
            buckets={buckets}
            tags={tags}
            onMoveLead={handleMoveLead}
            onAddManualLead={handleAddManualLead}
            onCreateColumn={handleCreateColumn}
            onManageTags={handleManageTags}
            onChangeLeadTag={handleChangeLeadTag}
            isLoading={isLoadingCRM}
          />
        )}
      </main>
    </div>
  );
}

export default App;
