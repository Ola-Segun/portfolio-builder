// Theme type definitions

export type ThemePreset = 'dark-editorial' | 'stark-minimal' | 'expressive-type' | 'soft-product';

export interface ThemeDefinition {
  id: string;
  name: string;
  darkMode: boolean;
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    accentMuted: string;
    border: string;
  };
}
