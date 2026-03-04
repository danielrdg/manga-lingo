// Service para gerenciamento de cache
// @ts-nocheck - expo-file-system types issue

import * as FileSystem from 'expo-file-system';
import { APP_CONFIG } from '../../constants';

const cacheDir = FileSystem.cacheDirectory || '';
const CACHE_DIR = `${cacheDir}${APP_CONFIG.directories.cache}/`;

export async function initCacheDirectory(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  } catch (error) {
    console.error('[Cache Manager] Error initializing cache:', error);
  }
}

export async function getCacheSize(): Promise<number> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists && 'size' in dirInfo) {
      return dirInfo.size || 0;
    }
    return 0;
  } catch (error) {
    console.error('[Cache Manager] Error getting cache size:', error);
    return 0;
  }
}

export async function clearCache(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      await initCacheDirectory();
    }
  } catch (error) {
    console.error('[Cache Manager] Error clearing cache:', error);
    throw {
      code: 'CACHE_CLEAR_FAILED',
      message: 'Falha ao limpar cache',
      details: error,
    };
  }
}

// Alias for clearCache
export const clearAllCache = clearCache;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
