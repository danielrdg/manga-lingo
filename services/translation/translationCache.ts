// Service para cache de traduções

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPageTranslation } from '../../types';

const CACHE_PREFIX = 'translation_cache_';

function getCacheKey(mangaId: string, pageNumber: number): string {
  return `${CACHE_PREFIX}${mangaId}_${pageNumber}`;
}

export async function getCachedTranslation(
  mangaId: string,
  pageNumber: number
): Promise<IPageTranslation | null> {
  try {
    const key = getCacheKey(mangaId, pageNumber);
    const cached = await AsyncStorage.getItem(key);
    
    if (cached) {
      return JSON.parse(cached) as IPageTranslation;
    }
    
    return null;
  } catch (error) {
    console.error('[Translation Cache] Error getting cache:', error);
    return null;
  }
}

export async function setCachedTranslation(
  translation: IPageTranslation
): Promise<void> {
  try {
    if (!translation.mangaId) {
      console.warn('[Translation Cache] No mangaId provided');
      return;
    }
    const key = getCacheKey(translation.mangaId, translation.pageNumber);
    await AsyncStorage.setItem(key, JSON.stringify(translation));
  } catch (error) {
    console.error('[Translation Cache] Error setting cache:', error);
  }
}

export async function clearMangaTranslationCache(mangaId: string): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const mangaKeys = keys.filter(key => key.startsWith(`${CACHE_PREFIX}${mangaId}_`));
    
    if (mangaKeys.length > 0) {
      await AsyncStorage.multiRemove(mangaKeys);
    }
  } catch (error) {
    console.error('[Translation Cache] Error clearing cache:', error);
  }
}

export async function clearAllTranslationCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch (error) {
    console.error('[Translation Cache] Error clearing all cache:', error);
  }
}

// Funções auxiliares que aceitam chave única
export async function getCachedTranslationByKey(
  key: string
): Promise<IPageTranslation | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (cached) {
      return JSON.parse(cached) as IPageTranslation;
    }
    
    return null;
  } catch (error) {
    console.error('[Translation Cache] Error getting cache by key:', error);
    return null;
  }
}

export async function cacheTranslation(
  key: string,
  translation: IPageTranslation
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(translation));
  } catch (error) {
    console.error('[Translation Cache] Error caching translation:', error);
  }
}
