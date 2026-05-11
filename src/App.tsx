import { useEffect, useRef, useCallback } from 'react';
import { Toolbar }          from './toolbar/Toolbar';
import { SectionPalette }   from './builder/SectionPalette';
import { SectionStrip }     from './builder/SectionStrip';
import { PreviewFrame }     from './preview/PreviewFrame';
import { Inspector }        from './inspector/Inspector';
import { ViewportToggle }   from './toolbar/ViewportToggle';
import { usePortfolioStore } from './store/portfolioStore';
import { useUIStore }       from './store/uiStore';

// ── Resize Handle ─────────────────────────────────────────────────────────────

interface ResizeHandleProps {
  panel: 'left' | 'right';
  inverted?: boolean;
  hidden?: boolean;
}

function ResizeHandle({ panel, inverted = false, hidden = false }: ResizeHandleProps) {
  const setPanelWidth = useUIStore(s => s.setPanelWidth);
  const handleRef     = useRef<HTMLDivElement>(null);
  const dragging      = useRef(false);
  const startX        = useRef(0);
  const startWidth    = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current  = true;
    startX.current    = e.clientX;
    const current     = panel === 'left'
      ? useUIStore.getState().leftPanelWidth
      : useUIStore.getState().rightPanelWidth;
    startWidth.current = current;
    handleRef.current?.classList.add('is-dragging');
    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [panel]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = inverted
        ? startX.current - e.clientX
        : e.clientX - startX.current;
      setPanelWidth(panel, startWidth.current + delta);
    }
    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      handleRef.current?.classList.remove('is-dragging');
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [panel, inverted, setPanelWidth]);

  if (hidden) return null;

  return (
    <div
      ref={handleRef}
      className="resize-handle"
      onMouseDown={onMouseDown}
      title="Drag to resize"
    />
  );
}

// ── Floating Mini-Bar (shown when UI is collapsed) ────────────────────────────

function CollapsedMiniBar() {
  const toggle   = useUIStore(s => s.toggleUICollapsed);
  const meta     = usePortfolioStore(s => s.meta);

  return (
    <div
      className="fixed top-3 left-3 z-[100] flex items-center gap-2
        bg-[#1e1e1e] border border-white/[0.12] rounded-lg px-3 py-2
        shadow-2xl backdrop-blur-sm"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
    >
      {/* App logo mark */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>

      {/* Project name */}
      <span className="text-[11px] font-medium text-white/70 max-w-[120px] truncate">
        {meta?.name || 'Portfolio Builder'}
      </span>

      {/* Divider */}
      <div className="w-px h-3.5 bg-white/10" />

      {/* Viewport toggle — available even when panels are hidden */}
      <ViewportToggle compact />

      {/* Divider */}
      <div className="w-px h-3.5 bg-white/10" />

      {/* Restore panels button */}
      <button
        onClick={toggle}
        title="Show panels (Shift + \\)"
        className="flex items-center gap-1.5 text-[10px] text-white/40
          hover:text-white/80 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 3v18M15 3v18" opacity=".4"/>
        </svg>
        <span>Show UI</span>
      </button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const undo             = usePortfolioStore(s => s.undo);
  const redo             = usePortfolioStore(s => s.redo);
  const leftPanelWidth   = useUIStore(s => s.leftPanelWidth);
  const rightPanelWidth  = useUIStore(s => s.rightPanelWidth);
  const uiCollapsed      = useUIStore(s => s.uiCollapsed);
  const toggleUICollapsed = useUIStore(s => s.toggleUICollapsed);

  // ── Global keyboard shortcuts ──────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo / Redo
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }

      // Escape — deselect section, or restore UI if collapsed
      else if (e.key === 'Escape') {
        if (uiCollapsed) {
          toggleUICollapsed();
          return;
        }
        const active = useUIStore.getState().activeSectionId;
        if (active) useUIStore.getState().setActiveSectionId(null);
      }

      // Shift + \ → toggle UI collapse (matches Figma shortcut)
      else if (e.shiftKey && e.key === '\\') {
        e.preventDefault();
        toggleUICollapsed();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, uiCollapsed, toggleUICollapsed]);

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* ── Top toolbar — hidden when collapsed ──────────────────── */}
      <div
        className="shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ height: uiCollapsed ? 0 : 52, opacity: uiCollapsed ? 0 : 1 }}
      >
        <Toolbar onToggleCollapse={toggleUICollapsed} isCollapsed={uiCollapsed} />
      </div>

      {/* ── Main workspace ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left panel */}
        <aside
          className="flex flex-col overflow-hidden bg-[#141414] shrink-0 border-r border-white/[0.06]
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width:   uiCollapsed ? 0 : leftPanelWidth,
            opacity: uiCollapsed ? 0 : 1,
            borderRightWidth: uiCollapsed ? 0 : undefined,
          }}
        >
          <SectionPalette />
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 section-strip-scroll">
            <SectionStrip />
          </div>
        </aside>

        {/* Left resize handle — only when not collapsed */}
        <ResizeHandle panel="left" hidden={uiCollapsed} />

        {/* ── Preview canvas ─────────────────────────────────────── */}
        <main className="flex-1 flex items-center justify-center bg-[#1a1a1a] overflow-hidden min-w-0 relative">
          <PreviewFrame />

          {/* Click-zone overlay hint when collapsed — click canvas restores */}
          {uiCollapsed && (
            <button
              onClick={toggleUICollapsed}
              className="absolute bottom-6 left-1/2 -translate-x-1/2
                flex items-center gap-2 px-4 py-2 rounded-full
                bg-black/50 border border-white/10 backdrop-blur-sm
                text-[11px] text-white/40 hover:text-white/70
                hover:bg-black/70 transition-all duration-200"
              title="Restore panels"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18" opacity=".5"/>
                <path d="M15 3v18" opacity=".5"/>
              </svg>
              Press <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Shift + \</kbd> to restore panels
            </button>
          )}
        </main>

        {/* Right resize handle — only when not collapsed */}
        <ResizeHandle panel="right" inverted hidden={uiCollapsed} />

        {/* Right panel (Inspector) */}
        <aside
          className="flex flex-col overflow-hidden bg-[#141414] shrink-0 border-l border-white/[0.06]
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width:   uiCollapsed ? 0 : rightPanelWidth,
            opacity: uiCollapsed ? 0 : 1,
            borderLeftWidth: uiCollapsed ? 0 : undefined,
          }}
        >
          <Inspector />
        </aside>
      </div>

      {/* Floating mini-bar — only visible when collapsed */}
      {uiCollapsed && <CollapsedMiniBar />}
    </div>
  );
}
