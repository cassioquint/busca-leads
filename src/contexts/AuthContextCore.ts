import { createContext } from 'react';
import type { ExtendedUser } from '@/types';

export interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isLimitModalOpen: boolean;
  setLimitModalOpen: (open: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLimitModalOpen: false,
  setLimitModalOpen: () => { },
} as unknown as AuthContextType);