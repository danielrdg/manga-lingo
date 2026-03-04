// Store para gerenciar o estado do leitor

import { create } from 'zustand';
import { IPage, IPageTranslation } from '../types';

interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

interface ReaderStore {
  // Estado
  currentMangaId: string | null;
  currentPage: number;
  totalPages: number;
  pages: IPage[];
  translations: Map<number, IPageTranslation>;
  isLoading: boolean;
  isTranslating: boolean;
  showOriginalText: boolean;
  error: AppError | null;
  
  // Actions
  setCurrentManga: (mangaId: string, totalPages: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPages: (pages: IPage[]) => void;
  addTranslation: (pageNumber: number, translation: IPageTranslation) => void;
  toggleOriginalText: () => void;
  setLoading: (loading: boolean) => void;
  setTranslating: (translating: boolean) => void;
  setError: (error: AppError | null) => void;
  reset: () => void;
}

export const useReaderStore = create<ReaderStore>((set, get) => ({
  // Estado inicial
  currentMangaId: null,
  currentPage: 1,
  totalPages: 0,
  pages: [],
  translations: new Map(),
  isLoading: false,
  isTranslating: false,
  showOriginalText: false,
  error: null,
  
  // Actions
  setCurrentManga: (mangaId, totalPages) => set({
    currentMangaId: mangaId,
    totalPages,
    currentPage: 1,
    pages: [],
    translations: new Map(),
  }),
  
  setCurrentPage: (page) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) {
      set({ currentPage: page });
    }
  },
  
  setTotalPages: (totalPages) => set({ totalPages }),
  
  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },
  
  previousPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },
  
  setPages: (pages) => set({ pages }),
  
  addTranslation: (pageNumber, translation) => set((state) => {
    const newTranslations = new Map(state.translations);
    newTranslations.set(pageNumber, translation);
    return { translations: newTranslations };
  }),
  
  toggleOriginalText: () => set((state) => ({
    showOriginalText: !state.showOriginalText,
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setTranslating: (isTranslating) => set({ isTranslating }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    currentMangaId: null,
    currentPage: 1,
    totalPages: 0,
    pages: [],
    translations: new Map(),
    isLoading: false,
    isTranslating: false,
    error: null,
  }),
}));
