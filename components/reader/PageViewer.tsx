// Visualizador de página

import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { IPage } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PageViewerProps {
  page: IPage;
  children?: React.ReactNode;
}

export function PageViewer({ page, children }: PageViewerProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: page.imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
      {/* Overlay para texto traduzido */}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
