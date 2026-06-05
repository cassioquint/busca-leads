import React, { useState, useRef } from 'react';
import { X, Tag, Trash2, Edit2, Check } from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import type { Tag as TagType } from '@/types';

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: TagType[];
  onCreateTag: (name: string, color: string) => Promise<void>;
  onUpdateTag: (id: string, name: string, color: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
}

const PRESET_COLORS = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];

export const ManageTagsModal: React.FC<ManageTagsModalProps> = ({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setTagName('');
    setSelectedColor(PRESET_COLORS[0]);
    setEditingTagId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      if (editingTagId) {
        await onUpdateTag(editingTagId, tagName.trim(), selectedColor);
      } else {
        await onCreateTag(tagName.trim(), selectedColor);
      }
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (tag: TagType) => {
    setEditingTagId(tag.id);
    setTagName(tag.name);
    setSelectedColor(tag.color);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 🌟 GATILHO: Prepara a tag e abre o modal customizado
  const handleDeleteClick = (tag: TagType) => {
    setTagToDelete(tag);
    setShowDeleteModal(true);
  };

  // 🌟 CONFIRMAÇÃO: Executa a ação da API e limpa os estados locais
  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;
    try {
      await onDeleteTag(tagToDelete.id);
      setShowDeleteModal(false);
      setTagToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Caixa do Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Cabeçalho */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gerenciar Rótulos</h3>
              <p className="text-xs text-slate-500 font-medium">Organize e personalize as tags dos seus leads</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollContainerRef} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Formulário de Criação/Edição */}
          <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {editingTagId ? '🧠 Editando Rótulo' : '✨ Criar Novo Rótulo'}
            </h4>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-xs font-bold text-slate-600 ml-1">Nome do Rótulo</label>
                <input 
                  required
                  ref={inputRef}
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Ex: Cliente Premium, Frio..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium text-slate-700"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                {editingTagId && (
                  <button type="button" onClick={resetForm} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 transition-all cursor-pointer">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-100 transition-all cursor-pointer">
                  {editingTagId ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>

            {/* Seletor de Cores */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 ml-1">Cor de Identificação</label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm relative border border-black/5"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Listagem de Rótulos Ativos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Rótulos Ativos ({tags.length})</h4>
            
            {tags.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum rótulo customizado criado ainda.</p>
            ) : (
              <div className="border border-slate-150 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm font-semibold text-slate-700 truncate">{tag.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditClick(tag)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                        title="Editar rótulo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(tag)} // 🌟 FIX: Alterado para abrir o modal unificado
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Excluir rótulo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setTagToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Excluir este Rótulo?"
        description={ tagToDelete ? tagToDelete.name : "" }
      />
    </div>
  );
};