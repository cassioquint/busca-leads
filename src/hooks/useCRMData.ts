import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { Lead } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export interface Bucket { id: string; name: string; }
export interface Tag { id: string; name: string; color: string; }

export const useCRMData = () => {
  const [funilLeads, setFunilLeads] = useState<Lead[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingCRM, setIsLoadingCRM] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.email) return;

      try {
        setIsLoadingCRM(true);
        const bucketsData = await api.getBuckets(user.email);
        setBuckets(bucketsData);

        const tagsData = await api.getTags(user.email);
        setTags(tagsData);

        const leadsData = await api.getFunilLeads(user.email);
        setFunilLeads(leadsData);
      } catch (error) {
        console.error('Falha ao carregar dados do CRM:', error);
      } finally {
        setIsLoadingCRM(false);
      }
    };

    loadData();
  }, [user?.email]);

  return {
    funilLeads,
    setFunilLeads,
    buckets,
    setBuckets,
    tags,
    setTags,
    isLoadingCRM
  };
};
