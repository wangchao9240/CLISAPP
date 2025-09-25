// Map state management using Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region } from '../types/map.types';
import { ClimateLayer, MapLevel } from '../types/climate.types';
import { QUEENSLAND_REGION } from '../constants/mapConfig';
import { DEFAULT_LAYER } from '../constants/climateData';

interface MapState {
  // Map view state
  region: Region;
  activeLayer: ClimateLayer;
  mapLevel: MapLevel;
  
  // Loading states
  isLoading: boolean;
  tileLoadingProgress: number;
  error?: string;
  
  // Actions
  setRegion: (region: Region) => void;
  setActiveLayer: (layer: ClimateLayer) => void;
  setMapLevel: (level: MapLevel) => void;
  toggleMapLevel: () => void;
  setLoading: (loading: boolean) => void;
  setTileLoadingProgress: (progress: number) => void;
  setError: (error?: string) => void;
  resetMapState: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      // Initial state
      region: QUEENSLAND_REGION,
      activeLayer: DEFAULT_LAYER,
      mapLevel: 'lga',
      isLoading: false,
      tileLoadingProgress: 0,
      error: undefined,

      // Actions
      setRegion: (region) => set({ region }),
      
      setActiveLayer: (layer) => set({ activeLayer: layer, isLoading: true }),
      
      setMapLevel: (level) => set({ mapLevel: level, isLoading: true }),
      
      toggleMapLevel: () => {
        const currentLevel = get().mapLevel;
        const newLevel = currentLevel === 'lga' ? 'suburb' : 'lga';
        set({ mapLevel: newLevel, isLoading: true });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setTileLoadingProgress: (progress) => set({ tileLoadingProgress: progress }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      resetMapState: () => set({
        region: QUEENSLAND_REGION,
        activeLayer: DEFAULT_LAYER,
        mapLevel: 'lga',
        isLoading: false,
        tileLoadingProgress: 0,
        error: undefined,
      }),
    }),
    {
      name: 'clisapp-map',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ activeLayer: state.activeLayer }),
    }
  )
);
