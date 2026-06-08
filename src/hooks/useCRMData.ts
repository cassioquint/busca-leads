import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { Lead, Bucket, Tag } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export const useCRMData = () => {
  const [radarLeads, setRadarLeads] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
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
        const [bucketsData, tagsData, leadsData] = await Promise.all([
          api.getBuckets(user.email),
          api.getTags(user.email),
          api.getFunilLeads(user.email)
        ]);
        setBuckets(bucketsData);
        setTags(tagsData);
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
    radarLeads, setRadarLeads,
    hasSearched, setHasSearched,
    funilLeads, setFunilLeads,
    buckets, setBuckets,
    tags, setTags,
    isLoadingCRM
  };
};