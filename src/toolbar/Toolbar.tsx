import { useRef } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { ViewportToggle } from './ViewportToggle';
import { ThemeSwitcher } from './ThemeSwitcher';
import { FontPicker } from './FontPicker';
import { ExportButton } from './ExportButton';

function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  );
}

function LoadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function Toolbar({
  onToggleCollapse,
  isCollapsed = false,
}: {
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}) {
  const canUndo = usePortfolioStore(s => s.__history.past.length > 0);
  const canRedo = usePortfolioStore(s => s.__history.future.length > 0);
  const undo    = usePortfolioStore(s => s.undo);
  const redo    = usePortfolioStore(s => s.redo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Save project as JSON ──────────────────────────────────────────────
  const handleSave = () => {
    const state = usePortfolioStore.getState();
    const save = {
      version: 1,
      savedAt: new Date().toISOString(),
      meta: state.meta,
      sections: state.sections,
      theme: state.theme,
      typography: state.typography,
      animation: state.animation,
      webgl: state.webgl,
      cursor: state.cursor,
    };
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${state.meta.name || 'portfolio'}-save.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Load project from JSON ────────────────────────────────────────────
  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (!data.sections || !data.meta) {
          alert('Invalid portfolio file — missing sections or meta.');
          return;
        }
        // Apply each piece of state — triggers the bridge automatically
        const store = usePortfolioStore.getState();
        store.updateMeta(data.meta);
        if (data.theme)      store.updateTheme(data.theme);
        if (data.typography) store.updateTypography(data.typography);
        if (data.webgl)      store.updateWebGL(data.webgl);
        if (data.cursor)     store.updateCursor(data.cursor);
        // Rebuild sections from scratch
        data.sections.forEach((s: typeof data.sections[0]) => {
          store.addSection(s.type);
        });
        // Reload page state after a tick (sections won't have right configs otherwise)
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch {
        alert('Could not parse portfolio file — invalid JSON.');
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be loaded again
    e.target.value = '';
  };

  return (
    <header className="h-[52px] flex items-center px-4 gap-3 border-b border-white/8 bg-neutral-950 z-50 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-sm font-medium tracking-tight">Portfolio Builder</span>
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* Undo / Redo */}
      <div className="flex gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-white/10" />

      {/* Save / Load JSON */}
      <div className="flex gap-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Save project as JSON"
        >
          <SaveIcon />
          <span>Save</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Load project from JSON"
        >
          <LoadIcon />
          <span>Load</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleLoad}
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <ViewportToggle />
        <ThemeSwitcher />
        <FontPicker />
      </div>

      <div className="w-px h-5 bg-white/10" />

      <ExportButton />

      <div className="w-px h-5 bg-white/10" />

      {/* Minimize UI — Figma-style collapse toggle */}
      <button
        onClick={onToggleCollapse}
        title={`${isCollapsed ? 'Show' : 'Hide'} panels (Shift + \\)`}
        className={`p-1.5 rounded transition-colors ${
          isCollapsed
            ? 'text-white bg-white/12 hover:bg-white/18'
            : 'text-white/40 hover:text-white hover:bg-white/10'
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="18" rx="2"/>
          <path d="M8 3v18" strokeOpacity="0.5"/>
          <path d="M16 3v18" strokeOpacity="0.5"/>
        </svg>
      </button>
    </header>
  );
}
