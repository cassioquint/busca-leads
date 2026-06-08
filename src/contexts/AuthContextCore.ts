import { createContext } from 'react';
import type { ExtendedUser } from '@/types';

export type LimitModalType = 'SEARCHES_LIMIT' | 'FUNNEL_LIMIT' | null;

export interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  // 🌟 Alterado de boolean para o nosso tipo unificado de controle
  limitModalType: LimitModalType;
  setLimitModalType: (type: LimitModalType) => void;
}

export const AuthContext = createContext<AuthContextType>({
  limitModalType: null,
  setLimitModalType: () => { },
} as unknown as AuthContextType);