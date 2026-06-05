import { useAuth } from '@/contexts/AuthContext';
import { useCRMData } from './useCRMData';
import { useCRMLeads } from './useCRMLeads';
import { useCRMConfig } from './useCRMConfig';

export const useCRM = () => {
  const { user } = useAuth();
  
  // 1. Carrega os estados reativos globais (leads, buckets, tags, loadings)
  const data = useCRMData();

  // 2. Acopla as ações especialistas de Leads (salvar, mover, notas, deleção)
  const leadsActions = useCRMLeads({
    userEmail: user?.email,
    radarLeads: data.radarLeads,
    setRadarLeads: data.setRadarLeads,
    funilLeads: data.funilLeads,
    setFunilLeads: data.setFunilLeads,
    buckets: data.buckets,
    tags: data.tags
  });

  // 3. Acopla as ações de Infraestrutura do Kanban (criar, renomear, excluir colunas e gerenciar tags)
  const configActions = useCRMConfig({
    userEmail: user?.email,
    buckets: data.buckets,
    setBuckets: data.setBuckets,
    setTags: data.setTags
  });

  // 4. Retorna tudo unificado de forma explícita e mapeada pelo compilador
  return {
    // Estados Globais
    isLoadingCRM: data.isLoadingCRM,
    radarLeads: data.radarLeads,
    setRadarLeads: data.setRadarLeads,
    hasSearched: data.hasSearched,
    setHasSearched: data.setHasSearched,
    funilLeads: data.funilLeads,
    buckets: data.buckets,
    tags: data.tags,
    
    // Ações de Leads (Açúcar sintático expandido do leadsActions)
    handleSaveLead: leadsActions.handleSaveLead,
    handleMoveLead: leadsActions.handleMoveLead,
    handleAddManualLead: leadsActions.handleAddManualLead,
    handleDeleteLead: leadsActions.handleDeleteLead,
    handleUpdateLeadNotes: leadsActions.handleUpdateLeadNotes,
    handleChangeLeadTag: leadsActions.handleChangeLeadTag,

    // Ações de Configuração Estrutural
    handleCreateColumn: configActions.handleCreateColumn,
    handleRenameColumn: configActions.handleRenameColumn,
    handleDeleteColumn: configActions.handleDeleteColumn,
    handleMoveColumn: configActions.handleMoveColumn,
    handleManageTags: configActions.handleManageTags
  };
};