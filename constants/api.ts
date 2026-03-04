// URLs de API

export const API_URLS = {
  // LibreTranslate - API de tradução gratuita e open source
  translation: {
    default: 'https://libretranslate.com/translate',
    // Instâncias públicas alternativas
    alternatives: [
      'https://translate.argosopentech.com/translate',
      'https://libretranslate.de/translate',
    ],
  },
};

// Configurações de tradução
export const TRANSLATION_CONFIG = {
  sourceLanguage: 'en',
  targetLanguage: 'pt',
  format: 'text',
};
