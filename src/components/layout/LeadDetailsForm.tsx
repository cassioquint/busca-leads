import React from 'react';
import { Target, Briefcase, Phone, MapPin } from 'lucide-react';
import type { LeadFormData } from '@/types';

interface LeadDetailsFormProps {
  formData: { name: string; type: string; phone: string; address: string; notes: string };
  setFormData: React.Dispatch<React.SetStateAction<LeadFormData>>;
  isEditMode: boolean;
}

export const LeadDetailsForm: React.FC<LeadDetailsFormProps> = ({ formData, setFormData, isEditMode }) => {
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2 && value.length <= 6) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    else if (value.length > 6 && value.length <= 10) value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    else if (value.length > 10) value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    setFormData({ ...formData, phone: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 ml-1">Nome da Empresa / Lead</label>
        <div className="relative">
          <Target className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            required
            disabled={isEditMode}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Padaria do João"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-75 disabled:bg-slate-100/50 disabled:cursor-not-allowed transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">Segmento</label>
          <div className="relative">
            <Briefcase className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              disabled={isEditMode}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ex: Alimentos"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-75 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1">WhatsApp / Telefone</label>
          <div className="relative">
            <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={15}
              placeholder="(00) 00000-0000"
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 ml-1">Endereço</label>
        <div className="relative">
          <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            disabled={isEditMode}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Ex: Rua das Flores, 123"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-75 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between ml-1">
          <label className="text-xs font-bold text-slate-700">Anotações / Histórico Comercial</label>
        </div>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Digite detalhes da abordagem, propostas enviadas, objeções..."
          rows={4}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-medium text-slate-700 leading-relaxed placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};