import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContextCore';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};