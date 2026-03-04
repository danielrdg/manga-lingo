// Service para extração de páginas de arquivos PDF
// @ts-nocheck - expo-file-system types issue

import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import { IPage } from '../../types';
import { APP_CONFIG } from '../../constants';

export async function extractPdfPages(uri: string, mangaId: string): Promise<IPage[]> {
  try {
    // Ler o arquivo PDF
    const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });
    
    const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pages: IPage[] = [];
    const pageCount = pdfDoc.getPageCount();
    
    // Criar diretório para as páginas
    const docDir = FileSystem.documentDirectory || '';
    const mangaDir = `${docDir}${APP_CONFIG.directories.mangas}/${mangaId}`;
    await FileSystem.makeDirectoryAsync(mangaDir, { intermediates: true });
    
    // Para PDF, vamos armazenar as informações das páginas
    // A renderização real será feita por uma lib de visualização
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      
      pages.push({
        pageNumber: i + 1,
        imageUri: uri, // O URI original do PDF - será renderizado pelo viewer
        width,
        height,
      });
    }
    
    return pages;
  } catch (error) {
    console.error('[PDF Extractor] Error:', error);
    throw {
      code: 'PDF_EXTRACTION_FAILED',
      message: 'Falha ao extrair páginas do PDF',
      details: error,
    };
  }
}

export async function getPdfPageCount(uri: string): Promise<number> {
  try {
    const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64' as any,
    });
    
    const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error('[PDF Extractor] Error getting page count:', error);
    return 0;
  }
}

// Extrai uma página específica do PDF (retorna o URI para renderização)
export async function extractPdfPage(uri: string, pageNumber: number): Promise<string | null> {
  try {
    // Para PDFs, retornamos o URI original com info da página
    // O viewer vai renderizar a página específica
    // Em uma implementação completa, poderíamos usar react-native-pdf
    return `${uri}#page=${pageNumber}`;
  } catch (error) {
    console.error('[PDF Extractor] Error extracting page:', error);
    return null;
  }
}
