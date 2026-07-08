import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { RadarView } from '@/components/radar/RadarView';
import { FunilView } from '@/components/crm/FunilView';
import { LimitModal } from '@/components/common/LimitModal';
import { ProfileView } from '@/views/ProfileView';
import { LoginView } from './LoginView';
import { PricingView } from './PricingView';
import { useCRM } from '@/hooks/useCRM';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
// Se você separou o leadApi em outro arquivo, importe-o aqui. Ex:
// import { leadApi } from '@/services/api/leads'; 
import type { Lead } from '@/types';

function App() {
  // Controla o estado de visualização de telas do app
  const [view, setView] = useState<'crm' | 'profile' | 'pricing'>('crm');

  // Controla se o Sidebar do Radar está expandido ou colapsado
  const [isRadarOpen, setIsRadarOpen] = useState(true);

  const { user, loading, setLimitModalType } = useAuth();

  // Desestrutura as propriedades dinâmicas do Kanban vindas do hook especialista
  const {
    isLoadingCRM,
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
    handleUpdateLeadPitch
  } = useCRM();

  const [radarLeads, setRadarLeads] = useState<Lead[]>(() => {
    const cache = localStorage.getItem('locus_last_search_results');
    return cache ? JSON.parse(cache) : [];
  });

  const [hasSearched, setHasSearched] = useState<boolean>(() => {
    const cache = localStorage.getItem('locus_has_searched');
    return cache === 'true';
  });

  // Estratégia de Pre-fetching: Acorda o servidor em nuvem usando a nossa chamada estruturada
  useEffect(() => {
    api.getStatus().catch(() => {
      console.log('Servidor em nuvem ainda a inicializar...');
    });
  }, []);

  const handleNavigateToPricing = () => {
    setLimitModalType(null); // Fecha o modal elegantemente de forma global
    setView('pricing');      // Altera a view principal para exibir a tabela de preços
  };

  // Se o Firebase ainda estiver pensando, mostra a tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-semibold text-slate-500 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span>Sincronizando sua conta...</span>
        </div>
      </div>
    );
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

        {/* Estrutura lógica chaveada para renderizar 'profile', 'pricing' ou o 'crm' padrão */}
        {view === 'profile' && (
          <ProfileView
            onNavigateBack={() => setView('crm')}
            onNavigateToPricing={() => setView('pricing')}
          />
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
                name: data.name,
                phone: data.phone || 'Sem telefone',
                notes: data.notes || '',
                type: data.type || 'Não informado',
                address: data.address || 'Sem endereço',
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
              onGenerateAIPitch={async (id) => {
                if (!user.email) throw new Error("Usuário não autenticado");
                const pitch = await api.generateAIPitch(id, user.email);
                handleUpdateLeadPitch(id, pitch);
                return pitch;
              }}
              userEmail={user.email!}
              onSaveAiConfig={async (data) => {
                if (!user.email) throw new Error("Usuário não autenticado");
                // Nota: Substitua 'api.' por 'leadApi.' caso sua nova rota esteja em outro objeto importado
                await api.saveAiConfig(user.email, data);
              }}
            />
          </>
        )}

      </main>

      <LimitModal onGoToPricing={handleNavigateToPricing} />
    </div>
  );
}

export default App;