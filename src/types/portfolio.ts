// Core portfolio state that lives in the Zustand store and is mirrored to the preview iframe

export interface PortfolioStore {
  meta: MetaData;
  sections: Section[];
  theme: ThemeConfig;
  typography: TypographyConfig;
  animation: AnimationConfig;
  webgl: WebGLConfig;
  cursor: CursorConfig;
}

// ─── Meta ────────────────────────────────────────────────────────────────────

export interface MetaData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  socials: SocialLink[];
  /** SEO & OG */
  description?: string;
  ogImage?: string;
  favicon?: string;
}

export interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'instagram' | 'website';
  url: string;
}

// ─── Section ─────────────────────────────────────────────────────────────────

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;

  /** Active layout variant for this section */
  layout: string;

  /**
   * Non-destructive layout configs — every variant's data is stored here.
   * Key = layout variant id (e.g. 'default', 'centered', 'split').
   * Switching layout never erases another variant's data.
   */
  layoutConfigs: Record<string, SectionConfig>;

  /** Convenience accessor (computed from layoutConfigs[layout]) — kept for backward compat */
  config: SectionConfig;

  animation: SectionAnimation;

  /** Per-section visual overrides */
  styles: SectionStyles;

  /** Per-section background (overrides global theme bg) */
  background: SectionBackground;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'work'
  | 'skills'
  | 'process'
  | 'contact'
  | 'custom';

// ─── Section Configs (per type) ───────────────────────────────────────────────

export interface SectionConfig {
  [key: string]: unknown;
}

export interface HeroSectionConfig extends SectionConfig {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  showArrow: boolean;
  /** Split layout: right-side image */
  imageUrl?: string;
  imageAlt?: string;
  /** Centered layout: eyebrow label above heading */
  eyebrow?: string;
}

export interface AboutSectionConfig extends SectionConfig {
  name: string;
  bio: string;
  imageUrl: string;
  imageAlt: string;
  /** text-only layout: pull-quote text */
  quote?: string;
  /** extra stats for grid layouts */
  stats?: Array<{ label: string; value: string }>;
}

export interface WorkSectionConfig extends SectionConfig {
  projects: Project[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
  /** Optional: year, role for grid layout cards */
  year?: string;
  role?: string;
}

export interface SkillsSectionConfig extends SectionConfig {
  skills: SkillCategory[];
  /** Used in progress-bar layout */
  showLevels?: boolean;
}

export interface SkillCategory {
  title: string;
  items: string[];
  /** 0–100 for progress-bar layout */
  level?: number;
}

export interface ProcessSectionConfig extends SectionConfig {
  steps: ProcessStep[];
  /** 'numbered' | 'timeline' layout hint */
  style?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

export interface ContactSectionConfig extends SectionConfig {
  heading: string;
  email: string;
  socials: SocialLink[];
  /** form layout additions */
  showForm?: boolean;
  bodyText?: string;
}

export interface CustomSectionConfig extends SectionConfig {
  html: string;
  css: string;
}

// ─── Animation ───────────────────────────────────────────────────────────────

export interface SectionAnimation {
  preset: AnimationPreset;
  duration: number;
  stagger: number;
  delay: number;
  ease: string;
  scrollTrigger: {
    start: string;
    end: string;
    scrub: boolean | number;
    pin: boolean;
  };
}

export type AnimationPreset =
  | 'char-rise'
  | 'clip-reveal'
  | 'fade-up'
  | 'scale-in'
  | 'wipe-right'
  | 'none';

// ─── Section Styles ───────────────────────────────────────────────────────────

export interface SectionStyles {
  /** Top padding override (CSS value e.g. '8vw', '4rem') */
  paddingTop?: string;
  /** Bottom padding override */
  paddingBottom?: string;
  /** Content max-width — 'full' means 100vw */
  maxWidth?: string;
  /** Text alignment within section */
  textAlign?: 'left' | 'center' | 'right';
  /** Content vertical alignment */
  contentAlign?: 'start' | 'center' | 'end';
  /** Arbitrary CSS class tokens (for future theming) */
  className?: string;
}

// ─── Section Background ───────────────────────────────────────────────────────

export type BackgroundType = 'inherit' | 'solid' | 'gradient' | 'image' | 'mesh';

export interface SectionBackground {
  type: BackgroundType;
  /** Used by 'solid' */
  color?: string;
  opacity?: number;
  /** Used by 'gradient' */
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  /** Used by 'image' */
  imageUrl?: string;
  imageSize?: 'cover' | 'contain' | 'auto';
  imagePosition?: string;
  /** Used by 'mesh' — preset name */
  meshPreset?: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

/** Discriminates the overall design personality — used for conditional CSS */
export type ThemeStyle =
  | 'editorial'   // dark, high-contrast, serif/display, sharp cuts
  | 'minimal'     // ultra-clean, lots of space, hairline borders
  | 'expressive'  // bold color, rounded, playful
  | 'product'     // clean, indigo-flavored, SaaS feel
  | 'neon'        // dark with glowing accent
  | 'nature';     // organic, muted, earthy

export interface ThemeConfig {
  id: string;
  name: string;
  darkMode: boolean;
  /** Visual personality — drives component style variants */
  style?: ThemeStyle;
  colors: ThemeColors;
  /** Component-level design tokens */
  components?: ThemeComponents;
}

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  accentMuted: string;
  border: string;
}

/**
 * Component design tokens.
 * Every field is optional — missing values fall back to sensible defaults
 * derived from the colors, so legacy themes stay fully compatible.
 */
export interface ThemeComponents {
  /** ── Buttons ─────────────────────────────────────────────────── */
  button?: {
    /** Border radius of the primary CTA button */
    radius?: string;
    /** 'fill' | 'outline' | 'ghost' | 'pill' */
    variant?: 'fill' | 'outline' | 'ghost' | 'pill';
    /** Letter spacing for button labels */
    letterSpacing?: string;
    /** text-transform for labels */
    textTransform?: string;
    /** Box shadow on hover */
    shadow?: string;
    /** Padding (shorthand) */
    padding?: string;
    /** Font size */
    fontSize?: string;
    /** Font weight */
    fontWeight?: string | number;
  };

