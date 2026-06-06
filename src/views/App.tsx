import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { RadarView } from '@/components/radar/RadarView';
import { FunilView } from '@/components/crm/FunilView';
import { ProfileView } from '@/views/ProfileView';
import { LoginView } from './LoginView';
import { PricingView } from './PricingView';
import { useCRM } from '../hooks/useCRM';
import { useAuth } from '../contexts/AuthContext';

function App() {
  // Controla o estado de visualização de telas do app
  const [view, setView] = useState<'crm' | 'profile' | 'pricing'>('crm');

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
    handleImportLeadsInBulk,
  } = useCRM();

  // Estratégia de Pre-fetching: Manda um "cutucão" silencioso na Render assim que o App monta.
  useEffect(() => {
    fetch('http://localhost:3001/api/status').catch(() => { });
  }, []);

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
      {/* Cabeçalho centralizado com os mapeamentos corretos das views */}
      <Header
        onProfileClick={() => setView(view === 'profile' ? 'crm' : 'profile')}
        onLogoClick={() => setView('crm')}
        onPricingClick={() => setView('pricing')}
      />

      {/* Container fluido que alterna dinamicamente o conteúdo principal */}
      <main className="flex-1 w-full flex overflow-hidden relative">

        {/* 🌟 AJUSTADO: Estrutura lógica chaveada para renderizar 'profile', 'pricing' ou o 'crm' padrão */}
        {view === 'profile' && (
          <ProfileView onNavigateBack={() => setView('crm')} />
        )}

        {view === 'pricing' && (
          <PricingView />
        )}

        {view === 'crm' && (
          <>
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
              onAddManualLead={(data) => handleAddManualLead({
                title: data.title,
                phone: data.phone,
                notes: data.notes || '',
                type: 'Não informado',
                address: 'Sem endereço',
                city: 'Cadastro Manual',
                openState: 'Adicionado Manualmente',
                isOpen: true,
                thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop'
              })}
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
              onImportLeadsInBulk={handleImportLeadsInBulk}
              isLoading={isLoadingCRM}
            />
          </>
        )}

      </main>
    </div>
  );
}

export default App;