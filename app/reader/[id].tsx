// Tela do leitor de mangá

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReaderStore, useMangaStore, useSettingsStore } from '../../store';
import { ZoomableImage, PageNavigation, TranslatedOverlay } from '../../components/reader';
import { LoadingSpinner, ErrorMessage } from '../../components/common';
import { getMangaById, updateManga } from '../../services/storage';
import { extractPdfPage, extractCbzPage } from '../../services/files';
import { useTranslation } from '../../hooks';
import { IManga, IPageTranslation } from '../../types';
import { COLORS, SPACING } from '../../constants';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { settings, loadSettings } = useSettingsStore();
  const {
    currentPage,
    totalPages,
    isLoading,
    translations,
    setCurrentPage,
    setTotalPages,
    setLoading,
    addTranslation,
    nextPage,
    previousPage,
  } = useReaderStore();

  const [manga, setManga] = useState<IManga | null>(null);
  const [currentPageUri, setCurrentPageUri] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [pageTranslation, setPageTranslation] = useState<IPageTranslation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Hook de tradução
  const { isProcessing: isTranslating, progress: translationProgress, translatePage } = useTranslation();

  // Carregar mangá
  useEffect(() => {
    loadSettings();
    loadManga();
  }, [id]);

  const loadManga = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const loadedManga = await getMangaById(id);
      
      if (!loadedManga) {
        setError('Mangá não encontrado');
        return;
      }

      setManga(loadedManga);
      setTotalPages(loadedManga.totalPages);
      setCurrentPage(loadedManga.currentPage || 1);
    } catch (err) {
      console.error('Error loading manga:', err);
      setError('Erro ao carregar mangá');
    } finally {
      setLoading(false);
    }
  };

  // Carregar página atual
  useEffect(() => {
    if (manga) {
      loadCurrentPage();
    }
  }, [manga, currentPage]);

  const loadCurrentPage = async () => {
    if (!manga) return;

    try {
      setLoading(true);
      setCurrentPageUri(null);

      let pageUri: string | null = null;

      if (manga.sourceType === 'pdf') {
        pageUri = await extractPdfPage(manga.sourceUri, currentPage);
      } else if (manga.sourceType === 'cbz') {
        pageUri = await extractCbzPage(manga.sourceUri, currentPage);
      }

      if (pageUri) {
        setCurrentPageUri(pageUri);
        setError(null);
      } else {
        setError('Falha ao carregar página');
      }
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  };

  // Salvar progresso
  const saveProgress = useCallback(async () => {
    if (manga) {
      try {
        await updateManga(manga.id, {
          currentPage,
          lastReadAt: new Date(),
        });
      } catch (err) {
        console.error('Error saving progress:', err);
      }
    }
  }, [manga, currentPage]);

  useEffect(() => {
    saveProgress();
  }, [currentPage, saveProgress]);

  // Navegação
  const handlePreviousPage = () => {
    if (settings.readingDirection === 'rtl') {
      nextPage();
    } else {
      previousPage();
    }
  };

  const handleNextPage = () => {
    if (settings.readingDirection === 'rtl') {
      previousPage();
    } else {
      nextPage();
    }
  };

  // Toggle controles
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // Traduzir página atual
  const handleTranslate = async () => {
    if (!currentPageUri || !manga) {
      Alert.alert('Erro', 'Nenhuma página carregada para traduzir');
      return;
    }
    
    // Se já tem tradução, toggle mostrar/esconder
    if (pageTranslation && pageTranslation.pageNumber === currentPage) {
      setShowTranslation(!showTranslation);
      return;
    }
    
    // Processar OCR + tradução
    const result = await translatePage(currentPageUri, currentPage, manga.id);
    
    if (result) {
      setPageTranslation(result);
      setShowTranslation(true);
      
      if (!result.textBlocks || result.textBlocks.length === 0) {
        Alert.alert('Aviso', 'Nenhum texto foi encontrado nesta página.');
      }
    } else {
      Alert.alert(
        'Tradução',
        'Não foi possível traduzir esta página. Verifique:\n\n• Se há texto na imagem\n• Sua conexão com a internet\n• Se a API de tradução está acessível'
      );
    }
  };
  
  // Limpar tradução ao mudar de página
  useEffect(() => {
    setPageTranslation(null);
    setShowTranslation(false);
  }, [currentPage]);

  // Voltar
  const handleBack = () => {
    router.back();
  };

  if (error && !manga) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <ErrorMessage
          message={error}
          onRetry={loadManga}
        />
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={!showControls} />

      {/* Área de leitura */}
      <TouchableOpacity
        style={styles.readerArea}
        activeOpacity={1}
        onPress={toggleControls}
      >
        {isLoading ? (
          <LoadingSpinner message="Carregando página..." />
        ) : currentPageUri ? (
          <View style={styles.imageContainer}>
            <ZoomableImage uri={currentPageUri} />
            {/* Overlay de tradução */}
            {showTranslation && pageTranslation && pageTranslation.textBlocks && (
              <View style={styles.translationOverlay}>
                <TranslatedOverlay
                  translations={pageTranslation.textBlocks}
                  pageWidth={Dimensions.get('window').width}
                  pageHeight={Dimensions.get('window').height}
                  showOriginal={settings.showOriginalText}
                  fontSize={settings.fontSize}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noPage}>
            <Text style={styles.noPageText}>Página não disponível</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Controles superiores */}
      {showControls && (
        <SafeAreaView style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleBack}>
            <Text style={styles.controlIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            {manga?.title || 'Mangá'}
          </Text>

          <TouchableOpacity 
            style={[styles.controlButton, showTranslation && styles.controlButtonActive]} 
            onPress={handleTranslate}
            disabled={isTranslating}
          >
            <Text style={styles.controlIcon}>
              {isTranslating ? '⏳' : showTranslation ? '👁️' : '🔤'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* Controles inferiores */}
      {showControls && (
        <View style={styles.bottomControls}>
          <PageNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </View>
      )}

      {/* Loading de tradução */}
      {isTranslating && (
        <View style={styles.translatingOverlay}>
          <LoadingSpinner message={translationProgress || 'Traduzindo...'} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light.background,
    padding: SPACING.md,
  },
  readerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  translationOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  noPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingTop: SPACING.xl,
  },
  controlButton: {
    padding: SPACING.sm,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(98, 0, 238, 0.5)',
    borderRadius: 8,
  },
  controlIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  pageIndicator: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  translatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