  /** ── Cards ──────────────────────────────────────────────────── */
  card?: {
    radius?: string;
    shadow?: string;
    border?: string;
    /** Background — defaults to var(--surface) */
    background?: string;
    /** Hover transform e.g. 'translateY(-4px)' */
    hoverTransform?: string;
    /** Hover shadow override */
    hoverShadow?: string;
    /** Inner padding */
    padding?: string;
  };

  /** ── Tags / Badges ──────────────────────────────────────────── */
  tag?: {
    radius?: string;
    padding?: string;
    fontSize?: string;
    letterSpacing?: string;
    textTransform?: string;
    border?: string;
    background?: string;
    color?: string;
  };

  /** ── Surface / Glass ────────────────────────────────────────── */
  surface?: {
    blur?: string;
    opacity?: string;
    /** CSS backdrop-filter value */
    backdropFilter?: string;
  };

  /** ── Headings / Display type ────────────────────────────────── */
  heading?: {
    letterSpacing?: string;
    lineHeight?: string;
    textTransform?: string;
    /** 'normal' | 'italic' */
    fontStyle?: string;
  };

  /** ── Dividers / HR ──────────────────────────────────────────── */
  divider?: {
    style?: string;   // CSS border-style e.g. 'solid' | 'dashed' | 'dotted'
    opacity?: string;
    thickness?: string;
  };

  /** ── Input / Form fields ────────────────────────────────────── */
  input?: {
    radius?: string;
    border?: string;
    background?: string;
    focusBorder?: string;
    padding?: string;
  };

  /** ── Images / Media ─────────────────────────────────────────── */
  image?: {
    /** Border radius — 0px for sharp, 8px for soft, 50% for circle */
    radius?: string;
    /** CSS object-fit — 'cover' | 'contain' | 'fill' */
    objectFit?: string;
    /** Default aspect ratio — '16/9' | '4/3' | '1/1' | '3/4' */
    aspectRatio?: string;
    /** Border e.g. '1px solid var(--border)' or 'none' */
    border?: string;
    /** Box shadow */
    shadow?: string;
    /** CSS filter — 'none' | 'grayscale(100%)' | 'saturate(1.3)' etc. */
    filter?: string;
    /** Hover filter override */
    hoverFilter?: string;
    /** Hover transform on image wrapper hover */
    hoverTransform?: string;
    /** Transition duration e.g. '0.4s' */
    transition?: string;
  };
}

// ─── Typography ──────────────────────────────────────────────────────────────

export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  baseSize: number;       // rem
  lineHeight: number;
  letterSpacing: number;  // em
}

// ─── Animation Config ─────────────────────────────────────────────────────────

export interface AnimationConfig {
  globalDuration: number;
  reducedMotion: boolean;
  lenis: LenisConfig;
}

export interface LenisConfig {
  lerp: number;
  smoothWheel: boolean;
  wheelMultiplier: number;
}

// ─── WebGL ───────────────────────────────────────────────────────────────────

export interface WebGLConfig {
  enabled: boolean;
  type: 'distort-mesh' | 'particles' | 'abstract-3d' | 'none';
  uniforms: Record<string, number | number[]>;
  opacity: number;
}

// ─── Cursor ──────────────────────────────────────────────────────────────────

export interface CursorConfig {
  enabled: boolean;
  innerSize: number;
  outerSize: number;
  lerpOuter: number;
  blendMode: string;
}

// ─── Layout Registry Types ────────────────────────────────────────────────────

/** Metadata for a layout variant shown in the inspector picker */
export interface LayoutVariantMeta {
  id: string;
  label: string;
  description: string;
  /** SVG path data for a schematic thumbnail */
  thumbnail: string;
}
