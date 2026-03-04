// Tipos para configurações

export interface ISettings {
  theme: 'light' | 'dark' | 'system';
  readingMode: 'page' | 'scroll';
  readingDirection: 'ltr' | 'rtl';
  autoTranslate: boolean;
  showOriginalText: boolean;
  translationApiUrl: string;
  fontSize: number;
}

export const DEFAULT_SETTINGS: ISettings = {
  theme: 'system',
  readingMode: 'page',
  readingDirection: 'rtl',
  autoTranslate: true,
  showOriginalText: false,
  translationApiUrl: 'https://libretranslate.com/translate',
  fontSize: 14,
};
