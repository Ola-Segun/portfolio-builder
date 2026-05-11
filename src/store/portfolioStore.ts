import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { PortfolioStore, SectionConfig, ThemeConfig, SectionAnimation, MetaData, Section, HeroSectionConfig, AboutSectionConfig, WorkSectionConfig, SkillsSectionConfig, ContactSectionConfig, CustomSectionConfig, ProcessSectionConfig, LenisConfig, WebGLConfig, CursorConfig } from '../types/portfolio';
import { darkEditorialTheme } from '../themes';

// Import bridge (for incremental updates only, NOT full rewrites)
import { bridge } from '../preview/PreviewBridge';
// Import uiStore lazily to avoid circular init
import { useUIStore } from './uiStore';

// --- Default data ---

const defaultMeta: MetaData = {
  name: 'Dev Portfolio',
  title: 'Full-Stack Developer',
  tagline: 'Building digital experiences that matter',
  email: 'hello@example.com',
  socials: [
    { platform: 'github', url: 'https://github.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
  ],
};

// Default theme is always the canonical preset — imported from single source of truth
const defaultTheme: ThemeConfig = { ...darkEditorialTheme };

const defaultTypography = {
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  headingWeight: 400,
  baseSize: 1.0,
  lineHeight: 1.6,
  letterSpacing: 0,
};

const defaultAnimation = {
  globalDuration: 1.0,
  reducedMotion: false,
  lenis: {
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1.0,
  },
};

const defaultWebGL: WebGLConfig = {
  enabled: true,
  type: 'distort-mesh',
  uniforms: {
    uDistortion: 0.3,
    uOpacity: 0.8,
  },
  opacity: 0.8,
};

const defaultCursor = {
  enabled: false,
  innerSize: 8,
  outerSize: 24,
  lerpOuter: 0.15,
  blendMode: 'difference',
};

// --- Helpers ---

function getDefaultConfigForType(type: Section['type']): SectionConfig {
  switch (type) {
    case 'hero':
      return {
        heading: 'Your Name',
        subheading: 'Designer & Developer crafting premium digital experiences',
        ctaText: 'See my work',
        ctaLink: '#work',
        showArrow: true,
      } as HeroSectionConfig;
    case 'about':
      return {
        name: 'Your Name',
        bio: 'I\'m a multidisciplinary designer and developer with a passion for crafting interfaces that feel both beautiful and effortless. I bridge the gap between design precision and engineering rigor.',
        imageUrl: '',
        imageAlt: 'Profile photo',
      } as AboutSectionConfig;
    case 'work':
      return {
        projects: [
          {
            id: `proj-${Date.now()}-1`,
            title: 'Project Alpha',
            description: 'A full-stack platform that reduced onboarding time by 60% through intelligent UX flows and real-time collaboration features.',
            imageUrl: '',
            link: 'https://example.com',
            tags: ['React', 'TypeScript', 'Node.js'],
          },
          {
            id: `proj-${Date.now()}-2`,
            title: 'Project Beta',
            description: 'An award-winning design system used by 40+ product teams, featuring 200+ components with comprehensive accessibility support.',
            imageUrl: '',
            link: 'https://example.com',
            tags: ['Figma', 'Storybook', 'GSAP'],
          },
        ],
      } as WorkSectionConfig;
    case 'skills':
      return {
        skills: [
          { title: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'GSAP', 'Three.js', 'CSS/Tailwind'] },
          { title: 'Backend', items: ['Node.js', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'] },
          { title: 'Tools & Process', items: ['Figma', 'Git', 'Docker', 'Vite', 'Storybook'] },
        ],
      } as SkillsSectionConfig;
    case 'process':
      return {
        steps: [
          { title: 'Discovery', description: 'Deep-dive into your goals, constraints, and audience. We map user journeys and define measurable success criteria before a single pixel is placed.' },
          { title: 'Design', description: 'From rapid wireframes to high-fidelity prototypes, every decision is grounded in research. Motion and interaction are designed alongside the interface, not bolted on after.' },
          { title: 'Build', description: 'Production-quality code from day one. Accessible, performant, and tested — shipped in tight iterations with continuous stakeholder feedback.' },
        ],
      } as ProcessSectionConfig;
    case 'contact':
      return { heading: "Let's work together", email: 'hello@example.com', socials: [] } as ContactSectionConfig;
    case 'custom':
      return { html: '', css: '' } as CustomSectionConfig;
    default:
      return {};
  }
}

function getDefaultAnimation(): SectionAnimation {
  return {
    preset: 'fade-up',
    duration: 0.8,
    stagger: 0.1,
    delay: 0,
    ease: 'power3.out',
    scrollTrigger: { start: 'top 80%', end: 'bottom 20%', scrub: false, pin: false },
  };
}

// --- History helpers ---

function cloneState(state: PortfolioStore): PortfolioStore {
  const cloned: any = {
    meta: { ...state.meta, socials: [...state.meta.socials] },
    sections: state.sections.map(s => ({
      ...s,
      config: { ...s.config },
      // Deep-clone every layout variant's config (non-destructive layout system)
      layoutConfigs: s.layoutConfigs
        ? Object.fromEntries(Object.entries(s.layoutConfigs).map(([k, v]) => [k, { ...(v as object) }]))
        : {},
      background: { ...(s.background || { type: 'inherit' }) },
      animation: { ...s.animation, scrollTrigger: { ...s.animation.scrollTrigger } },
      styles: { ...s.styles },
    })),
    theme: {
        ...state.theme,
        colors: { ...state.theme.colors },
        components: state.theme.components
          ? JSON.parse(JSON.stringify(state.theme.components))
          : undefined,
      },
    typography: { ...state.typography },
    animation: {
      ...state.animation,
      lenis: { ...state.animation.lenis },
    },
    webgl: { ...state.webgl, uniforms: { ...state.webgl.uniforms } },
    cursor: { ...state.cursor },
  };
  return cloned as PortfolioStore;
}

// --- Store ---

type StoreActions = {
  // Meta
  updateMeta: (updater: Partial<MetaData>) => void;
  // Sections
  addSection: (type: Section['type'], index?: number) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updateSectionConfig: (id: string, config: Partial<SectionConfig>) => void;
  updateSectionAnimation:   (id: string, animation: Partial<SectionAnimation>) => void;
  updateSectionStyles:      (id: string, styles: Partial<Section['styles']>) => void;
  updateSectionBackground:  (id: string, bg: Partial<Section['background']>) => void;
  updateSectionLayout:      (id: string, layout: string) => void;
  toggleSectionVisibility:  (id: string) => void;
  reorderSections:          (newOrder: string[]) => void;
  // Theme
  updateTheme: (theme: ThemeConfig) => void;
  // Typography
  updateTypography: (typography: Partial<typeof defaultTypography>) => void;
  // Animation
  updateAnimationConfig: (config: Partial<typeof defaultAnimation>) => void;
  updateLenisConfig: (config: Partial<LenisConfig>) => void;
  // WebGL
  updateWebGL: (config: Partial<WebGLConfig>) => void;
  // Cursor
  updateCursor: (config: Partial<CursorConfig>) => void;
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => void;
  // internal
  _record: () => void;
};

type Store = PortfolioStore & StoreActions & { __history: { past: PortfolioStore[]; present: PortfolioStore; future: PortfolioStore[] } };

const HISTORY_LIMIT = 50;

export const usePortfolioStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    meta: defaultMeta,
    sections: [],
    theme: defaultTheme,
    typography: defaultTypography,
    animation: defaultAnimation,
    webgl: defaultWebGL,
    cursor: defaultCursor,
    __history: { past: [], present: {} as PortfolioStore, future: [] },

    updateMeta(updater) {
      set({ meta: { ...get().meta, ...updater } });
      // Only full-rewrite when name changes (nav logo) or socials change (contact section)
      // For email/title/tagline: sections read them on next full render, no live bridge needed
      if (updater.name !== undefined || updater.socials !== undefined) {
        bridge.sendFullState(get());
      }
      get()._record();
    },

    addSection(type, index) {
      const id = `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const defaultCfg = getDefaultConfigForType(type);
      const newSection: Section = {
        id,
        type,
        visible: true,
        layout: 'default',
        layoutConfigs: { default: defaultCfg },
        config: defaultCfg,
        animation: getDefaultAnimation(),
        styles: {},
        background: { type: 'inherit' },
      };
      const currentSections = get().sections;
      let afterId: string | null = null;
      const newSections = [...currentSections];
      if (index !== undefined && index >= 0) {
        newSections.splice(index, 0, newSection);
        afterId = currentSections[index - 1]?.id ?? null;
      } else {
        newSections.push(newSection);
        afterId = currentSections[currentSections.length - 1]?.id ?? null;
      }
      // Inject directly into the iframe DOM — no full rewrite, no scroll reset
      bridge.send({ type: 'SECTION_ADD', section: newSection, afterId });
      set({ sections: newSections });
      useUIStore.getState().setActiveSectionId(id);
      get()._record();
    },

    removeSection(id) {
      // Remove from DOM directly — no full rewrite needed
      bridge.send({ type: 'SECTION_REMOVE', sectionId: id });
      set({ sections: get().sections.filter(s => s.id !== id) });
      if (useUIStore.getState().activeSectionId === id) {
        useUIStore.getState().setActiveSectionId(null);
      }
      get()._record();
    },

    duplicateSection(id) {
      const src = get().sections.find(s => s.id === id);
      if (!src) return;
      const newId = `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const clone: Section = {
        ...src,
        id: newId,
        layout: src.layout || 'default',
        layoutConfigs: JSON.parse(JSON.stringify(src.layoutConfigs || { default: src.config })),
        config: { ...(src.config || {}) },
        background: { ...(src.background || { type: 'inherit' }) },
        animation: { ...src.animation, scrollTrigger: { ...src.animation.scrollTrigger } },
        styles: { ...src.styles },
      };
      const idx = get().sections.findIndex(s => s.id === id);
      const newSections = [...get().sections];
      newSections.splice(idx + 1, 0, clone);
      // Inject directly — smooth scroll to duplicate, no rewrite
      bridge.send({ type: 'SECTION_ADD', section: clone, afterId: id });
      set({ sections: newSections });
      useUIStore.getState().setActiveSectionId(newId);
      get()._record();
    },

    updateSectionConfig(id, config) {
      const sections = get().sections.map(s => {
        if (s.id !== id) return s;
        const merged = { ...s.config, ...config };
        const layout  = s.layout || 'default';
        return {
          ...s,
          config: merged,
          // Keep the active variant's layoutConfigs slot in sync
          layoutConfigs: { ...(s.layoutConfigs || {}), [layout]: merged },
        };
      });
      set({ sections });
      bridge.send({ type: 'SECTION_UPDATE', sectionId: id, data: sections.find(s => s.id === id)!.config });
      get()._record();
    },

    updateSectionAnimation(id, animation) {
      const sections = get().sections.map(s => (s.id === id ? { ...s, animation: { ...s.animation, ...animation } } : s));
      set({ sections });
      const updatedAnimation = sections.find(s => s.id === id)!.animation;
      bridge.send({ type: 'ANIMATION_UPDATE', sectionId: id, animation: updatedAnimation });
      get()._record();
    },

    updateSectionStyles(id, styles) {
      const sections = get().sections.map(s =>
        s.id === id ? { ...s, styles: { ...s.styles, ...styles } } : s
      );
      set({ sections });
      const updated = sections.find(s => s.id === id)!;
      bridge.send({ type: 'SECTION_STYLES', sectionId: id, styles: updated.styles });
      get()._record();
    },

    updateSectionBackground(id, bg) {
      const sections = get().sections.map(s =>
        s.id === id ? { ...s, background: { ...(s.background || { type: 'inherit' }), ...bg } } : s
      );
      set({ sections });
      const updated = sections.find(s => s.id === id)!;
      bridge.send({ type: 'SECTION_BACKGROUND', sectionId: id, background: updated.background });
      get()._record();
    },

    updateSectionLayout(id, layout) {
      const sections = get().sections.map(s => {
        if (s.id !== id) return s;
        // Snapshot current layout's config before switching (non-destructive)
        const currentLayout = s.layout || 'default';
        const currentConfig = s.config || {};
        const updatedLayoutConfigs = {
          ...(s.layoutConfigs || {}),
          [currentLayout]: currentConfig,  // persist current variant data
        };
        // Restore the target layout's config (or default config if first time)
        const targetConfig = updatedLayoutConfigs[layout] || s.config;
        return {
          ...s,
          layout,
          layoutConfigs: updatedLayoutConfigs,
          config: targetConfig,
        };
      });
      set({ sections });
      const updated = sections.find(s => s.id === id)!;
      bridge.send({
        type: 'SECTION_LAYOUT',
        sectionId: id,
        layout,
        config: updated.config,
      });
      get()._record();
    },

    toggleSectionVisibility(id) {
      const sections = get().sections.map(s =>
        s.id === id ? { ...s, visible: !s.visible } : s
      );
      set({ sections });
      const updated = sections.find(s => s.id === id)!;
      bridge.send({ type: 'SECTION_VISIBILITY', sectionId: id, visible: updated.visible });
      get()._record();
    },

    reorderSections(newOrder) {
      const sectionMap = new Map(get().sections.map(s => [s.id, s]));
      const newSections = newOrder.map(id => sectionMap.get(id)).filter((s): s is Section => !!s);
      set({ sections: newSections });
      bridge.send({ type: 'REORDER_SECTIONS', order: newOrder });
      get()._record();
    },

    updateTheme(theme) {
      set({ theme });
      // Send THEME_CHANGE for instant CSS var update via bridge,
      // PreviewFrame's themeId watcher will also trigger a full rewrite
      bridge.send({ type: 'THEME_CHANGE', theme });
      get()._record();
    },

    updateTypography(typography) {
      const prev = get().typography;
      set({ typography: { ...prev, ...typography } });
      const next = get().typography;
      // Font changes → targeted bridge message
      if (typography.headingFont || typography.bodyFont) {
        bridge.send({
          type: 'FONT_CHANGE',
          heading: next.headingFont,
          body: next.bodyFont,
          headingWeight: next.headingWeight,
        });
      }
      // Scale/weight changes → full refresh to re-generate CSS vars
      if (
        typography.baseSize !== undefined ||
        typography.lineHeight !== undefined ||
        typography.letterSpacing !== undefined ||
        typography.headingWeight !== undefined
      ) {
        bridge.sendFullState(get());
      }
      get()._record();
    },

    updateAnimationConfig(config) {
      set({ animation: { ...get().animation, ...config } });
      get()._record();
    },

    updateLenisConfig(config) {
      set({ animation: { ...get().animation, lenis: { ...get().animation.lenis, ...config } } });
      bridge.send({ type: 'LENIS_CONFIG', config });
      get()._record();
    },

    updateWebGL(config) {
      set({ webgl: { ...get().webgl, ...config } });
      bridge.send({ type: 'WEBGL_CONFIG', config });
      get()._record();
    },

    updateCursor(config) {
      set({ cursor: { ...get().cursor, ...config } });
      // Targeted bridge message — no full iframe rewrite needed
      bridge.send({ type: 'CURSOR_CONFIG', config });
      get()._record();
    },

    // --- History actions ---

    undo() {
      const { past, present } = get().__history;
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      set({
        ...previous,
        __history: { past: newPast, present: previous, future: [present, ...get().__history.future] },
      });
      bridge.sendFullState(previous);
    },

    redo() {
      const { future, present } = get().__history;
      if (future.length === 0) return;
      const next = future[0];
      const newFuture = future.slice(1);
      set({
        ...next,
        __history: { past: [...get().__history.past, present], present: next, future: newFuture },
      });
      bridge.sendFullState(next);
    },

    canUndo() {
      return get().__history.past.length > 0;
    },

    canRedo() {
      return get().__history.future.length > 0;
    },

    _record() {
      const current = get();
      const { past } = get().__history;
      // Fast dedup: compare section count + theme id + last section id
      // instead of JSON.stringify on the full state (O(n) → O(1))
      const fingerprint = [
        current.sections.length,
        current.theme.id,
        current.sections[current.sections.length - 1]?.id ?? '',
        current.meta.name,
      ].join('|');
      if (past.length > 0) {
        const lastFingerprint = [
          past[past.length - 1].sections?.length,
          past[past.length - 1].theme?.id,
          past[past.length - 1].sections?.[past[past.length - 1].sections.length - 1]?.id ?? '',
          past[past.length - 1].meta?.name,
        ].join('|');
        if (fingerprint === lastFingerprint) return;
      }
      const newPast = [...past, cloneState(current)].slice(-HISTORY_LIMIT);
      set({
        __history: {
          past: newPast,
          present: cloneState(current),
          future: [],
        },
      });
    },
  }))
);

// Initialize present state on first call
usePortfolioStore.getState()._record();
