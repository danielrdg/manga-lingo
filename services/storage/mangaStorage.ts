// Service para armazenamento de mangás
// @ts-nocheck - expo-file-system types issue

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { IManga } from '../../types';
import { APP_CONFIG } from '../../constants';

const MANGA_LIST_KEY = 'manga_list';

export async function getAllMangas(): Promise<IManga[]> {
  try {
    const data = await AsyncStorage.getItem(MANGA_LIST_KEY);
    if (data) {
      return JSON.parse(data) as IManga[];
    }
    return [];
  } catch (error) {
    console.error('[Manga Storage] Error getting mangas:', error);
    return [];
  }
}

export async function saveManga(manga: IManga): Promise<void> {
  try {
    const mangas = await getAllMangas();
    const existingIndex = mangas.findIndex(m => m.id === manga.id);
    
    if (existingIndex >= 0) {
      mangas[existingIndex] = manga;
    } else {
      mangas.push(manga);
    }
    
    await AsyncStorage.setItem(MANGA_LIST_KEY, JSON.stringify(mangas));
  } catch (error) {
    console.error('[Manga Storage] Error saving manga:', error);
    throw {
      code: 'MANGA_SAVE_FAILED',
      message: 'Falha ao salvar mangá',
      details: error,
    };
  }
}

export async function deleteManga(id: string): Promise<void> {
  try {
    // Remover da lista
    const mangas = await getAllMangas();
    const filtered = mangas.filter(m => m.id !== id);
    await AsyncStorage.setItem(MANGA_LIST_KEY, JSON.stringify(filtered));
    
    // Remover arquivos do mangá
    const docDir = FileSystem.documentDirectory || '';
    const mangaDir = `${docDir}${APP_CONFIG.directories.mangas}/${id}`;
    const dirInfo = await FileSystem.getInfoAsync(mangaDir);
    
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(mangaDir, { idempotent: true });
    }
  } catch (error) {
    console.error('[Manga Storage] Error deleting manga:', error);
    throw {
      code: 'MANGA_DELETE_FAILED',
      message: 'Falha ao excluir mangá',
      details: error,
    };
  }
}

export async function getManga(id: string): Promise<IManga | null> {
  try {
    const mangas = await getAllMangas();
    return mangas.find(m => m.id === id) || null;
  } catch (error) {
    console.error('[Manga Storage] Error getting manga:', error);
    return null;
  }
}

// Alias para getManga
export const getMangaById = getManga;

export async function updateManga(
  id: string,
  updates: Partial<IManga>
): Promise<void> {
  try {
    const mangas = await getAllMangas();
    const index = mangas.findIndex(m => m.id === id);
    
    if (index >= 0) {
      mangas[index] = { ...mangas[index], ...updates };
      await AsyncStorage.setItem(MANGA_LIST_KEY, JSON.stringify(mangas));
    }
  } catch (error) {
    console.error('[Manga Storage] Error updating manga:', error);
    throw {
      code: 'MANGA_UPDATE_FAILED',
      message: 'Falha ao atualizar mangá',
      details: error,
    };
  }
}

export async function updateMangaProgress(
  id: string,
  currentPage: number
): Promise<void> {
  return updateManga(id, { currentPage, lastReadAt: new Date() });
}

export function generateMangaId(): string {
  return `manga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
