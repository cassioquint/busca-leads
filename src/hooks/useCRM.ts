import { useAuth } from '@/contexts/AuthContext';
import { useCRMData } from './useCRMData';
import { useCRMLeads } from './useCRMLeads';
import { useCRMConfig } from './useCRMConfig';

export const useCRM = () => {
  const { user } = useAuth();
  
  // 1. Carrega os estados reativos globais
  const data = useCRMData();

  // 2. Acopla as ações especialistas de Leads
  const leadsActions = useCRMLeads({
    userEmail: user?.email,
    radarLeads: data.radarLeads,
    setRadarLeads: data.setRadarLeads,
    funilLeads: data.funilLeads,
    setFunilLeads: data.setFunilLeads,
    buckets: data.buckets,
    tags: data.tags
  });

  // 3. Acopla as ações de Infraestrutura do Kanban
  const configActions = useCRMConfig({
    userEmail: user?.email,
    buckets: data.buckets,
    setBuckets: data.setBuckets,
    setTags: data.setTags
  });

  // 4. Retorna tudo unificado sem quebrar nenhum componente externo
  return {
    isLoadingCRM: data.isLoadingCRM,
    radarLeads: data.radarLeads,
    setRadarLeads: data.setRadarLeads,
    hasSearched: data.hasSearched,
    setHasSearched: data.setHasSearched,
    funilLeads: data.funilLeads,
    buckets: data.buckets,
    tags: data.tags,
    ...leadsActions,
    ...configActions
  };
};