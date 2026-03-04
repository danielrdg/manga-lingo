---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md']
workflowType: 'architecture'
project_name: 'manga-reader'
user_name: 'Daniel'
date: '2026-03-04'
lastStep: 8
status: 'complete'
completedAt: '2026-03-04'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **File Import & Management (4 FRs)**: Suporte a PDF, CBZ/CBR, imagens (PNG/JPG); armazenamento local; biblioteca de mangás
- **Manga Reader (4 FRs)**: Modos de leitura (página/scroll vertical); zoom/pan; modo noturno; cache de páginas
- **Text Detection & OCR (3 FRs)**: Detecção automática de regiões de texto; OCR otimizado para fontes de quadrinhos; extração de bounding boxes
- **Translation Engine (3 FRs)**: Tradução EN→PT-BR; API de tradução baseada em AI/LLM; tradução context-aware
- **Text Replacement & Rendering (2 FRs)**: Overlay de texto traduzido; preservação de layout (alinhamento, tamanho, quebras de linha)

**Non-Functional Requirements:**
- **Performance**: Tradução de página em poucos segundos; navegação fluida após processamento inicial
- **Escalabilidade**: Arquitetura deve suportar múltiplos providers de AI
- **Usabilidade**: Configuração mínima; tradução automática por padrão
- **Offline**: Páginas traduzidas anteriormente acessíveis offline
- **Segurança**: Processamento local quando possível; disclosure se serviços cloud forem usados
- **Plataforma**: Android 8+; APK assinado para sideloading

**Scale & Complexity:**
- Primary domain: Mobile/Full-stack
- Complexity level: Média-Alta
- Estimated architectural components: 6-8 (Reader, File Manager, OCR Pipeline, Translation Service, Text Renderer, Cache Layer, Storage, UI)

### Technical Constraints & Dependencies

- Acurácia de OCR varia com qualidade de imagem e estilo de fonte
- Extração de fontes de PDFs nem sempre é possível
- Tradução em tempo real requer caching e processamento em background
- Gestão de memória crítica para imagens de alta resolução em dispositivos móveis

### Cross-Cutting Concerns Identified

- **Caching Strategy**: Cache de OCR, traduções, e páginas renderizadas
- **Memory Management**: Carregamento lazy de páginas, liberação de recursos
- **Error Handling**: Fallbacks para OCR/tradução com falha
- **Offline Sync**: Persistência de traduções para acesso offline
- **Provider Abstraction**: Interface comum para múltiplos serviços de tradução

## Starter Template Evaluation

### Primary Technology Domain

**Mobile App** - React Native com Expo para desenvolvimento simplificado

### User Technical Profile

- **Experiência mobile**: Iniciante
- **Preferência de framework**: React Native
- **Caso de uso**: App pessoal para namorada ler mangás traduzidos
- **Requisito de custo**: APIs gratuitas ou de baixo custo

### Starter Options Considerados

| Opção | Prós | Contras |
|-------|------|---------|
| **Expo (create-expo-app)** | Setup simplificado, OTA updates, builds na nuvem, ótimo para iniciantes | Algumas limitações com módulos nativos |
| React Native CLI | Controle total, acesso a módulos nativos | Setup complexo, requer Xcode/Android Studio |
| Ignite (Infinite Red) | Boilerplate completo, MobX-State-Tree | Curva de aprendizado maior, mais opinativo |

### Selected Starter: Expo com TypeScript

**Rationale:**
- Iniciante em mobile → Expo elimina complexidade de configuração nativa
- App pessoal → Não precisa de módulos nativos avançados
- Expo tem suporte a expo-camera e expo-file-system necessários
- Build de APK simplificado com EAS Build

**Initialization Command:**

```bash
npx create-expo-app@latest manga-reader --template expo-template-blank-typescript
```

### Architectural Decisions Provided by Starter

| Categoria | Decisão |
|-----------|---------|
| **Linguagem** | TypeScript |
| **Runtime** | React Native + Expo SDK |
| **Navegação** | Expo Router (a adicionar) |
| **Build** | EAS Build para APK Android |
| **Estado** | Zustand (recomendado - simples) |

### Recommended Technology Stack

| Componente | Tecnologia | Motivo |
|------------|------------|--------|
| **Framework** | Expo + React Native | Fácil para iniciantes |
| **OCR** | ML Kit (Google) | Gratuito, funciona offline |
| **Tradução** | LibreTranslate API | Open source, pode self-host grátis |
| **Storage** | expo-file-system + AsyncStorage | Nativo do Expo |
| **UI** | React Native Paper ou NativeWind | Componentes prontos |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Bloqueiam Implementação):**
- Framework: Expo + React Native + TypeScript ✅
- OCR: ML Kit (Google) ✅
- Tradução: LibreTranslate API ✅

