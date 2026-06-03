import React, { useState, useEffect } from 'react';
import { X, Plus, Target, Phone, MapPin, Briefcase, FileText } from 'lucide-react';
import type { Lead } from '@/types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialLead?: Lead | null;
  isEditMode?: boolean;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialLead = null,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Sincronização e Limpeza Inteligente do Estado Comercial
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialLead) {
        setFormData({
          title: initialLead.title || '',
          type: initialLead.type || '',
          phone: initialLead.phone || '',
          address: initialLead.address || '',
          notes: initialLead.notes || ''
        });
      } else {
        setFormData({ title: '', type: '', phone: '', address: '', notes: '' });
      }
    } else {
      setFormData({ title: '', type: '', phone: '', address: '', notes: '' });
    }
  }, [isOpen, isEditMode, initialLead]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      value = value;
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho dinâmico */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isEditMode ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {isEditMode ? <FileText className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEditMode ? 'Detalhes e Observações' : 'Novo Lead Manual'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditMode ? 'Visualize os dados e anote o andamento do contato' : 'Cadastre um contato fora do radar'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto flex-1">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Nome da Empresa / Lead</label>
            <div className="relative">
              <Target className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                required
                disabled={isEditMode}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  placeholder="Ex: Alimentos"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-75 disabled:bg-slate-100/50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">WhatsApp / Telefone</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  /* 🔥 REMOVIDO disabled={isEditMode} para permitir alteração comercial */
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
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Ex: Rua das Flores, 123"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-75 disabled:bg-slate-100/50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          {/* Seção de anotações */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-slate-700">Anotações / Histórico Comercial</label>
              {isEditMode && <span className="text-[10px] text-slate-400 font-semibold">Salva ao enviar</span>}
            </div>
            <div className="relative">
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Digite detalhes da abordagem, propostas enviadas, objeções do cliente..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-medium text-slate-700 leading-relaxed placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Ações inferiores */}
          <div className="pt-3 flex gap-3 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Fechar
            </button>
            <button 
              type="submit"
              className={`flex-2 px-4 py-3 ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'} text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer`}
            >
              {isEditMode ? 'Salvar Alterações' : 'Adicionar ao Funil'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};