// Store para gerenciar a biblioteca de mangás

import { create } from 'zustand';
import { IManga } from '../types';

interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

interface MangaStore {
  // Estado
  mangas: IManga[];
  isLoading: boolean;
  error: AppError | null;
  
  // Actions
  setMangas: (mangas: IManga[]) => void;
  addManga: (manga: IManga) => void;
  removeManga: (id: string) => void;
  updateManga: (id: string, updates: Partial<IManga>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

export const useMangaStore = create<MangaStore>((set) => ({
  // Estado inicial
  mangas: [],
  isLoading: false,
  error: null,
  
  // Actions
  setMangas: (mangas) => set({ mangas }),
  
  addManga: (manga) => set((state) => ({
    mangas: [...state.mangas, manga],
  })),
  
  removeManga: (id) => set((state) => ({
    mangas: state.mangas.filter((m) => m.id !== id),
  })),
  
  updateManga: (id, updates) => set((state) => ({
    mangas: state.mangas.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    ),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