**Important Decisions (Moldam Arquitetura):**
- Gerenciamento de estado: Zustand ✅
- Navegação: Expo Router ✅
- Leitura de arquivos: pdf-lib + jszip ✅

**Deferred Decisions (Pós-MVP):**
- Suporte a múltiplos idiomas de origem
- Sync entre dispositivos
- Sistema de correção manual de traduções

### Data Architecture

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **Storage local** | AsyncStorage + expo-file-system | Nativo do Expo, sem dependências extras |
| **Cache de traduções** | AsyncStorage (JSON) | Persiste traduções para acesso offline |
| **Cache de imagens** | Sistema de arquivos local | Páginas processadas salvas como imagens |
| **Estrutura de dados** | JSON por mangá | `{mangaId}/translations.json` com mapa página→traduções |

### Authentication & Security

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **Autenticação** | Não necessária (MVP) | App pessoal, sem backend próprio |
| **API Keys** | expo-secure-store | Armazena chave da API de tradução de forma segura |
| **Dados sensíveis** | Processamento local | OCR e imagens processados no dispositivo |

### API & Communication Patterns

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **Tradução API** | LibreTranslate (REST) | Open source, gratuito, pode self-host |
| **Fallback** | Cache local | Se API falhar, usa tradução cacheada |
| **Rate limiting** | Debounce de 500ms | Evita múltiplas chamadas durante navegação |

### Frontend Architecture

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **Estado global** | Zustand | Simples, poucas linhas, ótimo para iniciantes |
| **Navegação** | Expo Router | File-based routing, padrão Expo |
| **UI Components** | React Native Paper | Material Design, componentes prontos |
| **Renderização de páginas** | Image + View overlay | Imagem base + Views absolutas para texto |
| **Gestos** | react-native-gesture-handler | Zoom/pan nativo, já incluso no Expo |

### Infrastructure & Deployment

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **Build** | EAS Build | Gera APK assinado na nuvem |
| **Distribuição** | APK sideload | Instalação direta no Android |
| **CI/CD** | Não necessário (MVP) | Build manual via EAS |
| **Monitoramento** | Console.log + Expo DevTools | Debugging básico para desenvolvimento |

### Decision Impact Analysis

**Sequência de Implementação:**
1. Setup Expo + estrutura de navegação
2. Tela de biblioteca (importar mangás)
3. Leitor básico (visualizar páginas)
4. Pipeline OCR (ML Kit)
5. Integração tradução (LibreTranslate)
6. Overlay de texto traduzido
7. Cache e modo offline

## Implementation Patterns & Consistency Rules

### Naming Patterns

| Categoria | Padrão | Exemplo |
|-----------|--------|---------|
| **Arquivos de componente** | PascalCase | `MangaCard.tsx` |
| **Arquivos utilitários** | camelCase | `translationService.ts` |
| **Pastas** | kebab-case | `manga-reader/` |
| **Componentes** | PascalCase | `<MangaLibrary />` |
| **Funções** | camelCase | `translateText()` |
| **Variáveis** | camelCase | `currentPage` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_PAGE_CACHE` |
| **Tipos/Interfaces** | PascalCase com prefixo | `IManga`, `TTranslation` |

### Structure Patterns

```
manga-reader/
├── app/                    # Expo Router - telas (file-based routing)
│   ├── index.tsx          # Tela inicial (biblioteca)
│   ├── reader/[id].tsx    # Tela do leitor
│   └── settings.tsx       # Configurações
├── components/            # Componentes reutilizáveis
│   ├── MangaCard.tsx
│   ├── PageViewer.tsx
│   └── TranslatedText.tsx
├── services/              # Lógica de negócio
│   ├── ocr.ts            # ML Kit OCR
│   ├── translation.ts    # LibreTranslate API
│   └── fileManager.ts    # Importação PDF/CBZ
├── store/                 # Zustand stores
│   └── useMangaStore.ts
├── utils/                 # Funções auxiliares
│   └── formatters.ts
├── types/                 # TypeScript types
│   └── manga.ts
└── constants/             # Constantes globais
    └── config.ts
```

### Code Patterns

| Categoria | Padrão |
|-----------|--------|
| **Exportação** | Named exports (não default) |
| **Async** | async/await (não .then()) |
| **Estado local** | useState/useReducer |
| **Estado global** | Zustand store |
| **Estilo** | StyleSheet.create() |

### Error Handling Patterns

```typescript
// Estrutura padrão de erro
interface AppError {
  code: string;        // 'OCR_FAILED', 'TRANSLATION_ERROR'
  message: string;     // Mensagem amigável para usuário
  details?: unknown;   // Detalhes técnicos (para debug)
}

