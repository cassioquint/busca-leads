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