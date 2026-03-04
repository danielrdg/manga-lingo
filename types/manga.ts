// Tipos para mangás e páginas

export interface IManga {
  id: string;
  title: string;
  coverUri: string | null;
  sourceUri: string;
  sourceType: 'pdf' | 'cbz' | 'cbr' | 'images';
  totalPages: number;
  currentPage: number;
  lastReadAt: Date | null;
  createdAt: Date;
  isTranslated: boolean;
}

export interface IPage {
  pageNumber: number;
  imageUri: string;
  width: number;
  height: number;
}

export interface IChapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  pages: IPage[];
}
