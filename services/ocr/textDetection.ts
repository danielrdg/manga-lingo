// Service para detecção de texto em balões de fala

import { IOcrBlock, ITextBlock, IBoundingBox } from '../../types';

// Filtrar blocos de texto que provavelmente são balões de fala
export function filterSpeechBubbles(blocks: IOcrBlock[]): ITextBlock[] {
  const textBlocks: ITextBlock[] = [];
  
  for (const block of blocks) {
    // Filtrar blocos com confiança razoável
    if (block.confidence < 0.5) continue;
    
    // Criar bloco de texto
    textBlocks.push({
      id: `block_${textBlocks.length}`,
      text: block.text,
      boundingBox: block.boundingBox,
      confidence: block.confidence,
    });
  }
  
  return textBlocks;
}

// Agrupar linhas próximas em blocos de texto
export function groupTextLines(blocks: IOcrBlock[]): ITextBlock[] {
  // Implementação simples - cada bloco é um grupo
  return filterSpeechBubbles(blocks);
}

// Calcular se dois bounding boxes se sobrepõem
export function doBoxesOverlap(box1: IBoundingBox, box2: IBoundingBox): boolean {
  return !(
    box1.x + box1.width < box2.x ||
    box2.x + box2.width < box1.x ||
    box1.y + box1.height < box2.y ||
    box2.y + box2.height < box1.y
  );
}

// Expandir bounding box por uma margem
export function expandBoundingBox(box: IBoundingBox, margin: number): IBoundingBox {
  return {
    x: Math.max(0, box.x - margin),
    y: Math.max(0, box.y - margin),
    width: box.width + margin * 2,
    height: box.height + margin * 2,
  };
}
