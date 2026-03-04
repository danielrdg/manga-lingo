// Service para OCR usando ML Kit
// TODO: Reinstalar @react-native-ml-kit/text-recognition quando build estiver estável

// import TextRecognition from '@react-native-ml-kit/text-recognition';
import { IOcrResult, IOcrBlock, IOcrLine } from '../../types';

// Placeholder enquanto ML Kit não está disponível
export async function recognizeText(imageUri: string): Promise<IOcrResult> {
  console.log('[OCR] ML Kit not installed yet, returning empty result for:', imageUri);
  return {
    text: '',
    blocks: [],
    confidence: 0,
  };
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
