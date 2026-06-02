import { auth } from '../firebase';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };

  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
