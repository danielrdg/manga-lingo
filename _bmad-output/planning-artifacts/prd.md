# Product Requirements Document (PRD)

## 1. Overview

The goal of this product is to develop a cross-platform application (tablet and mobile) capable of opening digital manga files (PDF, CBZ, CBR, or image formats) originally written in English and automatically translating all textual content into Brazilian Portuguese (PT-BR). The system must preserve the original layout as much as possible, including speech balloons, font style, font size, and text positioning.

The key differentiator is **real-time translation directly over the manga pages**, allowing a seamless reading experience without manual export or preprocessing.

## 2. Product Objectives

* Enable users to read foreign-language manga translated into PT-BR.
* Minimize friction between reading and translation through automation.
* Preserve the original visual and artistic experience of the manga.
* Operate responsively on tablets and mobile devices.

## 3. Target Audience

* Manga readers who consume English-language content.
* Mobile and tablet users who prefer digital or offline-friendly reading.
* Users with basic technical literacy but limited English proficiency.

## 4. Key Use Cases

1. User imports a manga file (PDF or CBZ).
2. User opens the manga inside the application.
3. The system automatically detects speech balloons and text areas.
4. Text is extracted using OCR.
5. Extracted English text is translated into PT-BR using AI.
6. Translated text is rendered in the same position as the original text, preserving font size and style as closely as possible.
7. User navigates through translated pages in real time.

## 5. Functional Requirements

### 5.1 File Import and Management

* Supported formats:

  * PDF
  * CBZ / CBR
  * Image files (PNG, JPG)
* Local file storage on device
* Manga library view

### 5.2 Manga Reader

* Page-based or vertical scrolling reading modes
* Pinch-to-zoom and pan
* Night mode / dark background
* Page caching for smooth navigation

### 5.3 Text Detection and OCR

* Automatic detection of text regions (speech balloons, narration boxes)
* OCR optimized for English comic-style fonts
* Bounding box extraction for each text region

### 5.4 Translation Engine

* English → PT-BR translation
* AI-based translation (LLM or neural translation API)
* Context-aware translation (per page or per panel)

### 5.5 Text Replacement and Rendering

* Overlay translated text on top of original text
* Preserve:

  * Text alignment
  * Approximate font size
  * Line breaks
* Font substitution strategy when original font is unavailable
* Optional toggle between original and translated text

## 6. Non-Functional Requirements

* Performance:

  * Page translation should complete within a few seconds
  * Smooth page navigation after initial processing

* Scalability:

  * Architecture should support multiple AI providers

* Usability:

  * Minimal configuration required
  * Translation happens automatically by default

* Offline Support:

  * Previously translated pages accessible offline

* Security:

  * Files processed locally when possible
  * Clear disclosure if cloud-based AI services are used

* Platform & Distribution:

  * The application must support **Android tablets and mobile devices** as a first-class platform.
  * The build process must generate a **signed Android APK** suitable for manual installation (sideloading) on Android devices.
  * The APK must be compatible with modern Android versions (Android 8+).
  * The architecture should allow future migration to Google Play Store distribution, but Play Store publication is **not required for MVP**.

## 7. Technical Constraints and Considerations

* OCR accuracy may vary depending on image quality and font style
* Font extraction from PDFs may not always be possible
* Real-time translation may require caching and background processing

## 8. Suggested Technology Stack (Exploratory)

### Frontend (Mobile / Tablet)

* Flutter or React Native
* Canvas-based rendering for precise text overlays

### Backend / Processing Layer

* Local processing preferred where feasible

* OCR:

  * Tesseract OCR
  * ML-based text detection (e.g., EAST / CRAFT models)

* Translation:

  * OpenAI-compatible LLM API
  * Alternative neural translation APIs

### Storage

* Local database (SQLite)
* File system storage for manga assets

## 9. MVP Scope

* Import PDF manga
* Detect and translate English text to PT-BR
* Render translated text over original pages
* Basic reader navigation

## 10. Future Enhancements

* Support for additional source languages
* Manual text correction by user
* Font style learning per manga
* Cloud sync across devices

## 11. Success Metrics

* Translation accuracy (user feedback)
* Average page translation time
* User retention and reading completion rate

---

This PRD is intended to be used as input for BMAD-driven development workflows and AI-assisted code generation using VS Code Copilot.
