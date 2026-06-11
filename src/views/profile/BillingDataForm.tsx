import React, { useState } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/services/api/users';
import type { ExtendedUser } from '@/types';
import { formatCpfCnpj, formatPhone, formatCep } from '@/utils/masks';

interface BillingDataFormProps {
  user: ExtendedUser | null;
}

export const BillingDataForm: React.FC<BillingDataFormProps> = ({ user }) => {
  const { getFirebaseToken, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    cpfCnpj: user?.cpfCnpj || '',
    mobilePhone: user?.mobilePhone || '',
    postalCode: user?.postalCode || '',
    address: user?.address || '',
    addressNumber: user?.addressNumber || '',
    province: user?.province || '',
  });

  // 🌟 O INTERCEPTADOR DE MÁSCARAS (Idêntico ao do Modal)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpfCnpj') formattedValue = formatCpfCnpj(value);
    else if (name === 'mobilePhone') formattedValue = formatPhone(value);
    else if (name === 'postalCode') formattedValue = formatCep(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setSuccessMsg(''); 
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = await getFirebaseToken();
      if (!token) throw new Error('Sessão expirada.');

      await userApi.updateBillingData(token, formData);
      await refreshUserData();
      setSuccessMsg('Dados de faturamento atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados de faturamento:', error);
      setErrorMsg('Não foi possível salvar os dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Endereço e Faturamento</h3>
            <p className="text-xs text-slate-500">Dados utilizados para emissão de notas e cobranças</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {successMsg && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl">
            {errorMsg}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">CPF ou CNPJ</label>
            <input
              type="text"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Celular com DDD</label>
            <input
              type="text"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Endereço / Logradouro</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: Av. Sete de Setembro"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Número</label>
            <input
              type="text"
              name="addressNumber"
              value={formData.addressNumber}
              onChange={handleChange}
              placeholder="Ex: 123"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Bairro</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              placeholder="Ex: Centro"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">CEP</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="00000-000"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>Salvar Endereço</span>
          </button>
        </div>
      </form>
    </div>
  );
};