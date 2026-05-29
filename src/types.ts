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
  bucket: 'abordar' | 'contato' | 'proposta' | 'negociacao';
  followUpDate?: string | null;
  isSaved: boolean;
  googlePlaceId?: string | null;
}