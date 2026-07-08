import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LimitModal } from '@/components/common/LimitModal';
import { ProfileView } from '@/views/ProfileView';
import { LoginView } from './LoginView';
import { PricingView } from './PricingView';
import { WorkspaceView } from '@/views/WorkspaceView';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

function App() {
  const [view, setView] = useState<'crm' | 'profile' | 'pricing'>('crm');
  const { user, loading, setLimitModalType } = useAuth();

  useEffect(() => {
    api.getStatus().catch(() => console.log('Servidor em nuvem ainda a inicializar...'));
  }, []);

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

  if (!user) return <LoginView />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col h-screen overflow-hidden">
      <Header
        onProfileClick={() => setView(view === 'profile' ? 'crm' : 'profile')}
        onLogoClick={() => setView('crm')}
        onPricingClick={() => setView('pricing')}
      />

      <main className="flex-1 w-full flex overflow-hidden relative">
        {view === 'profile' && (
          <ProfileView 
            onNavigateBack={() => setView('crm')} 
            onNavigateToPricing={() => setView('pricing')} 
          />
        )}
        {view === 'pricing' && <PricingView />}
        {view === 'crm' && <WorkspaceView userEmail={user.email!} />}
      </main>

      <LimitModal onGoToPricing={() => {
        setLimitModalType(null);
        setView('pricing');
      }} />
    </div>
  );
}

export default App;