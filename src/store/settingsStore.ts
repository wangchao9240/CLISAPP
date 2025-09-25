// Settings and preferences state management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // User preferences
  isDarkMode: boolean;
  enableLocationServices: boolean;
  cacheEnabled: boolean;
  maxCacheSize: number; // in MB
  
  // Map provider configuration
  mapProvider: 'react-native-maps' | 'maplibre';
  
  // API configuration
  tileServerUrl: string;
  apiTimeout: number;
  
  // Actions
  setDarkMode: (enabled: boolean) => void;
  setLocationServices: (enabled: boolean) => void;
  setCacheEnabled: (enabled: boolean) => void;
  setMaxCacheSize: (size: number) => void;
  setMapProvider: (provider: 'react-native-maps' | 'maplibre') => void;
  setTileServerUrl: (url: string) => void;
  setApiTimeout: (timeout: number) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  isDarkMode: false,
  enableLocationServices: true,
  cacheEnabled: true,
  maxCacheSize: 100, // 100MB
  mapProvider: 'react-native-maps' as const,
  tileServerUrl: process.env.TILE_SERVER_URL || 'http://localhost:8080/tiles',
  apiTimeout: 10000, // 10 seconds
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setDarkMode: (enabled) => set({ isDarkMode: enabled }),
      setLocationServices: (enabled) => set({ enableLocationServices: enabled }),
      setCacheEnabled: (enabled) => set({ cacheEnabled: enabled }),
      setMaxCacheSize: (size) => set({ maxCacheSize: size }),
      setMapProvider: (provider) => set({ mapProvider: provider }),
      setTileServerUrl: (url) => set({ tileServerUrl: url }),
      setApiTimeout: (timeout) => set({ apiTimeout: timeout }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'clisapp-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
