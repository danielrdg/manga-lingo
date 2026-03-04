// Tela de configurações

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useSettingsStore } from '../store';
import { clearAllCache, getCacheSize } from '../services/storage';
import { COLORS, SPACING, FONT_SIZES, API_URLS } from '../constants';

const DEFAULT_API_URL = API_URLS.translation.default;

export default function SettingsScreen() {
  const { settings, updateSettings, resetSettings, loadSettings } = useSettingsStore();
  const [cacheSize, setCacheSize] = useState('Calculando...');
  const [apiUrl, setApiUrl] = useState(settings.translationApiUrl);

  useEffect(() => {
    loadSettings();
    loadCacheSize();
  }, []);

  useEffect(() => {
    setApiUrl(settings.translationApiUrl);
  }, [settings.translationApiUrl]);

  const loadCacheSize = async () => {
    try {
      const size = await getCacheSize();
      const mb = (size / 1024 / 1024).toFixed(2);
      setCacheSize(`${mb} MB`);
    } catch {
      setCacheSize('Erro ao calcular');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover todas as traduções salvas. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllCache();
              await loadCacheSize();
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch {
              Alert.alert('Erro', 'Falha ao limpar cache');
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Restaurar Padrões',
      'Isso irá restaurar todas as configurações para os valores padrão. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: () => {
            resetSettings();
            setApiUrl(DEFAULT_API_URL);
            Alert.alert('Sucesso', 'Configurações restauradas!');
          },
        },
      ]
    );
  };

  const handleSaveApiUrl = () => {
    if (apiUrl.trim()) {
      updateSettings({ translationApiUrl: apiUrl.trim() });
      Alert.alert('Salvo', 'URL da API atualizada!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de Aparência */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Tema Escuro</Text>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(value) =>
              updateSettings({ theme: value ? 'dark' : 'light' })
            }
            trackColor={{ false: '#767577', true: COLORS.light.primary }}
          />
        </View>
      </View>

      {/* Seção de Tradução */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tradução</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto-Traduzir</Text>
          <Switch
            value={settings.autoTranslate}
            onValueChange={(value) =>
              updateSettings({ autoTranslate: value })
            }
            trackColor={{ false: '#767577', true: COLORS.light.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mostrar Original</Text>
          <Switch
            value={settings.showOriginalText}
            onValueChange={(value) =>
              updateSettings({ showOriginalText: value })
            }
            trackColor={{ false: '#767577', true: COLORS.light.primary }}
          />
        </View>

        <View style={styles.settingColumn}>
          <Text style={styles.settingLabel}>URL da API de Tradução</Text>
          <Text style={styles.settingHint}>
            LibreTranslate (gratuito e open source)
          </Text>
          <View style={styles.apiUrlRow}>
            <TextInput
              style={styles.textInput}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder={DEFAULT_API_URL}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveApiUrl}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Seção de Leitor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leitor</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Leitura da Direita para Esquerda</Text>
          <Switch
            value={settings.readingDirection === 'rtl'}
            onValueChange={(value) =>
              updateSettings({ readingDirection: value ? 'rtl' : 'ltr' })
            }
            trackColor={{ false: '#767577', true: COLORS.light.primary }}
          />
        </View>

        <View style={styles.settingColumn}>
          <Text style={styles.settingLabel}>
            Tamanho da Fonte: {settings.fontSize}
          </Text>
          <View style={styles.fontSizeButtons}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() =>
                updateSettings({ fontSize: Math.max(10, settings.fontSize - 2) })
              }
            >
              <Text style={styles.fontButtonText}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={() =>
                updateSettings({ fontSize: Math.min(24, settings.fontSize + 2) })
              }
            >
              <Text style={styles.fontButtonText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Seção de Armazenamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Armazenamento</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Tamanho do Cache</Text>
          <Text style={styles.settingValue}>{cacheSize}</Text>
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearCache}
        >
          <Text style={styles.dangerButtonText}>Limpar Cache de Traduções</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Reset */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.dangerButton, styles.resetButton]}
          onPress={handleResetSettings}
        >
          <Text style={styles.dangerButtonText}>Restaurar Configurações Padrão</Text>
        </TouchableOpacity>
      </View>

      {/* Info do App */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Manga Reader v1.0.0</Text>
        <Text style={styles.infoText}>
          Feito com ❤️ para quem ama mangás
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  section: {
    backgroundColor: COLORS.light.surface,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.light.primary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.background,
  },
  settingColumn: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.background,
  },
  settingLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.text,
  },
  settingValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textSecondary,
  },
  settingHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textSecondary,
    marginTop: SPACING.xs,
  },
  apiUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.light.disabled,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.sm,
  },
  saveButton: {
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  fontButton: {
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  fontButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  dangerButton: {
    backgroundColor: COLORS.light.error,
    paddingVertical: SPACING.md,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  resetButton: {
    backgroundColor: COLORS.light.textSecondary,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textSecondary,
  },
});
