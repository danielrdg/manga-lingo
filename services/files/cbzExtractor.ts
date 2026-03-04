// Service para extração de imagens de arquivos CBZ/CBR
// @ts-nocheck - expo-file-system types issue

import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system';
import { IPage } from '../../types';
import { APP_CONFIG } from '../../constants';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function isImageFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function sortByName(a: string, b: string): number {
  // Ordenação natural para nomes de arquivo (page1, page2, page10, etc.)
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export async function extractCbzPages(uri: string, mangaId: string): Promise<IPage[]> {
  try {
    // Ler o arquivo CBZ (que é um ZIP)
    const zipBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });
    
    const zip = new JSZip();
    await zip.loadAsync(zipBase64, { base64: true });
    
    // Filtrar apenas arquivos de imagem e ordenar
    const imageFiles = Object.keys(zip.files)
      .filter(name => !zip.files[name].dir && isImageFile(name))
      .sort(sortByName);
    
    if (imageFiles.length === 0) {
      throw new Error('Nenhuma imagem encontrada no arquivo');
    }
    
    // Criar diretório para as páginas
    const docDir = FileSystem.documentDirectory || '';
    const mangaDir = `${docDir}${APP_CONFIG.directories.mangas}/${mangaId}`;
    await FileSystem.makeDirectoryAsync(mangaDir, { intermediates: true });
    
    const pages: IPage[] = [];
    
    // Extrair cada imagem
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const file = zip.files[filename];
      
      // Extrair imagem como base64
      const imageBase64 = await file.async('base64');
      
      // Salvar imagem no sistema de arquivos
      const pageUri = `${mangaDir}/page_${String(i + 1).padStart(4, '0')}.jpg`;
      await FileSystem.writeAsStringAsync(pageUri, imageBase64, {
        encoding: 'base64' as any,
      });
      
      pages.push({
        pageNumber: i + 1,
        imageUri: pageUri,
        width: 0, // Será determinado ao carregar a imagem
        height: 0,
      });
    }
    
    return pages;
  } catch (error) {
    console.error('[CBZ Extractor] Error:', error);
    throw {
      code: 'CBZ_EXTRACTION_FAILED',
      message: 'Falha ao extrair páginas do arquivo CBZ',
      details: error,
    };
  }
}

export async function getCbzPageCount(uri: string): Promise<number> {
  try {
    const zipBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });
    
    const zip = new JSZip();
    await zip.loadAsync(zipBase64, { base64: true });
    
    const imageFiles = Object.keys(zip.files)
      .filter(name => !zip.files[name].dir && isImageFile(name));
    
    return imageFiles.length;
  } catch (error) {
    console.error('[CBZ Extractor] Error getting page count:', error);
    return 0;
  }
}

// Extrai uma página específica do CBZ
export async function extractCbzPage(uri: string, pageNumber: number): Promise<string | null> {
  try {
    const zipBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });
    
    const zip = new JSZip();
    await zip.loadAsync(zipBase64, { base64: true });
    
    // Filtrar apenas arquivos de imagem e ordenar
    const imageFiles = Object.keys(zip.files)
      .filter(name => !zip.files[name].dir && isImageFile(name))
      .sort(sortByName);
    
    if (pageNumber < 1 || pageNumber > imageFiles.length) {
      return null;
    }
    
    const filename = imageFiles[pageNumber - 1];
    const file = zip.files[filename];
    const imageBase64 = await file.async('base64');
    
    // Determinar extensão
    const ext = filename.toLowerCase().split('.').pop() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    
    // Retornar como data URI
    return `data:${mimeType};base64,${imageBase64}`;
  } catch (error) {
    console.error('[CBZ Extractor] Error extracting page:', error);
    return null;
  }
}
