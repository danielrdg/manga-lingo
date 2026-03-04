// Tipos para OCR

import { IBoundingBox } from './translation';

export interface IOcrResult {
  text: string;
  blocks: IOcrBlock[];
  confidence: number;
}

export interface IOcrBlock {
  text: string;
  boundingBox: IBoundingBox;
  lines: IOcrLine[];
  confidence: number;
}

export interface IOcrLine {
  text: string;
  boundingBox: IBoundingBox;
  confidence: number;
}
