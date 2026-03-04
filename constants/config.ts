// Configurações globais do app

export const APP_CONFIG = {
  name: 'Manga Reader',
  version: '1.0.0',
  
  // Diretórios de armazenamento
  directories: {
    mangas: 'mangas',
    cache: 'cache',
    translations: 'translations',
  },
  
  // Limites
  limits: {
    maxPageCache: 10,
    maxTranslationCache: 100,
    debounceMs: 500,
  },
  
  // Formatos suportados
  supportedFormats: {
    pdf: ['application/pdf'],
    cbz: ['application/zip', 'application/x-cbz'],
    cbr: ['application/x-cbr', 'application/x-rar-compressed'],
    images: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
};
