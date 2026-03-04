// Tela principal - Biblioteca de Mangás

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useMangaStore } from '../store';
import { MangaGrid, ImportButton } from '../components/library';
import { LoadingSpinner } from '../components/common';
import { 
  getAllMangas, 
  saveManga, 
  deleteManga, 
  generateMangaId 
} from '../services/storage';
import { extractCbzPages, getCbzPageCount, getPdfPageCount } from '../services/files';
import { IManga } from '../types';
import { COLORS, SPACING, APP_CONFIG } from '../constants';

export default function LibraryScreen() {
  const router = useRouter();
  const { mangas, setMangas, isLoading, setLoading, setError } = useMangaStore();
  const [importing, setImporting] = useState(false);

  // Carregar mangás salvos
  const loadMangas = useCallback(async () => {
    setLoading(true);
    try {
      const savedMangas = await getAllMangas();
      setMangas(savedMangas);
    } catch (error) {
      console.error('Error loading mangas:', error);
      setError({
        code: 'LOAD_FAILED',
        message: 'Falha ao carregar biblioteca',
        details: error,
      });
    } finally {
      setLoading(false);
    }
  }, [setMangas, setLoading, setError]);

  useEffect(() => {
    loadMangas();
  }, [loadMangas]);

  // Importar arquivo
  const handleImport = async () => {
    try {
      setImporting(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/zip',
          'application/x-cbz',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setImporting(false);
        return;
      }

      const file = result.assets[0];
      const fileName = file.name || 'Manga sem nome';
      const fileUri = file.uri;
      const mimeType = file.mimeType || '';

      // Determinar tipo do arquivo
      let sourceType: IManga['sourceType'] = 'pdf';
      let totalPages = 0;

      if (mimeType.includes('zip') || fileName.toLowerCase().endsWith('.cbz')) {
        sourceType = 'cbz';
        totalPages = await getCbzPageCount(fileUri);
      } else if (mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
        sourceType = 'pdf';
        totalPages = await getPdfPageCount(fileUri);
      }

      if (totalPages === 0) {
        Alert.alert('Erro', 'Não foi possível ler o arquivo');
        setImporting(false);
        return;
      }

      // Criar mangá
      const newManga: IManga = {
        id: generateMangaId(),
        title: fileName.replace(/\.(pdf|cbz|cbr)$/i, ''),
        coverUri: null,
        sourceUri: fileUri,
        sourceType,
        totalPages,
        currentPage: 1,
        lastReadAt: null,
        createdAt: new Date(),
        isTranslated: false,
      };

      // Salvar
      await saveManga(newManga);
      await loadMangas();

      Alert.alert('Sucesso', `"${newManga.title}" importado com sucesso!`);
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Erro', 'Falha ao importar arquivo');
    } finally {
      setImporting(false);
    }
  };

  // Abrir mangá
  const handleMangaPress = (manga: IManga) => {
    router.push(`/reader/${manga.id}`);
  };

  // Excluir mangá
  const handleMangaLongPress = (manga: IManga) => {
    Alert.alert(
      'Excluir Mangá',
      `Deseja excluir "${manga.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteManga(manga.id);
              await loadMangas();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir mangá');
            }
          },
        },
      ]
    );
  };

  // Ir para configurações
  const goToSettings = () => {
    router.push('/settings');
  };

  if (isLoading && mangas.length === 0) {
    return <LoadingSpinner message="Carregando biblioteca..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header com botão de configurações */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de mangás */}
      <MangaGrid
        mangas={mangas}
        onMangaPress={handleMangaPress}
        onMangaLongPress={handleMangaLongPress}
      />

      {/* Botão de importar */}
      <ImportButton onPress={handleImport} disabled={importing} />

      {/* Loading de importação */}
      {importing && (
        <View style={styles.importingOverlay}>
          <LoadingSpinner message="Importando mangá..." />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.sm,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  importingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