// Padrão de try-catch
try {
  const result = await translateText(text);
} catch (error) {
  showToast({ type: 'error', message: 'Falha na tradução' });
  console.error('[Translation]', error);
}
```

### Loading State Patterns

```typescript
// Zustand store pattern
interface MangaStore {
  isLoading: boolean;
  error: AppError | null;
  // ... dados
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
}
```

### Enforcement Guidelines

**Todos os desenvolvedores/agentes AI DEVEM:**
- Seguir os padrões de nomenclatura definidos acima
- Manter arquivos em suas pastas corretas conforme estrutura
- Usar named exports em vez de default exports
- Usar async/await para código assíncrono
- Tratar erros com a estrutura AppError padrão

## Project Structure & Boundaries

### Complete Project Directory Structure

```
manga-reader/
├── README.md
├── package.json
├── tsconfig.json
├── app.json                        # Expo config
├── eas.json                        # EAS Build config
├── babel.config.js
├── .env.example
├── .gitignore
│
├── app/                            # Expo Router (File-based routing)
│   ├── _layout.tsx                # Root layout + providers
│   ├── index.tsx                  # Tela inicial (Biblioteca)
│   ├── settings.tsx               # Configurações do app
│   └── reader/
│       └── [id].tsx               # Leitor de mangá (dinâmico)
│
├── components/                     # Componentes React
│   ├── library/
│   │   ├── MangaCard.tsx          # Card de mangá na biblioteca
│   │   ├── MangaGrid.tsx          # Grid de mangás
│   │   └── ImportButton.tsx       # Botão de importar arquivo
│   ├── reader/
│   │   ├── PageViewer.tsx         # Visualizador de página
│   │   ├── TranslatedOverlay.tsx  # Overlay de texto traduzido
│   │   ├── PageNavigation.tsx     # Navegação entre páginas
│   │   └── ZoomableImage.tsx      # Imagem com zoom/pan
│   └── common/
│       ├── LoadingSpinner.tsx     # Indicador de loading
│       ├── ErrorMessage.tsx       # Mensagem de erro
│       └── Toast.tsx              # Notificações toast
│
├── services/                       # Lógica de negócio
│   ├── ocr/
│   │   ├── mlkit.ts               # Integração ML Kit OCR
│   │   └── textDetection.ts       # Detecção de balões de fala
│   ├── translation/
│   │   ├── libreTranslate.ts      # API LibreTranslate
│   │   └── translationCache.ts    # Cache de traduções
│   ├── files/
│   │   ├── pdfExtractor.ts        # Extração de páginas PDF
│   │   ├── cbzExtractor.ts        # Extração de arquivos CBZ
│   │   └── imageLoader.ts         # Carregamento de imagens
│   └── storage/
│       ├── mangaStorage.ts        # CRUD de mangás
│       └── cacheManager.ts        # Gestão de cache
│
├── store/                          # Zustand stores
│   ├── useMangaStore.ts           # Estado da biblioteca
│   ├── useReaderStore.ts          # Estado do leitor
│   └── useSettingsStore.ts        # Configurações do usuário
│
├── types/                          # TypeScript types
│   ├── manga.ts                   # IManga, IPage, IChapter
│   ├── translation.ts             # ITranslation, ITextBlock
│   ├── ocr.ts                     # IOcrResult, IBoundingBox
│   └── settings.ts                # ISettings
│
├── utils/                          # Funções utilitárias
│   ├── formatters.ts              # Formatação de dados
│   ├── validators.ts              # Validações
│   └── errorHandler.ts            # Tratamento de erros
│
├── constants/                      # Constantes globais
│   ├── config.ts                  # Configurações do app
│   ├── theme.ts                   # Cores e estilos
│   └── api.ts                     # URLs de API
│
├── hooks/                          # Custom hooks
│   ├── useTranslation.ts          # Hook de tradução
│   ├── useOcr.ts                  # Hook de OCR
│   └── useFileImport.ts           # Hook de importação
│
└── assets/                         # Recursos estáticos
    ├── fonts/                     # Fontes customizadas
    └── images/                    # Imagens do app (icons, etc.)
```

### Requirements to Structure Mapping

| Requisito | Localização |
|-----------|-------------|
| **Importar mangá** | `services/files/` + `components/library/ImportButton.tsx` |
| **Biblioteca de mangás** | `app/index.tsx` + `components/library/` + `store/useMangaStore.ts` |
| **Leitor de páginas** | `app/reader/[id].tsx` + `components/reader/` |
| **OCR/Detecção de texto** | `services/ocr/` + `hooks/useOcr.ts` |
| **Tradução** | `services/translation/` + `hooks/useTranslation.ts` |
| **Overlay de texto** | `components/reader/TranslatedOverlay.tsx` |
| **Cache offline** | `services/storage/` + `services/translation/translationCache.ts` |

### Architectural Boundaries

| Camada | Responsabilidade | Comunicação |
|--------|------------------|-------------|
| **app/** | Rotas e telas | Consome components e stores |
| **components/** | UI apenas | Props + hooks |
| **services/** | Lógica de negócio | Chamados por hooks |
| **store/** | Estado global | Zustand actions |
| **hooks/** | Ponte entre UI e services | Retorna dados + funções |

### Data Flow

```
[Arquivo PDF/CBZ] 
    → services/files/pdfExtractor.ts 
    → [Imagens extraídas]
    → services/ocr/mlkit.ts 
    → [Texto detectado + bounding boxes]
    → services/translation/libreTranslate.ts 
    → [Texto traduzido]
    → components/reader/TranslatedOverlay.tsx 
    → [Renderização na tela]
