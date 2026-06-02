import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { Lead, Tag } from '@/types';

interface CardDropdownProps {
    lead: Lead;
    tags: Tag[];
    todayStr: string;
    isUrgent: boolean;
    onChangeLeadTag: (leadId: string, tagId: string | null) => void;
}

export const CardDropdown: React.FC<CardDropdownProps> = ({
    lead,
    tags,
    todayStr,
    isUrgent,
    onChangeLeadTag,
}) => {
    const [showMenu, setShowMenu] = useState(false);
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
                </div>
            )}
        </div>
    );
};
