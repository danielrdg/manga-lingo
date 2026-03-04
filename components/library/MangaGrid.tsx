// Grid de mangás

import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { IManga } from '../../types';
import { MangaCard } from './MangaCard';
import { SPACING, COLORS } from '../../constants';

interface MangaGridProps {
  mangas: IManga[];
  onMangaPress: (manga: IManga) => void;
  onMangaLongPress?: (manga: IManga) => void;
}

export function MangaGrid({
  mangas,
  onMangaPress,
  onMangaLongPress,
}: MangaGridProps) {
  if (mangas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📚</Text>
        <Text style={styles.emptyTitle}>Nenhum mangá</Text>
        <Text style={styles.emptyText}>
          Importe um arquivo PDF ou CBZ para começar
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mangas}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <MangaCard
          manga={item}
          onPress={() => onMangaPress(item)}
          onLongPress={() => onMangaLongPress?.(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
  },
});
