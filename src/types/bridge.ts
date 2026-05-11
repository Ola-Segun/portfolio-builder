// postMessage types — the contract between builder shell and preview iframe

import type {
  SectionConfig,
  SectionStyles,
  SectionBackground,
  ThemeConfig,
  LenisConfig,
  WebGLConfig,
  CursorConfig,
} from './portfolio';

export type BridgeMessage =
  // ── Section content ────────────────────────────────────────────────────────
  | { type: 'SECTION_UPDATE';     sectionId: string; data: SectionConfig }
  | { type: 'REORDER_SECTIONS';   order: string[] }
  | { type: 'SECTION_VISIBILITY'; sectionId: string; visible: boolean }
  /** Inject a new section into the preview — avoids full rewrite on add */
  | { type: 'SECTION_ADD';        section: import('./portfolio').Section; afterId: string | null }
  /** Remove a section from the preview DOM */
  | { type: 'SECTION_REMOVE';     sectionId: string }

  // ── Layout & Style ─────────────────────────────────────────────────────────
  | { type: 'SECTION_LAYOUT';   sectionId: string; layout: string; config: SectionConfig }
  | { type: 'SECTION_STYLES';   sectionId: string; styles: SectionStyles }
  | { type: 'SECTION_BACKGROUND'; sectionId: string; background: SectionBackground }

  // ── Theme & Typography ─────────────────────────────────────────────────────
  | { type: 'THEME_CHANGE';  theme: ThemeConfig }
  | { type: 'FONT_CHANGE';   heading: string; body: string; headingWeight?: number }

  // ── Animation ──────────────────────────────────────────────────────────────
  | { type: 'ANIMATION_SEEK';   sectionId: string; progress: number }
  | { type: 'ANIMATION_UPDATE'; sectionId: string; animation: import('./portfolio').SectionAnimation }

  // ── Systems ────────────────────────────────────────────────────────────────
  | { type: 'LENIS_CONFIG';   config: Partial<LenisConfig> }
  | { type: 'WEBGL_UNIFORM';  key: string; value: number | number[] }
  | { type: 'WEBGL_CONFIG';   config: Partial<WebGLConfig> }
  | { type: 'CURSOR_CONFIG';  config: Partial<CursorConfig> }
  | { type: 'VIEWPORT_RESIZE'; width: number }

  // ── In-place editing (preview → builder) ───────────────────────────────────
  /** Sent by preview when user clicks a data-editable element */
  | { type: 'ELEMENT_CLICKED';  sectionId: string; field: string }
  /** Sent by preview when contenteditable loses focus with new value */
  | { type: 'CONTENT_EDIT';     sectionId: string; field: string; value: string }

  // ── Full refresh (fallback) ────────────────────────────────────────────────
  | { type: 'FULL_REFRESH'; state: import('./portfolio').PortfolioStore }

  // ── Scroll control ────────────────────────────────────────────────────────
  /** Restore scroll after iframe rewrite — sent automatically by bridge */
  | { type: 'SCROLL_RESTORE'; scrollY: number }
  /** Smooth-scroll preview to a section by ID */
  | { type: 'SCROLL_TO_SECTION'; sectionId: string }

  // ── Handshake (preview → builder) ─────────────────────────────────────────
  | { type: 'PREVIEW_READY' };
