// Service para tradução usando LibreTranslate API

import { API_URLS, TRANSLATION_CONFIG } from '../../constants';

interface TranslationResponse {
  translatedText: string;
}

interface TranslationError {
  error: string;
}

export async function translateText(
  text: string,
  apiUrl?: string
): Promise<string> {
  const url = apiUrl || API_URLS.translation.default;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: TRANSLATION_CONFIG.sourceLanguage,
        target: TRANSLATION_CONFIG.targetLanguage,
        format: TRANSLATION_CONFIG.format,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json() as TranslationError;
      throw new Error(errorData.error || 'Translation request failed');
    }
    
    const data = await response.json() as TranslationResponse;
    return data.translatedText;
  } catch (error) {
    console.error('[Translation] Error:', error);
    throw {
      code: 'TRANSLATION_FAILED',
      message: 'Falha ao traduzir texto',
      details: error,
    };
  }
}

export async function translateBatch(
  texts: string[],
  apiUrl?: string
): Promise<string[]> {
  // Traduz múltiplos textos em sequência
  // LibreTranslate não suporta batch nativamente
  const results: string[] = [];
  
  for (const text of texts) {
    try {
      const translated = await translateText(text, apiUrl);
      results.push(translated);
    } catch (error) {
      console.error('[Translation] Batch item failed:', error);
      results.push(text); // Mantém original em caso de erro
    }
  }
  
  return results;
}

export async function testTranslationApi(apiUrl: string): Promise<boolean> {
  try {
    const result = await translateText('Hello', apiUrl);
    return result.length > 0;
  } catch {
    return false;
  }
}
