import React from 'react';
import { useCallback } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { SectionStyles } from '../../types/portfolio';

const PADDING_OPTIONS = [
  { label: '2rem',  value: '2rem' },
  { label: '4rem',  value: '4rem' },
  { label: '6vw',   value: '6vw' },
  { label: '8vw',   value: '8vw' },
  { label: '12vw',  value: '12vw' },
  { label: 'None',  value: '0' },
];

const MAXWIDTH_OPTIONS = [
  { label: 'Full',  value: 'full' },
  { label: '90rem', value: '90rem' },
  { label: '80rem', value: '80rem' },
  { label: '70rem', value: '70rem' },
  { label: '60ch',  value: '60ch' },
  { label: '80ch',  value: '80ch' },
];

const ALIGN_OPTIONS: { label: string; value: SectionStyles['textAlign']; icon: React.ReactElement }[] = [
  {
    label: 'Left', value: 'left',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  },
  {
    label: 'Center', value: 'center',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="12" x2="6" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
  },
  {
    label: 'Right', value: 'right',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>,
  },
];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs transition-all ${
        active
          ? 'bg-white/20 text-white border border-white/30'
          : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70'
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider pt-4 border-t border-white/8 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}

export function StylePanel({ sectionId }: { sectionId: string }) {
  const section = usePortfolioStore(
    useCallback(s => s.sections.find(sec => sec.id === sectionId), [sectionId])
  );
  const updateStyles = usePortfolioStore(s => s.updateSectionStyles);

  if (!section) return null;
  const styles = section.styles || {};

  const update = (patch: Partial<SectionStyles>) => updateStyles(sectionId, patch);

  return (
    <div className="space-y-4">

      {/* Text Alignment */}
      <div className="space-y-2">
        <SectionLabel>Text Align</SectionLabel>
        <div className="flex gap-1.5">
          {ALIGN_OPTIONS.map(opt => (
            <button
              key={opt.value}
              title={opt.label}
              onClick={() => update({ textAlign: styles.textAlign === opt.value ? undefined : opt.value })}
              className={`flex-1 flex items-center justify-center py-2 rounded border transition-all ${
                styles.textAlign === opt.value
                  ? 'bg-white/15 border-white/30 text-white'
                  : 'bg-white/4 border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Padding Top */}
      <div className="space-y-2">
        <SectionLabel>Padding Top</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {PADDING_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={styles.paddingTop === opt.value}
              onClick={() => update({ paddingTop: styles.paddingTop === opt.value ? undefined : opt.value })}
            />
          ))}
        </div>
        {/* Custom value */}
        <input
          type="text"
          placeholder="Custom e.g. 5rem"
          value={styles.paddingTop && !PADDING_OPTIONS.find(o => o.value === styles.paddingTop) ? styles.paddingTop : ''}
          onChange={e => update({ paddingTop: e.target.value || undefined })}
          className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Padding Bottom */}
      <div className="space-y-2">
        <SectionLabel>Padding Bottom</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {PADDING_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={styles.paddingBottom === opt.value}
              onClick={() => update({ paddingBottom: styles.paddingBottom === opt.value ? undefined : opt.value })}
            />
          ))}
        </div>
        <input
          type="text"
          placeholder="Custom e.g. 5rem"
          value={styles.paddingBottom && !PADDING_OPTIONS.find(o => o.value === styles.paddingBottom) ? styles.paddingBottom : ''}
          onChange={e => update({ paddingBottom: e.target.value || undefined })}
          className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Max Width */}
      <div className="space-y-2">
        <SectionLabel>Content Width</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {MAXWIDTH_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={styles.maxWidth === opt.value}
              onClick={() => update({ maxWidth: styles.maxWidth === opt.value ? undefined : opt.value })}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => updateStyles(sectionId, { paddingTop: undefined, paddingBottom: undefined, maxWidth: undefined, textAlign: undefined })}
        className="w-full py-1.5 text-xs text-white/30 hover:text-white/60 border border-white/8 hover:border-white/20 rounded transition-colors"
      >
        Reset to defaults
      </button>
    </div>
  );
}
