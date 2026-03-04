// Tipos para traduções e blocos de texto

export interface ITextBlock {
  id: string;
  text: string;
  boundingBox: IBoundingBox;
  confidence: number;
}

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ITranslation {
  originalText: string;
  translatedText: string;
  boundingBox: IBoundingBox;
  pageNumber?: number;
  confidence?: number;
}

export interface IPageTranslation {
  mangaId?: string;
  pageNumber: number;
  textBlocks: ITranslation[];
  translations?: ITranslation[]; // Alias for textBlocks
  translatedAt?: Date;
  processedAt?: Date;
}
