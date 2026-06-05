import React, { useState } from 'react';
import { X, LayoutGrid } from 'lucide-react';

interface Bucket {
  id: string;
  name: string;
}

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialColumn?: Bucket | null;
  isEditMode?: boolean;
}

export const AddColumnModal: React.FC<AddColumnModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialColumn = null,
  isEditMode = false
}) => {
  // 🌟 FIX: O estado inicia diretamente com o valor correto, eliminando cascading renders
  const [columnName, setColumnName] = useState(() => {
    return isEditMode && initialColumn ? initialColumn.name : '';
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnName.trim()) return;
    onSubmit(columnName.trim());
    setColumnName(''); // Limpa localmente antes de fechar
    onClose();
  };

  const handleClose = () => {
    setColumnName(''); // Garante a limpeza do campo ao cancelar
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={handleClose} 
      />

      {/* Caixa do Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Cabeçalho Dinâmico */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? 'Editar Coluna' : 'Nova Coluna'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEditMode ? 'Altere as configurações do estágio' : 'Adicione uma nova etapa ao seu Kanban'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Nome da Etapa</label>
            <input 
              required
              autoFocus
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Ex: Reunião Agendada, Negociação..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isEditMode ? 'Salvar Alterações' : 'Criar Coluna'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};