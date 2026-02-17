import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  token: string | null;
  isHydrated: boolean;
  setAuthToken: (nextToken: string) => void;
  clearAuthToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_TOKEN_STORAGE_KEY = 'notesnest.authToken';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (storedToken) {
          setToken(storedToken);
        }
      } finally {
        setIsHydrated(true);
      }
    };

    void hydrateToken();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistToken = async () => {
      if (token) {
        await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
        return;
      }

      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    };

    void persistToken();
  }, [isHydrated, token]);

  const value = useMemo(
    () => ({
      token,
      isHydrated,
      setAuthToken: (nextToken: string) => setToken(nextToken),
      clearAuthToken: () => setToken(null),
    }),
    [isHydrated, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
