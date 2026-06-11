import React, { useState } from 'react';
import { Lock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface SecurityFormProps {
  user: User | null;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({ user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Preencha os dois campos de senha.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas informadas não são iguais.' });
      return;
    }
    if (!user) return;

    setIsChanging(true);

    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Sua senha foi alterada com sucesso!' });
    } catch (err) {
      console.error(err);
      const errorCode = err && typeof err === 'object' && 'code' in err ? err.code : '';
      
      if (errorCode === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Por segurança, esta ação exige que você faça logout e login novamente antes de trocar a senha.' });
      } else {
        setMessage({ type: 'error', text: 'Ocorreu um erro ao alterar a senha.' });
      }
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Segurança</h2>
          <p className="text-xs text-slate-500 mt-0.5">Altere sua senha de acesso.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="leading-tight">{message.text}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">Nova senha</label>
          <div className="relative">
            <Lock className="w-[18px] h-[18px] text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isChanging}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold text-slate-700">Confirmar nova senha</label>
            {newPassword && confirmPassword && (
              <span className={`text-[10px] font-bold uppercase tracking-wider ${newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                {newPassword === confirmPassword ? 'As senhas coincidem' : 'Senhas diferentes'}
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-[18px] h-[18px] text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isChanging}
              className={`w-full bg-white border rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 transition-all disabled:opacity-60 ${
                confirmPassword ? newPassword === confirmPassword ? 'border-emerald-200 focus:ring-emerald-500' : 'border-red-200 focus:ring-red-500' : 'border-slate-200 focus:ring-indigo-500'
              }`}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isChanging}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-xl transition-all flex justify-center items-center h-11 disabled:opacity-70 focus:outline-none cursor-pointer"
        >
          {isChanging ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Alterar senha'}
        </button>
      </form>
    </div>
  );
};