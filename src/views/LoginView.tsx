import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

export const LoginView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Usuário logado com sucesso (Google)!");
    } catch (err) {
      console.error("Erro no Google:", err);
      setError('Falha ao autenticar com o Google.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isRegistering && !name) {
      setError('Por favor, informe seu nome.');
      return;
    }
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError('As senhas informadas não são iguais.');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        console.log("Conta criada para:", name);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Erro na autenticação:", err);
      const errorCode = err && typeof err === 'object' && 'code' in err ? err.code : '';
      
      if (errorCode === 'auth/email-already-in-use') setError('Este e-mail já está em uso.');
      else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') setError('E-mail ou senha incorretos.');
      else if (errorCode === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.');
      else setError('Ocorreu um erro ao autenticar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />

      <div className="flex flex-col items-center gap-1 mb-8 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <img 
              src="/favicon.svg" 
              alt="Locus Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#073c59] tracking-tight">Locus</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium">Radar de prospecção · CRM</p>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/40 relative z-10">
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#073c59] mb-2">
            {isRegistering ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Preencha os dados abaixo para começar.' : 'Bem-vindo de volta. Faça login para continuar.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100 text-center animate-in fade-in zoom-in-95 duration-200">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar com Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="text-[11px] text-slate-400 uppercase tracking-widest">OU</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          
          {/* INPUT DE NOME - Exibido apenas no cadastro */}
          {isRegistering && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-700 ml-1">Nome completo</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Senha</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* 🌟 NOVO: INPUT DE CONFIRMAÇÃO DE SENHA - Exibido apenas no cadastro */}
          {isRegistering && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-700 ml-1">Confirme a senha</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-indigo-200 transition-all mt-2 disabled:opacity-70 flex justify-center items-center h-[52px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isRegistering ? 'Criar conta' : 'Entrar'
            )}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isRegistering ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setPassword('');
                setConfirmPassword(''); // Limpa os campos ao alternar
              }} 
              className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
            >
              {isRegistering ? 'Fazer login' : 'Criar conta'}
            </button>
          </p>
        </div>

      </div>

      <p className="text-[11px] text-slate-400 font-medium mt-8 text-center max-w-xs relative z-10">
        Ao continuar, você concorda com nossos Termos e Política de Privacidade.
      </p>

    </div>
  );
};