export interface Lead {
  id: string;
  name: string;
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
  aiPitch?: string | null;
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
  uid: string;
  name?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  searchesThisMonth: number;
  planId: string;
  plan: PlanData;
  asaasCustomerId: string | null;
  asaasSubscriptionId: string | null;
  cpfCnpj?: string;
  mobilePhone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}

export interface AiConfigData {
  aiTone: string;
  service: string;
  pricing?: string;
  generalRule?: string;
}

export interface LeadFormData {
  name: string; 
  type: string; 
  phone: string; 
  address: string; 
  notes: string;
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  role: 'ai' | 'client' | 'user';
  content: string;
  createdAt?: string | Date;
}