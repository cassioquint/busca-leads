import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode; // Permite passar strings ou elementos com <strong>
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Caixa do Modal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-full">
          <Trash2 className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tem certeza que deseja remover <strong className="text-slate-700 font-semibold">{description}</strong>?<br />Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md shadow-red-100 cursor-pointer hover:bg-red-700 transition-colors"
          >
            Sim, Remover
          </button>
        </div>
      </div>
    </div>
  );
};