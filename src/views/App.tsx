import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { RadarView } from '../components/radar/RadarView';
import { FunilView } from '../components/crm/FunilView';
import { LoginView } from './LoginView';
import { useCRM } from '../hooks/useCRM';
import { useAuth } from '../contexts/AuthContext';

function App() {
  // Controla se o Sidebar do Radar está expandido ou colapsado
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
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveColumn,
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleChangeLeadTag,
    handleDeleteLead,
    handleUpdateLeadNotes,
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
      {/* O Header agora é limpo e focado, sem as propriedades antigas */}
      <Header />

      {/* Container fluido ocupando 100% da viewport e dividindo os espaços verticalmente */}
      <main className="flex-1 w-full flex overflow-hidden relative">
        
        {/* 1. SIDEBAR ESQUERDA: Radar de Prospecção (Agora gerencia o próprio estado) */}
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
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
          onMoveColumn={handleMoveColumn}
          onCreateTag={handleCreateTag}
          onUpdateTag={handleUpdateTag}
          onDeleteTag={handleDeleteTag}
          onChangeLeadTag={handleChangeLeadTag}
          onDeleteLead={handleDeleteLead}
          onUpdateLeadNotes={handleUpdateLeadNotes}
          isLoading={isLoadingCRM}
        />
        
      </main>
    </div>
  );
}

export default App;