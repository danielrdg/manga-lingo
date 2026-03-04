// Overlay de texto traduzido

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ITranslation } from '../../types';
import { COLORS } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TranslatedOverlayProps {
  translations: ITranslation[];
  pageWidth: number;
  pageHeight: number;
  showOriginal?: boolean;
  fontSize?: number;
}

export function TranslatedOverlay({
  translations,
  pageWidth,
  pageHeight,
  showOriginal = false,
  fontSize = 12,
}: TranslatedOverlayProps) {
  // Calcular escala da imagem para a tela
  const scaleX = SCREEN_WIDTH / pageWidth;
  const scaleY = SCREEN_HEIGHT / pageHeight;
  const scale = Math.min(scaleX, scaleY);

  // Calcular offset para centralizar
  const offsetX = (SCREEN_WIDTH - pageWidth * scale) / 2;
  const offsetY = (SCREEN_HEIGHT - pageHeight * scale) / 2;

  return (
    <View style={styles.container}>
      {translations.map((translation, index) => {
        const { boundingBox } = translation;
        
        // Escalar e posicionar o texto
        const left = offsetX + boundingBox.x * scale;
        const top = offsetY + boundingBox.y * scale;
        const width = boundingBox.width * scale;
        const height = boundingBox.height * scale;

        return (
          <View
            key={index}
            style={[
              styles.textBox,
              {
                left,
                top,
                width,
                minHeight: height,
              },
            ]}
          >
            <Text
              style={[styles.translatedText, { fontSize }]}
              numberOfLines={0}
            >
              {showOriginal ? translation.originalText : translation.translatedText}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  textBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 2,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translatedText: {
    color: COLORS.light.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
