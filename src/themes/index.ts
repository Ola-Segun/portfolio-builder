import type { ThemeConfig } from '../types/portfolio';

// ─────────────────────────────────────────────────────────────────────────────
// Dark Editorial
// Sharp, high-contrast, editorial magazine feel.
// Buttons: uppercase outline / ghost. Cards: sharp corners, hairline borders.
// ─────────────────────────────────────────────────────────────────────────────
export const darkEditorialTheme: ThemeConfig = {
  id: 'dark-editorial',
  name: 'Dark Editorial',
  style: 'editorial',
  darkMode: true,
  colors: {
    background: '#0a0a0a',
    surface: '#111111',
    text: '#f0ede8',
    textMuted: '#6b6860',
    accent: '#c8b97a',
    accentMuted: '#3a3428',
    border: '#1e1e1e',
  },
  components: {
    button: {
      radius: '0px',
      variant: 'outline',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '0.9rem 2.2rem',
      fontSize: '0.72rem',
      fontWeight: 500,
      shadow: 'none',
    },
    card: {
      radius: '0px',
      shadow: 'none',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: 'none',
      padding: '2rem',
    },
    tag: {
      radius: '0px',
      padding: '0.3rem 0.75rem',
      fontSize: '0.65rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      border: '1px solid var(--border)',
      background: 'transparent',
      color: 'var(--text-muted)',
    },
    surface: {
      blur: '0px',
      opacity: '1',
      backdropFilter: 'none',
    },
    heading: {
      letterSpacing: '-0.04em',
      lineHeight: '0.95',
      textTransform: 'none',
      fontStyle: 'normal',
    },
    divider: {
      style: 'solid',
      opacity: '0.18',
      thickness: '1px',
    },
    input: {
      radius: '0px',
      border: '1px solid var(--border)',
      background: 'transparent',
      focusBorder: '1px solid var(--accent)',
      padding: '0.9rem 1rem',
    },
    image: {
      radius: '0px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: '1px solid var(--border)',
      shadow: 'none',
      filter: 'grayscale(20%) contrast(1.05)',
      hoverFilter: 'grayscale(0%)',
      hoverTransform: 'scale(1.02)',
      transition: '0.5s ease',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stark Minimal
// Pure white, hairlines, generous whitespace.
// Buttons: ghost with thin border. Cards: borderless with shadow on hover.
// ─────────────────────────────────────────────────────────────────────────────
export const starkMinimalTheme: ThemeConfig = {
  id: 'stark-minimal',
  name: 'Stark Minimal',
  style: 'minimal',
  darkMode: false,
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#111111',
    textMuted: '#6b6b6b',
    accent: '#000000',
    accentMuted: '#d4d4d4',
    border: '#e5e5e5',
  },
  components: {
    button: {
      radius: '2px',
      variant: 'outline',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '0.85rem 2rem',
      fontSize: '0.75rem',
      fontWeight: 500,
      shadow: 'none',
    },
    card: {
      radius: '4px',
      shadow: 'none',
      border: '1px solid var(--border)',
      background: '#ffffff',
      hoverTransform: 'none',
      hoverShadow: '0 4px 24px rgba(0,0,0,0.06)',
      padding: '1.75rem',
    },
    tag: {
      radius: '2px',
      padding: '0.25rem 0.65rem',
      fontSize: '0.68rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      border: '1px solid var(--border)',
      background: 'transparent',
      color: 'var(--text-muted)',
    },
    surface: {
      blur: '0px',
      opacity: '1',
      backdropFilter: 'none',
    },
    heading: {
      letterSpacing: '-0.03em',
      lineHeight: '1.05',
      textTransform: 'none',
      fontStyle: 'normal',
    },
    divider: {
      style: 'solid',
      opacity: '1',
      thickness: '1px',
    },
    input: {
      radius: '2px',
      border: '1px solid var(--border)',
      background: '#ffffff',
      focusBorder: '1px solid var(--text)',
      padding: '0.85rem 1rem',
    },
    image: {
      radius: '0px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: 'none',
      shadow: 'none',
      filter: 'none',
      hoverFilter: 'none',
      hoverTransform: 'none',
      transition: '0.35s ease',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Expressive Type
// Warm off-white, hot pink accent, rounded playfulness.
// Buttons: filled pill with bold weight. Cards: rounded with subtle warm shadow.
// ─────────────────────────────────────────────────────────────────────────────
export const expressiveTypeTheme: ThemeConfig = {
  id: 'expressive-type',
  name: 'Expressive Type',
  style: 'expressive',
  darkMode: false,
  colors: {
    background: '#f5f0e6',
    surface: '#ece5d5',
    text: '#1a1a1a',
    textMuted: '#6b6355',
    accent: '#ff3366',
    accentMuted: '#ffe0e9',
    border: '#d9d0c0',
  },
  components: {
    button: {
      radius: '999px',
      variant: 'pill',
      letterSpacing: '0.02em',
      textTransform: 'none',
      padding: '1rem 2.4rem',
      fontSize: '0.9rem',
      fontWeight: 700,
      shadow: '0 8px 24px rgba(255,51,102,0.3)',
    },
    card: {
      radius: '20px',
      shadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: 'none',
      background: '#ffffff',
      hoverTransform: 'translateY(-6px) rotate(-0.5deg)',
      hoverShadow: '0 16px 40px rgba(0,0,0,0.12)',
      padding: '2rem',
    },
    tag: {
      radius: '999px',
      padding: '0.3rem 0.9rem',
      fontSize: '0.72rem',
      letterSpacing: '0.04em',
      textTransform: 'none',
      border: 'none',
      background: 'var(--accent-muted)',
      color: 'var(--accent)',
    },
    surface: {
      blur: '16px',
      opacity: '0.85',
      backdropFilter: 'blur(16px) saturate(1.4)',
    },
    heading: {
      letterSpacing: '-0.02em',
      lineHeight: '1.0',
      textTransform: 'none',
      fontStyle: 'italic',
    },
    divider: {
      style: 'dashed',
      opacity: '0.4',
      thickness: '1px',
    },
    input: {
      radius: '12px',
      border: '2px solid var(--border)',
      background: '#ffffff',
      focusBorder: '2px solid var(--accent)',
      padding: '0.9rem 1.2rem',
    },
    image: {
      radius: '16px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: 'none',
      shadow: '0 8px 24px rgba(0,0,0,0.1)',
      filter: 'saturate(1.1)',
      hoverFilter: 'saturate(1.3) brightness(1.05)',
      hoverTransform: 'scale(1.03) rotate(-0.5deg)',
      transition: '0.45s cubic-bezier(0.34,1.56,0.64,1)',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Soft Product
// Light SaaS / product portfolio, indigo accent, clean cards.
// Buttons: filled rounded. Cards: soft shadow, rounded.
// ─────────────────────────────────────────────────────────────────────────────
export const softProductTheme: ThemeConfig = {
  id: 'soft-product',
  name: 'Soft Product',
  style: 'product',
  darkMode: false,
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    accent: '#4f46e5',
    accentMuted: '#e0e7ff',
    border: '#e2e8f0',
  },
  components: {
    button: {
      radius: '8px',
      variant: 'fill',
      letterSpacing: '0.01em',
      textTransform: 'none',
      padding: '0.85rem 1.75rem',
      fontSize: '0.9rem',
      fontWeight: 600,
      shadow: '0 4px 14px rgba(79,70,229,0.35)',
    },
    card: {
      radius: '12px',
      shadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid var(--border)',
      background: '#ffffff',
      hoverTransform: 'translateY(-3px)',
      hoverShadow: '0 8px 32px rgba(0,0,0,0.1)',
      padding: '1.5rem',
    },
    tag: {
      radius: '6px',
      padding: '0.25rem 0.65rem',
      fontSize: '0.72rem',
      letterSpacing: '0.02em',
      textTransform: 'none',
      border: 'none',
      background: 'var(--accent-muted)',
      color: 'var(--accent)',
    },
    surface: {
      blur: '12px',
      opacity: '0.9',
      backdropFilter: 'blur(12px)',
    },
    heading: {
      letterSpacing: '-0.02em',
      lineHeight: '1.15',
      textTransform: 'none',
      fontStyle: 'normal',
    },
    divider: {
      style: 'solid',
      opacity: '1',
      thickness: '1px',
    },
    input: {
      radius: '8px',
      border: '1px solid var(--border)',
      background: '#ffffff',
      focusBorder: '2px solid var(--accent)',
      padding: '0.75rem 1rem',
    },
    image: {
      radius: '12px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: '1px solid var(--border)',
      shadow: '0 2px 12px rgba(0,0,0,0.06)',
      filter: 'none',
      hoverFilter: 'brightness(1.03)',
      hoverTransform: 'scale(1.015)',
      transition: '0.3s ease',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Night Neon
// Dark cyber, violet glow, glassy surfaces.
// Buttons: glowing outline. Cards: glass with blur + glow border.
// ─────────────────────────────────────────────────────────────────────────────
export const nightNeonTheme: ThemeConfig = {
  id: 'night-neon',
  name: 'Night Neon',
  style: 'neon',
  darkMode: true,
  colors: {
    background: '#0d0d14',
    surface: '#13131f',
    text: '#e8e8f8',
    textMuted: '#6b6b8a',
    accent: '#7c3aed',
    accentMuted: '#1e1030',
    border: '#1e1e30',
  },
  components: {
    button: {
      radius: '6px',
      variant: 'outline',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '0.9rem 2rem',
      fontSize: '0.78rem',
      fontWeight: 500,
      shadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(124,58,237,0.2)',
    },
    card: {
      radius: '10px',
      shadow: '0 0 0 1px rgba(124,58,237,0.15)',
      border: '1px solid rgba(124,58,237,0.2)',
      background: 'rgba(19,19,31,0.7)',
      hoverTransform: 'translateY(-4px)',
      hoverShadow: '0 0 0 1px rgba(124,58,237,0.4), 0 8px 32px rgba(124,58,237,0.2)',
      padding: '1.75rem',
    },
    tag: {
      radius: '4px',
      padding: '0.25rem 0.7rem',
      fontSize: '0.7rem',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      border: '1px solid rgba(124,58,237,0.3)',
      background: 'rgba(124,58,237,0.1)',
      color: '#a78bfa',
    },
    surface: {
      blur: '20px',
      opacity: '0.75',
      backdropFilter: 'blur(20px) saturate(1.2)',
    },
    heading: {
      letterSpacing: '-0.02em',
      lineHeight: '1.05',
      textTransform: 'none',
      fontStyle: 'normal',
    },
    divider: {
      style: 'solid',
      opacity: '0.15',
      thickness: '1px',
    },
    input: {
      radius: '6px',
      border: '1px solid rgba(124,58,237,0.25)',
      background: 'rgba(19,19,31,0.5)',
      focusBorder: '1px solid var(--accent)',
      padding: '0.85rem 1rem',
    },
    image: {
      radius: '8px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: '1px solid rgba(124,58,237,0.25)',
      shadow: '0 0 20px rgba(124,58,237,0.15)',
      filter: 'saturate(0.9) brightness(0.9)',
      hoverFilter: 'saturate(1.1) brightness(1.0)',
      hoverTransform: 'scale(1.02)',
      transition: '0.4s ease',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Deep Forest
// Dark organic, green accent, earthy warmth.
// Buttons: soft rounded fill. Cards: earthy border, gentle shadow.
// ─────────────────────────────────────────────────────────────────────────────
export const deepForestTheme: ThemeConfig = {
  id: 'deep-forest',
  name: 'Deep Forest',
  style: 'nature',
  darkMode: true,
  colors: {
    background: '#0b120e',
    surface: '#111a14',
    text: '#dde8e0',
    textMuted: '#5a7a62',
    accent: '#38c96a',
    accentMuted: '#0e2416',
    border: '#162119',
  },
  components: {
    button: {
      radius: '6px',
      variant: 'fill',
      letterSpacing: '0.03em',
      textTransform: 'none',
      padding: '0.9rem 2rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      shadow: '0 4px 20px rgba(56,201,106,0.3)',
    },
    card: {
      radius: '8px',
      shadow: 'none',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      hoverTransform: 'translateY(-3px)',
      hoverShadow: '0 8px 30px rgba(56,201,106,0.1)',
      padding: '1.75rem',
    },
    tag: {
      radius: '4px',
      padding: '0.28rem 0.7rem',
      fontSize: '0.7rem',
      letterSpacing: '0.05em',
      textTransform: 'none',
      border: 'none',
      background: 'var(--accent-muted)',
      color: 'var(--accent)',
    },
    surface: {
      blur: '8px',
      opacity: '0.85',
      backdropFilter: 'blur(8px)',
    },
    heading: {
      letterSpacing: '-0.02em',
      lineHeight: '1.1',
      textTransform: 'none',
      fontStyle: 'normal',
    },
    divider: {
      style: 'solid',
      opacity: '0.2',
      thickness: '1px',
    },
    input: {
      radius: '6px',
      border: '1px solid var(--border)',
      background: 'rgba(17,26,20,0.6)',
      focusBorder: '1px solid var(--accent)',
      padding: '0.85rem 1rem',
    },
    image: {
      radius: '6px',
      objectFit: 'cover',
      aspectRatio: 'auto',
      border: '1px solid var(--border)',
      shadow: 'none',
      filter: 'sepia(15%) brightness(0.92)',
      hoverFilter: 'sepia(0%) brightness(1.0)',
      hoverTransform: 'scale(1.02)',
      transition: '0.4s ease',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
export const THEME_PRESETS: ThemeConfig[] = [
  darkEditorialTheme,
  nightNeonTheme,
  deepForestTheme,
  starkMinimalTheme,
  expressiveTypeTheme,
  softProductTheme,
];
