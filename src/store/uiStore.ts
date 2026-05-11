import { create } from 'zustand';

type InspectorTab =
  | 'content'
  | 'layout'
  | 'animation'
  | 'style'
  | 'code'
  | 'identity'
  | 'typography'
  | 'theme'
  | 'effects';

interface UIState {
  viewport: 'desktop' | 'tablet' | 'mobile';
  inspectorTab: InspectorTab;
  activeSectionId: string | null;
  isPanelOpen: {
    hero: boolean;
    about: boolean;
    work: boolean;
    skills: boolean;
    process: boolean;
    contact: boolean;
  };
  /** Resizable panel widths in px */
  leftPanelWidth: number;
  rightPanelWidth: number;
  /** Figma "Minimize UI" — hides both side panels for full-canvas mode */
  uiCollapsed: boolean;
  // Actions
  setViewport: (viewport: UIState['viewport']) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setActiveSectionId: (id: string | null) => void;
  togglePanel: (section: keyof UIState['isPanelOpen']) => void;
  setPanelWidth: (panel: 'left' | 'right', width: number) => void;
  toggleUICollapsed: () => void;
}

const LEFT_MIN  = 200;
const LEFT_MAX  = 480;
const RIGHT_MIN = 240;
const RIGHT_MAX = 520;

export const useUIStore = create<UIState>((set) => ({
  viewport: 'desktop',
  inspectorTab: 'content',
  activeSectionId: null,
  leftPanelWidth:  280,
  rightPanelWidth: 300,
  uiCollapsed: false,
  isPanelOpen: {
    hero: true,
    about: true,
    work: true,
    skills: true,
    process: true,
    contact: true,
  },

  setViewport(viewport) {
    set({ viewport });
  },

  setInspectorTab(tab) {
    set({ inspectorTab: tab });
  },

  setActiveSectionId(id) {
    set({ activeSectionId: id, inspectorTab: id ? 'content' : 'identity' });
  },

  togglePanel(section) {
    set((state) => ({
      isPanelOpen: {
        ...state.isPanelOpen,
        [section]: !state.isPanelOpen[section],
      },
    }));
  },

  setPanelWidth(panel, width) {
    if (panel === 'left') {
      set({ leftPanelWidth: Math.min(LEFT_MAX, Math.max(LEFT_MIN, width)) });
    } else {
      set({ rightPanelWidth: Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, width)) });
    }
  },

  toggleUICollapsed() {
    set(state => ({ uiCollapsed: !state.uiCollapsed }));
  },
}));
