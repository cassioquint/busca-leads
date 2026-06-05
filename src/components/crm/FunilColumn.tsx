import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { FunilCard } from './';
import type { Lead, Tag } from '@/types';

interface Bucket {
  id: string;
  name: string;
}

interface FunilColumnProps {
  col: Bucket;
  columnLeads: Lead[];
  buckets: Bucket[];
  tags: Tag[];
  onMoveLead: (id: string, direction: 'forward' | 'backward') => void;
  onChangeLeadTag: (leadId: string, tagId: string | null) => void;
  onDeleteLead: (id: string) => void;
  onCardClick: (lead: Lead) => void;
  onRenameColumn: (id: string, newName: string) => void;
  onDeleteColumn: (id: string) => void;
  onMoveColumn: (id: string, direction: 'left' | 'right') => void;
  isFirst: boolean;
  isLast: boolean;
}

export const FunilColumn: React.FC<FunilColumnProps> = ({
  col,
  columnLeads,
  buckets,
  tags,
  onMoveLead,
  onChangeLeadTag,
  onDeleteLead,
  onCardClick,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumn,
  isFirst,
  isLast,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right - 160
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
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleRename = () => {
    setShowMenu(false);
    // Dispara a intenção de clique passando a coluna atual completa
    onRenameColumn(col.id, col.name); 
  };

  const handleDelete = () => {
    setShowMenu(false);
    // Passa a ordem de deleção adiante. O pai checa se tem leads e abre o modal seguro
    onDeleteColumn(col.id);
  };

  return (
    <div className="w-80 max-h-full bg-slate-100/70 border border-slate-200/60 rounded-2xl p-4 flex flex-col space-y-3 shrink-0 overflow-hidden group/column">

      {/* CABEÇALHO DA COLUNA (🌟 FIX: Restaurada a estrutura de título e contador) */}
      <div className="flex items-center justify-between px-1 shrink-0 relative">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="font-bold text-sm text-slate-700 truncate max-w-[150px]" title={col.name}>
            {col.name}
          </h4>
          <span className="bg-slate-200/80 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
            {columnLeads.length}
          </span>
        </div>

        {/* Bloco de Ações e Movimentação Lateral */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover/column:opacity-100 transition-all shrink-0">
          
          {/* Seta para Esquerda */}
          {!isFirst && (
            <button
              type="button"
              onClick={() => onMoveColumn(col.id, 'left')}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer"
              title="Mover para esquerda"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Seta para Direita */}
          {!isLast && (
            <button
              type="button"
              onClick={() => onMoveColumn(col.id, 'right')}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-all cursor-pointer"
              title="Mover para direita"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Botão de Opções original */}
          <button
            ref={buttonRef}
            type="button"
            onClick={handleToggleMenu}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-all cursor-pointer"
            style={{ opacity: showMenu ? 1 : undefined }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DROPDOWN FIXED */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: `${menuCoords.top}px`, left: `${menuCoords.left}px` }}
          className="z-[9999] w-40 bg-white border border-slate-200/80 rounded-xl shadow-2xl p-1.5 text-left space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleRename}
            className="w-full text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-semibold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Renomear</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-full text-left text-xs text-red-600 hover:bg-red-50 font-bold px-2.5 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Excluir Coluna</span>
          </button>
        </div>
      )}

      {/* ÁREA ROLÁVEL DOS CARDS */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        {columnLeads.map((lead) => (
          <FunilCard
            key={lead.id}
            lead={lead}
            colId={col.id}
            buckets={buckets}
            tags={tags}
            onMoveLead={onMoveLead}
            onChangeLeadTag={onChangeLeadTag}
            onDeleteLead={onDeleteLead}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};