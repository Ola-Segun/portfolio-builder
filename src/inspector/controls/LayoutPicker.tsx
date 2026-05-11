import React from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { getLayoutsForType } from '../../layouts';
import type { SectionType } from '../../types/portfolio';

// ── Schematic SVG thumbnails ───────────────────────────────────────────────────

const THUMBNAILS: Record<string, React.ReactElement> = {
  left: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="8" y="10" width="28" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="8" y="18" width="40" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="8" y="30" width="36" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="36" width="32" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="44" width="18" height="5" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  center: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="26" y="10" width="28" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="12" y="18" width="56" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="16" y="30" width="48" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="20" y="36" width="40" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="28" y="44" width="24" height="5" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  split: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4" y="12" width="32" height="6" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="4" y="22" width="28" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="28" width="24" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="38" width="16" height="5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="42" y="4" width="34" height="46" rx="2" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4" y="4" width="34" height="22" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="28" width="34" height="22" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="42" y="12" width="34" height="6" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="42" y="22" width="30" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="42" y="28" width="28" height="3" rx="1" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  text: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="8" y="10" width="24" height="3" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="8" y="18" width="50" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="8" y="30" width="60" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="36" width="56" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="42" width="50" height="3" rx="1" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  alt: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4"  y="4"  width="34" height="18" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="42" y="8"  width="34" height="4"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="42" y="15" width="28" height="3"  rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="4"  y="30" width="34" height="4"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4"  y="37" width="28" height="3"  rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="42" y="28" width="34" height="18" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  rows: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4" y="8"  width="72" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="14" width="20" height="3"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4" y="20" width="60" height="3"  rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="4" y="27" width="72" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="33" width="24" height="3"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4" y="39" width="56" height="3"  rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  pills: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="20" y="8"  width="40" height="5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="6"  y="22" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.2"/>
      <rect x="28" y="22" width="24" height="5" rx="2.5" fill="currentColor" opacity="0.2"/>
      <rect x="56" y="22" width="18" height="5" rx="2.5" fill="currentColor" opacity="0.2"/>
      <rect x="6"  y="32" width="24" height="5" rx="2.5" fill="currentColor" opacity="0.15"/>
      <rect x="34" y="32" width="16" height="5" rx="2.5" fill="currentColor" opacity="0.15"/>
      <rect x="54" y="32" width="20" height="5" rx="2.5" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  num: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4" y="4"  width="72" height="1" rx="0.5" fill="currentColor" opacity="0.15"/>
      <rect x="4" y="10" width="10" height="8" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="18" y="12" width="32" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="18" y="18" width="44" height="2" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="4" y="26" width="72" height="1" rx="0.5" fill="currentColor" opacity="0.15"/>
      <rect x="4" y="32" width="10" height="8" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="18" y="34" width="28" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="18" y="40" width="40" height="2" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  min: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="8" y="12" width="20" height="3" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="8" y="20" width="56" height="8" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="8" y="36" width="16" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="28" y="36" width="16" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="48" y="36" width="16" height="3" rx="1" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  raw: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="8" y="12" width="14" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="26" y="12" width="20" height="3" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="20" width="10" height="3" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="22" y="20" width="30" height="3" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="8" y="28" width="16" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="28" y="28" width="24" height="3" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  bento: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4"  y="4"  width="36" height="28" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="44" y="4"  width="32" height="13" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="44" y="19" width="32" height="13" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="4"  y="36" width="24" height="14" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="32" y="36" width="16" height="14" rx="2" fill="currentColor" opacity="0.25"/>
      <rect x="52" y="36" width="24" height="14" rx="2" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  full: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.15"/>
      <rect x="0" y="32" width="80" height="22" rx="0" fill="currentColor" opacity="0.2"/>
      <rect x="8" y="36" width="30" height="5" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="8" y="44" width="22" height="3" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4"  y="8"  width="24" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4"  y="16" width="20" height="7" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="4"  y="28" width="24" height="18" rx="1" fill="currentColor" opacity="0.12"/>
      <rect x="34" y="8"  width="2" height="38" fill="currentColor" opacity="0.1"/>
      <rect x="40" y="10" width="36" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="40" y="18" width="36" height="3" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="40" y="24" width="32" height="3" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  list: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4" y="8"  width="72" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="12" width="6"  height="5" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="13" width="36" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4" y="22" width="72" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="26" width="6"  height="5" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="27" width="30" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4" y="36" width="72" height="1" rx="0.5" fill="currentColor" opacity="0.2"/>
      <rect x="4" y="40" width="6"  height="5" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="14" y="41" width="40" height="3" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  bars: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="8" y="10" width="26" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="20" width="64" height="2" rx="1" fill="currentColor" opacity="0.1"/>
      <rect x="8" y="20" width="50" height="2" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="28" width="64" height="2" rx="1" fill="currentColor" opacity="0.1"/>
      <rect x="8" y="28" width="40" height="2" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="36" width="64" height="2" rx="1" fill="currentColor" opacity="0.1"/>
      <rect x="8" y="36" width="55" height="2" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="44" width="64" height="2" rx="1" fill="currentColor" opacity="0.1"/>
      <rect x="8" y="44" width="32" height="2" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  time: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <circle cx="16" cy="14" r="4" fill="currentColor" opacity="0.4"/>
      <rect x="15" y="18" width="2" height="12" fill="currentColor" opacity="0.15"/>
      <circle cx="16" cy="34" r="4" fill="currentColor" opacity="0.4"/>
      <rect x="15" y="38" width="2" height="10" fill="currentColor" opacity="0.15"/>
      <rect x="26" y="12" width="30" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="26" y="18" width="44" height="2" rx="1" fill="currentColor" opacity="0.15"/>
      <rect x="26" y="32" width="26" height="3" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="26" y="38" width="40" height="2" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  cards: (
    <svg viewBox="0 0 80 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <rect width="80" height="54" rx="3" fill="currentColor" opacity="0.06"/>
      <rect x="4"  y="16" width="22" height="28" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="4"  y="18" width="8"  height="5"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="4"  y="26" width="18" height="2"  rx="1" fill="currentColor" opacity="0.25"/>
      <rect x="29" y="16" width="22" height="28" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="29" y="18" width="8"  height="5"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="29" y="26" width="18" height="2"  rx="1" fill="currentColor" opacity="0.25"/>
      <rect x="54" y="16" width="22" height="28" rx="2" fill="currentColor" opacity="0.15"/>
      <rect x="54" y="18" width="8"  height="5"  rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="54" y="26" width="18" height="2"  rx="1" fill="currentColor" opacity="0.25"/>
    </svg>
  ),
};

