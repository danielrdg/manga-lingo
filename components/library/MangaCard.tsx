// Card de mangá para a biblioteca

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IManga } from '../../types';
import { COLORS, SPACING } from '../../constants';

interface MangaCardProps {
  manga: IManga;
  onPress: () => void;
  onLongPress?: () => void;
}

export function MangaCard({ manga, onPress, onLongPress }: MangaCardProps) {
  const progress = manga.totalPages > 0
    ? Math.round((manga.currentPage / manga.totalPages) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.coverContainer}>
        {manga.coverUri ? (
          <Image source={{ uri: manga.coverUri }} style={styles.cover} />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>📖</Text>
          </View>
        )}
        {manga.isTranslated && (
          <View style={styles.translatedBadge}>
            <Text style={styles.badgeText}>PT</Text>
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {manga.title}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {manga.currentPage}/{manga.totalPages}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.light.surface,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  coverContainer: {
    aspectRatio: 2 / 3,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  translatedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.light.success,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: SPACING.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.light.border,
    borderRadius: 2,
    marginRight: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.light.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: COLORS.light.textSecondary,
  },
});
