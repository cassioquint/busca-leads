import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

// Define o que o nosso contexto vai espalhar pela aplicação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // O Firebase fica "escutando" mudanças de login/logout
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Terminou de verificar
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {/* Só renderiza o app depois de ter certeza se tem alguém logado ou não */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Um atalho (Hook) para usarmos em qualquer tela
export const useAuth = () => useContext(AuthContext);