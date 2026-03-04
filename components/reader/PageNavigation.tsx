// Navegação entre páginas

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageSelect?: (page: number) => void;
}

export function PageNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PageNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentPage <= 1 && styles.disabled]}
        onPress={onPrevious}
        disabled={currentPage <= 1}
      >
        <Text style={styles.buttonText}>◀</Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          {currentPage} / {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, currentPage >= totalPages && styles.disabled]}
        onPress={onNext}
        disabled={currentPage >= totalPages}
      >
        <Text style={styles.buttonText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  disabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  pageInfo: {
    paddingHorizontal: SPACING.lg,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
