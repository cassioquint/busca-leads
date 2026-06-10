import React, { useEffect, useState } from 'react';
import { type User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { api } from '@/services/api';
import type { ExtendedUser } from '@/types';
import { AuthContext, type LimitModalType } from './AuthContextCore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [limitModalType, setLimitModalType] = useState<LimitModalType>(null);

  const fetchDbUserData = async (firebaseUser: FirebaseUser): Promise<Partial<ExtendedUser> | null> => {
    try {
      const token = await firebaseUser.getIdToken();
      const dbData = await api.getProfile(token);
      return dbData;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error(`❌ Erro na sincronização do usuário com a Neon: ${msg}`);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    const dbData = await fetchDbUserData(auth.currentUser);
    if (dbData) {
      setUser((prev) => {
        if (!prev) return null;
        return { ...prev, ...dbData } as ExtendedUser;
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const dbData = await fetchDbUserData(currentUser);

        if (isMounted) {
          if (dbData) {
            setUser({
              ...currentUser,
              ...dbData,
            } as ExtendedUser);
          } else {
            setUser(currentUser as unknown as ExtendedUser);
          }
          setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = () => signOut(auth);

  // Atalho seguro e reativo para pegar o token do Firebase a qualquer momento
  const getFirebaseToken = async (): Promise<string> => {
    if (!auth.currentUser) return '';
    return await auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      logout,
      refreshUserData,
      limitModalType,
      setLimitModalType,
      getFirebaseToken
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};