export interface Lead {
  id: string;
  title: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  rating?: number | null;
  reviews?: number | null;
  openState: string;
  isOpen: boolean;
  thumbnail: string;
  instagram?: string | null;
  daysOpenText?: string | null;
  followUpDate?: string | null;
  isSaved: boolean;
  googlePlaceId?: string | null;
  bucketId: string;
  tagId?: string | null;
  tag?: Tag | null;
  notes?: string;
}

export interface Bucket {
  id: string;
  name: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface PlanData {
  id: string;
  slug: string;
  name: string;
  price: number;
  maxSearchesPerMonth: number;
  maxLeadsInFunnel: number;
  bulkImportAllowed: boolean;
  exportAllowed: boolean;
}

export interface ExtendedUser {
  // Como aqui não temos o escopo do Firebase puro direto, podemos tipar as propriedades base
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  searchesThisMonth: number;
  planId: string;
  plan: PlanData;
  asaasCustomerId: string | null;
  asaasSubscriptionId: string | null;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}