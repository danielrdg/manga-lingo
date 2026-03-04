// Store para configurações do usuário

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISettings, DEFAULT_SETTINGS } from '../types';

interface SettingsStore {
  // Estado
  settings: ISettings;
  
  // Actions
  updateSettings: (updates: Partial<ISettings>) => void;
  resetSettings: () => void;
  setTheme: (theme: ISettings['theme']) => void;
  setReadingMode: (mode: ISettings['readingMode']) => void;
  toggleAutoTranslate: () => void;
  toggleShowOriginalText: () => void;
  setTranslationApiUrl: (url: string) => void;
  setFontSize: (size: number) => void;
  loadSettings: () => void; // No-op, persist handles this
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Estado inicial
      settings: DEFAULT_SETTINGS,
      
      // Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates },
      })),
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
      
      setTheme: (theme) => set((state) => ({
        settings: { ...state.settings, theme },
      })),
      
      setReadingMode: (readingMode) => set((state) => ({
        settings: { ...state.settings, readingMode },
      })),
      
      toggleAutoTranslate: () => set((state) => ({
        settings: {
          ...state.settings,
          autoTranslate: !state.settings.autoTranslate,
        },
      })),
      
      toggleShowOriginalText: () => set((state) => ({
        settings: {
          ...state.settings,
          showOriginalText: !state.settings.showOriginalText,
        },
      })),
      
      setTranslationApiUrl: (translationApiUrl) => set((state) => ({
        settings: { ...state.settings, translationApiUrl },
      })),
      
      setFontSize: (fontSize) => set((state) => ({
        settings: { ...state.settings, fontSize },
      })),
      
      // No-op: persist middleware handles hydration automatically
      loadSettings: () => {},
    }),
    {
      name: 'manga-reader-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
