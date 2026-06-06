import React, { useState } from 'react';
import { User as UserIcon, Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface ProfileDataFormProps {
  user: User | null; // Tipagem estrita substituindo o any
}

export const ProfileDataForm: React.FC<ProfileDataFormProps> = ({ user }) => {
  // Inicializa o estado diretamente com os dados ou string vazia, evitando o efeito síncrono
  const [name, setName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'O nome não pode ficar vazio.' });
      return;
    }
    if (!user) return;

    setIsSaving(true);

    try {
      await updateProfile(user, { displayName: name.trim() });
      setMessage({ type: 'success', text: 'Nome de exibição atualizado com sucesso!' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Ocorreu um erro ao atualizar o nome.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <UserIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Dados Pessoais</h2>
          <p className="text-xs text-slate-500 mt-0.5">Atualize seu nome de exibição no sistema.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">Nome completo</label>
          <div className="relative">
            <UserIcon className="w-[18px] h-[18px] text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              disabled={isSaving}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">E-mail</label>
          <div className="relative">
            <Mail className="w-[18px] h-[18px] text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-400 cursor-not-allowed select-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all flex justify-center items-center h-11 disabled:opacity-70 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Salvar alterações'}
        </button>
      </form>
    </div>
  );
};