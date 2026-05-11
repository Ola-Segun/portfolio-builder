import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../store/portfolioStore';
import { useUIStore }        from '../store/uiStore';
import { bridge }            from '../preview/PreviewBridge';

// ── Section type definitions ──────────────────────────────────────────────────

const SECTION_TYPES = [
  {
    type: 'hero'    as const, label: 'Hero',    color: '#818cf8',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3',
    description: 'Full-screen intro',
  },
  {
    type: 'about'   as const, label: 'About',   color: '#34d399',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    description: 'Bio & photo',
  },
  {
    type: 'work'    as const, label: 'Work',    color: '#fb923c',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    description: 'Project showcase',
  },
  {
    type: 'skills'  as const, label: 'Skills',  color: '#a78bfa',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    description: 'Tech stack',
  },
  {
    type: 'process' as const, label: 'Process', color: '#fbbf24',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'Workflow steps',
  },
  {
    type: 'contact' as const, label: 'Contact', color: '#38bdf8',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    description: 'Email & socials',
  },
  {
    type: 'custom'  as const, label: 'Custom',  color: '#f472b6',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    description: 'Raw HTML block',
  },
] as const;

// ── SectionPalette ────────────────────────────────────────────────────────────

export function SectionPalette() {
  const { addSection }     = usePortfolioStore();
  const setActiveSectionId = useUIStore(s => s.setActiveSectionId);
  const sections           = usePortfolioStore(s => s.sections);

  const [open,   setOpen]   = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  const handleAdd = (type: (typeof SECTION_TYPES)[number]['type']) => {
    setAdding(type);
    addSection(type);
    // Navigate to the newly added section
    setTimeout(() => {
      const store   = usePortfolioStore.getState();
      const newest  = store.sections[store.sections.length - 1];
      if (newest) {
        setActiveSectionId(newest.id);
        bridge.scrollToSection(newest.id);
      }
      setAdding(null);
    }, 80);
  };

  return (
    <div className="border-b border-white/[0.06] flex-shrink-0">
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.03] transition-colors group"
      >
        <div className="flex items-center gap-2">
          <svg
            width="8" height="8" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className={`text-white/25 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.08em]">
            Add Section
          </span>
        </div>
        <span className="text-[9px] text-white/18 group-hover:text-white/35 transition-colors">
          {SECTION_TYPES.length} types
        </span>
      </button>

      {/* Collapsible list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-1.5 pt-0.5 space-y-px">
              {SECTION_TYPES.map(sec => {
                const isAdding = adding === sec.type;
                return (
                  <button
                    key={sec.type}
                    onClick={() => handleAdd(sec.type)}
                    title={sec.description}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left
                      transition-all duration-100 group/btn
                      ${isAdding
                        ? 'bg-white/10 scale-[0.99]'
                        : 'hover:bg-white/[0.05] active:scale-[0.99]'
                      }`}
                  >
                    {/* Type badge */}
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
                      style={{ background: sec.color + '22' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke={sec.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={sec.icon}/>
                      </svg>
                    </div>

                    {/* Label + description */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-white/65 group-hover/btn:text-white/85 leading-none transition-colors">
                        {sec.label}
                      </div>
                      <div className="text-[9px] text-white/25 mt-0.5 leading-none">{sec.description}</div>
                    </div>

                    {/* Add icon */}
                    <svg
                      width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className={`flex-shrink-0 transition-all duration-100 ${
                        isAdding ? 'text-white/70 rotate-45' : 'text-white/0 group-hover/btn:text-white/30'
                      }`}
                    >
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
