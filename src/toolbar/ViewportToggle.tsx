import { useUIStore } from '../store/uiStore';

const VIEWPORT_SIZES: Record<string, { w: number; h: number; label: string }> = {
  desktop: { w: 1440, h: 900,  label: '1440' },
  tablet:  { w: 768,  h: 1024, label: '768'  },
  mobile:  { w: 390,  h: 844,  label: '390'  },
};

export function ViewportToggle({ compact = false }: { compact?: boolean }) {
  const viewport    = useUIStore(s => s.viewport);
  const setViewport = useUIStore(s => s.setViewport);
  const size        = VIEWPORT_SIZES[viewport];

  return (
    <div className="flex items-center gap-1.5">
      {/* Device buttons */}
      <div className="flex bg-white/[0.05] rounded-lg p-1 gap-px">

        {/* Desktop */}
        <button
          onClick={() => setViewport('desktop')}
          title="Desktop — 1440px"
          className={`p-1.5 rounded transition-all duration-150 flex items-center justify-center ${
            viewport === 'desktop'
              ? 'bg-white text-black'
              : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="13" rx="1.5"/>
            <path d="M9 20h6"/>
            <path d="M12 16v4"/>
          </svg>
        </button>

        {/* Tablet */}
        <button
          onClick={() => setViewport('tablet')}
          title="Tablet — 768px"
          className={`p-1.5 rounded transition-all duration-150 flex items-center justify-center ${
            viewport === 'tablet'
              ? 'bg-white text-black'
              : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
          }`}
        >
          <svg width="16" height="18" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="16" height="22" rx="2"/>
            <line x1="7" y1="20.5" x2="11" y2="20.5" strokeWidth="1.8"/>
            <circle cx="9" cy="3" r="0.8" fill="currentColor"/>
          </svg>
        </button>

        {/* Mobile */}
        <button
          onClick={() => setViewport('mobile')}
          title="Mobile — 390px"
          className={`p-1.5 rounded transition-all duration-150 flex items-center justify-center ${
            viewport === 'mobile'
              ? 'bg-white text-black'
              : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
          }`}
        >
          <svg width="12" height="18" viewBox="0 0 14 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="12" height="22" rx="2.5"/>
            <rect x="4" y="2.5" width="6" height="2" rx="1" fill="currentColor" stroke="none"/>
            <line x1="4.5" y1="20.5" x2="9.5" y2="20.5" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Resolution label — hidden in compact (collapsed) mode */}
      {!compact && (
        <span className="text-[10px] font-mono text-white/25 min-w-[32px]">
          {size.w}
        </span>
      )}
    </div>
  );
}
