// Service para OCR usando ML Kit
// @ts-nocheck - ML Kit types may vary between versions

import TextRecognition from '@react-native-ml-kit/text-recognition';
import { IOcrResult, IOcrBlock, IOcrLine } from '../../types';

export async function recognizeText(imageUri: string): Promise<IOcrResult> {
  try {
    console.log('[OCR] Processing image:', imageUri);
    
    // ML Kit text recognition
    const result = await TextRecognition.recognize(imageUri);
    
    const blocks: IOcrBlock[] = result.blocks.map((block) => {
      const frame = block.frame;
      return {
        text: block.text,
        boundingBox: {
          x: frame?.origin?.x || 0,
          y: frame?.origin?.y || 0,
          width: frame?.size?.width || 0,
          height: frame?.size?.height || 0,
        },
        lines: block.lines.map((line): IOcrLine => {
          const lineFrame = line.frame;
          return {
            text: line.text,
            boundingBox: {
              x: lineFrame?.origin?.x || 0,
              y: lineFrame?.origin?.y || 0,
              width: lineFrame?.size?.width || 0,
              height: lineFrame?.size?.height || 0,
            },
            confidence: 0.9, // ML Kit doesn't provide confidence per line
          };
        }),
        confidence: 0.9, // ML Kit doesn't provide confidence per block
      };
    });
    
    const fullText = result.blocks.map(b => b.text).join('\n');
    const avgConfidence = blocks.length > 0 ? 0.9 : 0;
    
    console.log('[OCR] Found', blocks.length, 'text blocks');
    
    return {
      text: fullText,
      blocks,
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error('[OCR] Error:', error);
    return {
      text: '',
      blocks: [],
      confidence: 0,
    };
  }
}

export async function recognizeTextFromBase64(base64: string): Promise<IOcrResult> {
  // Convert base64 to data URI if needed
  const uri = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  return recognizeText(uri);
}

// Mock function para testes
export function createMockOcrResult(text: string): IOcrResult {
  const blocks: IOcrBlock[] = [{
    text,
    boundingBox: { x: 10, y: 10, width: 100, height: 20 },
    lines: [{
      text,
      boundingBox: { x: 10, y: 10, width: 100, height: 20 },
      confidence: 0.95,
    }],
    confidence: 0.95,
  }];
  
  return {
    text,
    blocks,
    confidence: 0.95,
  };
}
