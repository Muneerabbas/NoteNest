import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colorScheme: 'light' | 'dark';
  preference: ThemePreference;
  isHydrated: boolean;
  setPreference: (nextPreference: ThemePreference) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = 'notesnest.themePreference';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveColorScheme(
  preference: ThemePreference,
  deviceColorScheme: ColorSchemeName
): 'light' | 'dark' {
  if (preference === 'system') {
    return deviceColorScheme === 'dark' ? 'dark' : 'light';
  }

  return preference;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydratePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          storedPreference === 'light' ||
          storedPreference === 'dark' ||
          storedPreference === 'system'
        ) {
          setPreference(storedPreference);
        }
      } finally {
        setIsHydrated(true);
      }
    };

    void hydratePreference();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persistPreference = async () => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    };

    void persistPreference();
  }, [isHydrated, preference]);

  const colorScheme = resolveColorScheme(preference, deviceColorScheme);

  const value = useMemo(
    () => ({
      colorScheme,
      preference,
      isHydrated,
      setPreference,
      toggleTheme: () =>
        setPreference((current) =>
          resolveColorScheme(current, deviceColorScheme) === 'dark' ? 'light' : 'dark'
        ),
    }),
    [colorScheme, deviceColorScheme, isHydrated, preference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemePreference must be used inside ThemeProvider');
  }

  return context;
}

export function useColorScheme() {
  return useThemePreference().colorScheme;
}