```

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilidade de Decisões:**
| Tecnologia | Compatível com Stack | Status |
|------------|---------------------|--------|
| Expo SDK | React Native | ✅ |
| Expo Router | Expo SDK | ✅ |
| Zustand | React Native | ✅ |
| ML Kit OCR | Expo (via expo-dev-client) | ✅ |
| pdf-lib | JavaScript/TypeScript | ✅ |
| jszip | JavaScript/TypeScript | ✅ |
| LibreTranslate API | REST/fetch | ✅ |
| React Native Paper | React Native | ✅ |

**Consistência de Padrões:**
- ✅ Nomenclatura consistente (PascalCase componentes, camelCase funções)
- ✅ Estrutura de pastas segue padrões Expo recomendados
- ✅ Padrões de estado alinhados com Zustand

**Alinhamento de Estrutura:**
- ✅ Pastas mapeiam diretamente para responsabilidades
- ✅ Boundaries claros entre services/components/store

### Requirements Coverage Validation ✅

| Requisito (PRD) | Cobertura Arquitetural | Status |
|-----------------|------------------------|---------|
| Import PDF/CBZ/Images | `services/files/` | ✅ |
| Manga library view | `app/index.tsx` + `components/library/` | ✅ |
| Page-based reading | `components/reader/PageViewer.tsx` | ✅ |
| Zoom/Pan | `components/reader/ZoomableImage.tsx` | ✅ |
| Night mode | `store/useSettingsStore.ts` | ✅ |
| Text detection/OCR | `services/ocr/mlkit.ts` | ✅ |
| EN→PT-BR Translation | `services/translation/libreTranslate.ts` | ✅ |
| Text overlay | `components/reader/TranslatedOverlay.tsx` | ✅ |
| Offline cache | `services/storage/` + `translationCache.ts` | ✅ |
| Android APK build | EAS Build config | ✅ |

### Implementation Readiness ✅

| Critério | Status |
|----------|--------|
| Decisões críticas documentadas | ✅ |
| Versões de tecnologias verificadas | ✅ |
| Padrões de implementação definidos | ✅ |
| Estrutura de projeto completa | ✅ |
| Exemplos de código fornecidos | ✅ |

### Gap Analysis

| Gap | Prioridade | Resolução |
|-----|------------|------------|
| ML Kit precisa de `expo-dev-client` | Média | Documentar no setup |
| LibreTranslate pode ter limite de rate | Baixa | Cache agressivo implementado |
| Fontes para overlay podem variar | Baixa | Usar fonte padrão do sistema |

**Nenhum gap crítico** - arquitetura está pronta para implementação.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Contexto do projeto analisado
- [x] Complexidade avaliada (Média-Alta)
- [x] Restrições técnicas identificadas
- [x] Concerns transversais mapeados

**✅ Architectural Decisions**
- [x] Stack completa definida
- [x] Padrões de integração definidos
- [x] Performance considerada (cache, lazy loading)

**✅ Implementation Patterns**
- [x] Convenções de nomenclatura
- [x] Padrões de estrutura
- [x] Tratamento de erros
- [x] Gerenciamento de estado

**✅ Project Structure**
- [x] Estrutura de diretórios completa
- [x] Boundaries de componentes
- [x] Mapeamento requisitos→código

### Architecture Readiness Assessment

**Overall Status:** ✅ **PRONTO PARA IMPLEMENTAÇÃO**

**Nível de Confiança:** Alto

**Pontos Fortes:**
- Stack simples e moderna (Expo + React Native)
- Baixa curva de aprendizado para iniciantes
- Processamento offline-first
- Custo zero (APIs gratuitas)

**Áreas para Aprimoramento Futuro:**
- Suporte a múltiplos idiomas de origem
- Sync entre dispositivos
- Sistema de correção manual de traduções

### Implementation Handoff

**Diretrizes para Agentes AI:**
- Seguir todas as decisões arquiteturais exatamente como documentado
- Usar padrões de implementação consistentemente em todos componentes
- Respeitar estrutura do projeto e boundaries
- Consultar este documento para todas questões arquiteturais

**Primeiro Comando de Implementação:**
```bash
npx create-expo-app@latest manga-reader --template expo-template-blank-typescript
```

