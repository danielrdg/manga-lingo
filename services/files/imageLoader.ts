// Service para carregamento de imagens

import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import { IPage } from '../../types';

export async function loadImage(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}

export async function updatePageDimensions(pages: IPage[]): Promise<IPage[]> {
  const updatedPages: IPage[] = [];
  
  for (const page of pages) {
    try {
      const { width, height } = await loadImage(page.imageUri);
      updatedPages.push({ ...page, width, height });
    } catch (error) {
      console.error(`[Image Loader] Failed to get dimensions for page ${page.pageNumber}:`, error);
      updatedPages.push(page);
    }
  }
  
  return updatedPages;
}

export async function copyImageToStorage(
  sourceUri: string,
  destinationUri: string
): Promise<string> {
  try {
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });
    return destinationUri;
  } catch (error) {
    console.error('[Image Loader] Error copying image:', error);
    throw {
      code: 'IMAGE_COPY_FAILED',
      message: 'Falha ao copiar imagem',
      details: error,
    };
  }
}