function LayoutThumbnail({ type }: { type: string }) {
  return THUMBNAILS[type] ?? THUMBNAILS['left'];
}

// ── LayoutPicker ──────────────────────────────────────────────────────────────

export function LayoutPicker({ sectionId, sectionType }: { sectionId: string; sectionType: SectionType }) {
  const section            = usePortfolioStore(s => s.sections.find(sec => sec.id === sectionId));
  const updateSectionLayout = usePortfolioStore(s => s.updateSectionLayout);

  const layouts     = getLayoutsForType(sectionType);
  const activeLayout = section?.layout || 'default';

  if (layouts.length <= 1) {
    return (
      <div className="p-4 rounded-lg bg-white/4 border border-white/8 text-center">
        <p className="text-xs text-white/30">This section only has one layout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Layout Variant</h3>
        <span className="text-xs text-white/25">{layouts.length} options</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {layouts.map(layout => {
          const isActive = layout.id === activeLayout;
          return (
            <button
              key={layout.id}
              onClick={() => updateSectionLayout(sectionId, layout.id)}
              title={layout.description}
              className={`group relative rounded-lg border overflow-hidden transition-all duration-150 ${
                isActive
                  ? 'border-white/40 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'
                  : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/7'
              }`}
            >
              {/* Schematic preview */}
              <div className={`aspect-[80/54] p-2 transition-colors ${
                isActive ? 'text-white' : 'text-white/40 group-hover:text-white/60'
              }`}>
                <LayoutThumbnail type={layout.thumbnail} />
              </div>

              {/* Label */}
              <div className={`px-2 pb-2 text-xs font-medium transition-colors leading-none ${
                isActive ? 'text-white' : 'text-white/45 group-hover:text-white/70'
              }`}>
                {layout.label}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white/90" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-white/20 leading-relaxed">
        Content is preserved independently for each layout variant.
      </p>
    </div>
  );
}
