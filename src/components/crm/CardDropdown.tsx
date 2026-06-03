import React, { useState, useRef, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import type { Lead, Tag } from '@/types';

interface CardDropdownProps {
    lead: Lead;
    tags: Tag[];
    todayStr: string;
    isUrgent: boolean;
    onChangeLeadTag: (leadId: string, tagId: string | null) => void;
    onDeleteLead: (id: string) => void;
}

export const CardDropdown: React.FC<CardDropdownProps> = ({
    lead,
    tags,
    todayStr,
    isUrgent,
    onChangeLeadTag,
    onDeleteLead,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setShowMenu(false);
    };

    const handleConfirmDelete = () => {
        onDeleteLead(lead.id);
        setShowDeleteModal(false);
    };

    return (
        <div className="relative shrink-0" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100 cursor-pointer block"
                style={{ opacity: showMenu ? 1 : undefined }}
                title="Ações do lead"
            >
                <span className="text-base font-bold tracking-widest leading-none block -mt-1">...</span>
            </button>

            {showMenu && (
                <div className="absolute right-0 top-7 w-48 bg-white border border-slate-200/80 rounded-xl shadow-xl z-30 p-2 animate-in fade-in slide-in-from-top-1 duration-100">
                    {/* Seção: Rótulos */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 px-2 pt-1 uppercase tracking-wider">
                            Definir Rótulo
                        </label>
                        <select
                            value={lead.tagId || ''}
                            onChange={(e) => {
                                onChangeLeadTag(lead.id, e.target.value || null);
                                setShowMenu(false);
                            }}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                            <option value="">Sem Rótulo</option>
                            {tags.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="my-1.5 border-t border-slate-100" />

                    {/* Seção: Agendamento */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                            Agendar Retomada
                        </label>
                        <button
                            onClick={() => {
                                const dataInput = prompt("Defina a data de follow-up (DD/MM/AAAA):", lead.followUpDate || todayStr);
                                if (dataInput !== null) {
                                    alert(`Agendado para: ${dataInput}`);
                                }
                                setShowMenu(false);
                            }}
                            className="w-full text-left text-xs text-slate-600 hover:text-indigo-600 font-semibold px-2 py-1.5 rounded-lg hover:bg-indigo-50/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-amber-500' : 'text-slate-400'}`} />
                            <span>{lead.followUpDate ? 'Alterar Data' : 'Definir Data'}</span>
                        </button>
                    </div>

                    {/* 🌟 Divisor e Nova Seção: Operações Perigosas */}
                    <div className="my-1.5 border-t border-slate-100" />

                    <div className="space-y-1">
                        <button
                            onClick={handleDeleteClick}
                            className="w-full text-left text-xs text-red-600 hover:bg-red-50 font-semibold px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Excluir Lead</span>
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop escurecido e desfocado */}
                    <div 
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    
                    {/* Caixa do Modal */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-full">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        
                        <div className="space-y-1">
                            <h4 className="text-base font-bold text-slate-900">Excluir este Lead?</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Tem certeza que deseja remover <strong className="text-slate-700 font-semibold">"{lead.title}"</strong>? Esta ação não poderá ser desfeita.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full pt-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-100 transition-colors cursor-pointer"
                            >
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};