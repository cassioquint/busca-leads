import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { RadarView } from '../components/radar/RadarView';
import { FunilView } from '../components/crm/FunilView';
import { LoginView } from './LoginView';
import { useCRM } from '../hooks/useCRM';
import { useAuth } from '../contexts/AuthContext';

function App() {
  const [isRadarOpen, setIsRadarOpen] = useState(true);

  // Consome a inteligência do contexto de autenticação
  const { user, loading } = useAuth();

  // Desestrutura as propriedades dinâmicas do Kanban vindas do hook especialista
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
    handleChangeLeadTag,
    handleDeleteLead,
    handleUpdateLeadNotes
  } = useCRM();

  // Se o Firebase ainda estiver pensando, mostra a tela de carregamento
  if (loading) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Carregando...</div>;
  }

  // O CADEADO: Se não tiver usuário logado, barra no LoginView
  if (!user) {
    return <LoginView />;
  }

  // Renderiza a interface unificada do CRM
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col h-screen overflow-hidden">
      <Header />

      <main className="flex-1 w-full flex overflow-hidden relative">
        
        {/* 1. SIDEBAR ESQUERDA: Radar de Prospecção */}
        <RadarView
          isOpen={isRadarOpen}
          setIsOpen={setIsRadarOpen}
          leads={radarLeads}
          setLeads={setRadarLeads}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          onSaveLead={handleSaveLead}
        />

        {/* 2. ÁREA PRINCIPAL/DIREITA: Quadro Kanban do Funil */}
        <FunilView
          leads={funilLeads}
          buckets={buckets}
          tags={tags}
          onMoveLead={handleMoveLead}
          onAddManualLead={handleAddManualLead}
          onCreateColumn={handleCreateColumn}
          onManageTags={handleManageTags}
          onChangeLeadTag={handleChangeLeadTag}
          onDeleteLead={handleDeleteLead}
          onUpdateLeadNotes={handleUpdateLeadNotes}
          isLoading={isLoadingCRM}
          isRadarOpen={isRadarOpen}
        />
        
      </main>
    </div>
  );
}

export default App;