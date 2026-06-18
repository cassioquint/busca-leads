import React, { useState } from 'react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { formatCpfCnpj, formatPhone, formatCep } from '@/utils/masks';

export interface BillingModalData {
  name: string;
  cpfCnpj: string;
  mobilePhone: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  province: string;
}

interface BillingFormModalProps {
  isOpen: boolean;
  isLoading: boolean;
  initialData?: Partial<BillingModalData> | null;
  planName: string;
  error: string;
  onClose: () => void;
  onSubmit: (data: BillingModalData) => void;
}

export const BillingFormModal: React.FC<BillingFormModalProps> = ({
  isOpen,
  isLoading,
  initialData,
  planName,
  error,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BillingModalData>({
    name: initialData?.name || '',
    cpfCnpj: initialData?.cpfCnpj || '',
    mobilePhone: initialData?.mobilePhone || '',
    postalCode: initialData?.postalCode || '',
    address: initialData?.address || '',
    addressNumber: initialData?.addressNumber || '',
    province: initialData?.province || '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpfCnpj') formattedValue = formatCpfCnpj(value);
    else if (name === 'mobilePhone') formattedValue = formatPhone(value);
    else if (name === 'postalCode') formattedValue = formatCep(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-[480px] w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dados de Faturamento</h3>
            <p className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">Ativando Plano {planName}</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {error && (
            <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nome Completo ou Razão Social</label>
              <input
                type="text"
                name="name"
                required
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: João da Silva"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">CPF ou CNPJ</label>
              <input
                type="text"
                name="cpfCnpj"
                required
                disabled={isLoading}
                value={formData.cpfCnpj}
                onChange={handleChange}
                placeholder="000.000.000-00"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Telefone Celular com DDD</label>
              <input
                type="text"
                name="mobilePhone"
                required
                disabled={isLoading}
                value={formData.mobilePhone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Endereço / Logradouro</label>
                <input
                  type="text"
                  name="address"
                  required
                  disabled={isLoading}
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
                  required
                  disabled={isLoading}
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
                  required
                  disabled={isLoading}
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
                  required
                  disabled={isLoading}
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-1.5 justify-center text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Processamento fiscal emitido via Asaas.</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gerando Faturamento...</span>
                </>
              ) : (
                <span>Ir para o Pagamento</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};