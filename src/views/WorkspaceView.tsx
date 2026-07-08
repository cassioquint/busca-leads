import React, { useState } from 'react';
import { RadarView } from '@/components/radar/RadarView';
import { FunilView } from '@/components/crm/FunilView';
import { useCRM } from '@/hooks/useCRM';
import { api } from '@/services/api';
import type { Lead } from '@/types';

interface WorkspaceViewProps {
  userEmail: string;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ userEmail }) => {
  const [isRadarOpen, setIsRadarOpen] = useState(true);
  
  const [radarLeads, setRadarLeads] = useState<Lead[]>(() => {
    const cache = localStorage.getItem('locus_last_search_results');
    return cache ? JSON.parse(cache) : [];
  });

  const [hasSearched, setHasSearched] = useState<boolean>(() => {
    const cache = localStorage.getItem('locus_has_searched');
    return cache === 'true';
  });

  // Todo o peso do CRM agora vive aqui, isolado do App.tsx
  const crm = useCRM();

  return (
    <>
      <RadarView
        isOpen={isRadarOpen}
        setIsOpen={setIsRadarOpen}
        leads={radarLeads}
        setLeads={setRadarLeads}
        hasSearched={hasSearched}
        setHasSearched={setHasSearched}
        onSaveLead={crm.handleSaveLead}
      />

      <FunilView
        leads={crm.funilLeads}
        buckets={crm.buckets}
        tags={crm.tags}
        onMoveLead={crm.handleMoveLead}
        onAddManualLead={(data) => crm.handleAddManualLead({
          name: data.name,
          phone: data.phone || 'Sem telefone',
          notes: data.notes || '',
          type: data.type || 'Não informado',
          address: data.address || 'Sem endereço',
          city: 'Cadastro Manual',
          openState: 'Adicionado Manualmente',
          isOpen: true,
          thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop'
        })}
        onCreateColumn={crm.handleCreateColumn}
        onRenameColumn={crm.handleRenameColumn}
        onDeleteColumn={crm.handleDeleteColumn}
        onMoveColumn={crm.handleMoveColumn}
        onCreateTag={crm.handleCreateTag}
        onUpdateTag={crm.handleUpdateTag}
        onDeleteTag={crm.handleDeleteTag}
        onChangeLeadTag={crm.handleChangeLeadTag}
        onDeleteLead={crm.handleDeleteLead}
        onUpdateLeadNotes={crm.handleUpdateLeadNotes}
        onImportLeadsInBulk={crm.handleImportLeadsInBulk}
        isLoading={crm.isLoadingCRM}
        
        // --- MÓDULO DE IA INTEGRADO ---
        userEmail={userEmail}
        onSaveAiConfig={async (data) => {
          await api.saveAiConfig(userEmail, data);
        }}
        onGenerateAIPitch={async (id) => {
          const pitch = await api.generateAIPitch(id, userEmail);
          crm.handleUpdateLeadPitch(id, pitch);
          return pitch;
        }}
        // 🌟 NOVA FUNÇÃO DA TRÉPLICA AQUI
        onGenerateAIReply={async (id, lastMessage, clientResponse) => {
          const reply = await api.generateLeadReply(id, lastMessage, clientResponse, userEmail);
          // Opcional: Atualizar o estado do React imediatamente para não perder a tréplica ao fechar o modal
          crm.handleUpdateLeadPitch(id, reply); 
          return reply;
        }}
      />
    </>
  );
};