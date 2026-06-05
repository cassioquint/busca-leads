import React, { useState, useEffect, useRef } from 'react';
import { Clock, Trash2, Calendar, Tag, Plus } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import type { Lead, Tag as TagType } from '@/types';

interface CardDropdownProps {
  lead: Lead;
  tags: TagType[];
  onChangeLeadTag: (leadId: string, tagId: string | null) => void;
  onDeleteLead: (id: string) => void;
  onUpdateFollowUp?: (leadId: string, date: string | null) => void;
}

export const CardDropdown: React.FC<CardDropdownProps> = ({
  lead,
  tags,
  onChangeLeadTag,
  onDeleteLead,
  onUpdateFollowUp
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Guardará as coordenadas (X e Y) exatas de onde o menu deve brotar na tela
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Captura o clique e calcula a posição geográfica exata do botão na viewport
  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      // Abre o menu colado abaixo do botão, alinhado à direita dele (com margem de segurança)
      setMenuCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right - 200 // 200px é a largura (w-50) do nosso menu
      });
    }
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  // 🌟 FIX: Declarada a função de confirmação que estava faltando no escopo!
  const handleConfirmDelete = () => {
    onDeleteLead(lead.id);
    setShowDeleteModal(false);
  };

  // 🌟 FIX: Tipagem do parâmetro ajustada para aceitar string, null ou undefined e evitar conflitos
  const getInputValue = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  };

  const handleDateChange = (isoDate: string) => {
    if (!isoDate) {
      if (onUpdateFollowUp) onUpdateFollowUp(lead.id, null);
      return;
    }
    const [year, month, day] = isoDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    if (onUpdateFollowUp) onUpdateFollowUp(lead.id, formattedDate);
    setShowMenu(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleMenu}
        className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-md transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100 cursor-pointer block"
        style={{ opacity: showMenu ? 1 : undefined }}
        title="Ações do lead"
      >
        <span className="text-base font-bold tracking-widest leading-none block -mt-1">...</span>
      </button>

      {/* RENDERIZAÇÃO COM MENU FIXED (Tema Claro) */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${menuCoords.top}px`,
            left: `${menuCoords.left}px`
          }}
          className="z-[9999] w-50 bg-white border border-slate-200/80 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 text-left space-y-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Opção: Adicionar ao Dia */}
          <button
            type="button"
            className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
            <span>Adicionar ao Meu Dia</span>
          </button>

          {/* Seção: Rótulos Integrada */}
          <div className="px-2.5 py-1.5 space-y-1">
            <div className="flex items-center gap-2.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Rótulo</span>
            </div>
            <select
              value={lead.tagId || ''}
              onChange={(e) => {
                onChangeLeadTag(lead.id, e.target.value || null);
                setShowMenu(false);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium outline-none cursor-pointer focus:border-indigo-500 focus:bg-white transition-all"
            >
              <option value="">Sem Rótulo</option>
              {tags.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 my-1" />

          {/* Seção: Agendamento Retomada */}
          <div className="px-2.5 py-1.5 space-y-1">
            <div className="flex items-center gap-2.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Agendar Retomada</span>
            </div>
            <div className="relative w-full">
              <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              <input
                type="date"
                value={getInputValue(lead.followUpDate)}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full text-left text-xs text-slate-600 font-medium px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-1" />

          {/* Opção: Excluir Lead */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="w-full text-left text-xs text-red-600 hover:bg-red-50 font-bold px-2.5 py-2 rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Excluir</span>
          </button>
        </div>
      )}

      {/* MODAL DE DELEÇÃO */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Excluir este Lead?"
          description={lead.title}
        />
      )}
    </div>
  );
};