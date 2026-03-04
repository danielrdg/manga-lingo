// Hook para OCR + Tradução de páginas de mangá

import { useState, useCallback } from 'react';
import { recognizeText } from '../services/ocr';
import { translateText, getCachedTranslationByKey, cacheTranslation } from '../services/translation';
import { IPageTranslation, ITranslation } from '../types';

interface UseTranslationResult {
  isProcessing: boolean;
  progress: string;
  error: string | null;
  translatePage: (imageUri: string, pageNumber: number, mangaId: string) => Promise<IPageTranslation | null>;
}

export function useTranslation(): UseTranslationResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const translatePage = useCallback(async (
    imageUri: string,
    pageNumber: number,
    mangaId: string
  ): Promise<IPageTranslation | null> => {
    const cacheKey = `${mangaId}_page_${pageNumber}`;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Verificar cache primeiro
      setProgress('Verificando cache...');
      const cached = await getCachedTranslationByKey(cacheKey);
      if (cached) {
        setProgress('Tradução carregada do cache!');
        setIsProcessing(false);
        return cached as IPageTranslation;
      }
      
      // OCR - Reconhecer texto na imagem
      setProgress('Detectando texto na página...');
      const ocrResult = await recognizeText(imageUri);
      
      if (!ocrResult.blocks || ocrResult.blocks.length === 0) {
        setProgress('Nenhum texto encontrado na página');
        setIsProcessing(false);
        return null;
      }
      
      // Traduzir cada bloco
      setProgress(`Traduzindo ${ocrResult.blocks.length} blocos de texto...`);
      
      const textBlocks: ITranslation[] = [];
      
      for (let i = 0; i < ocrResult.blocks.length; i++) {
        const block = ocrResult.blocks[i];
        setProgress(`Traduzindo bloco ${i + 1}/${ocrResult.blocks.length}...`);
        
        // Pular blocos muito pequenos (provavelmente ruído)
        if (block.text.trim().length < 2) continue;
        
        try {
          const translatedText = await translateText(block.text);
          
          textBlocks.push({
            originalText: block.text,
            translatedText,
            boundingBox: block.boundingBox,
            confidence: block.confidence,
          });
        } catch (translateError) {
          console.warn('[Translation] Failed to translate block:', block.text, translateError);
          // Continuar com próximo bloco
        }
      }
      
      // Criar resultado final
      const pageTranslation: IPageTranslation = {
        mangaId,
        pageNumber,
        textBlocks,
        translations: textBlocks, // Alias
        processedAt: new Date(),
      };
      
      // Salvar no cache
      setProgress('Salvando no cache...');
      await cacheTranslation(cacheKey, pageTranslation);
      
      setProgress(`Tradução concluída! ${textBlocks.length} textos traduzidos.`);
      setIsProcessing(false);
      
      return pageTranslation;
      
    } catch (err) {
      console.error('[useTranslation] Error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao traduzir página');
      setIsProcessing(false);
      return null;
    }
  }, []);

  return {
    isProcessing,
    progress,
    error,
    translatePage,
  };
}
