import React from 'react';
import { UserPlus } from 'lucide-react';
import type { Lead, Tag as TagType } from '@/types';
import { FunilSettingsDropdown } from './FunilSettingsDropdown'; // Ajuste o caminho se necessário

interface Bucket {
  id: string;
  name: string;
}

interface FunilHeaderProps {
  savedLeads: Lead[];
  buckets: Bucket[];
  tags: TagType[];
  isLoading: boolean;
  onNewLeadClick: () => void;
  onManageTagsClick: () => void;
  onNewColumnClick: () => void;
  onImportLeadsInBulk: (leads: Partial<Lead>[]) => Promise<void>;
  onManageAIConfigClick: () => void; 
}

export const FunilHeader: React.FC<FunilHeaderProps> = ({
  savedLeads,
  buckets,
  tags,
  isLoading,
  onNewLeadClick,
  onManageTagsClick,
  onNewColumnClick,
  onImportLeadsInBulk,
  onManageAIConfigClick
}) => {
  return (
    <div className="flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-[#073c59]">Funil de Vendas</h2>
        <p className="text-sm text-slate-500">
          {isLoading ? 'Buscando seu pipeline...' : `${savedLeads.length} leads no pipeline`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* AÇÃO PRIMÁRIA */}
        <button
          type="button"
          onClick={onNewLeadClick}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>

        {/* COMPONENTE DE CONFIGURAÇÕES ISOLADO */}
        <FunilSettingsDropdown
          savedLeads={savedLeads}
          buckets={buckets}
          tags={tags}
          isLoading={isLoading}
          onManageTagsClick={onManageTagsClick}
          onNewColumnClick={onNewColumnClick}
          onImportLeadsInBulk={onImportLeadsInBulk}
          onManageAIConfigClick={onManageAIConfigClick}
        />
      </div>
    </div>
  );
};