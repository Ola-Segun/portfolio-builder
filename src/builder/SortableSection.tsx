import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePortfolioStore } from '../store/portfolioStore';
import type { Section } from '../types/portfolio';

// ── Type color map (matches Inspector) ───────────────────────────────────────

const TYPE_META: Record<string, { path: string; color: string }> = {
  hero:    { path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3', color: '#818cf8' },
  about:   { path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',            color: '#34d399' },
  work:    { path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#fb923c' },
  skills:  { path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: '#a78bfa' },
  process: { path: 'M13 10V3L4 14h7v7l9-11h-7z',                                                       color: '#fbbf24' },
  contact: { path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#38bdf8' },
  custom:  { path: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',                                            color: '#f472b6' },
};

function getSectionSubtitle(section: Section): string {
  const c = section.config as Record<string, unknown>;
  if (section.type === 'hero')    return String(c.heading  ?? '');
  if (section.type === 'about')   return String(c.name     ?? '');
  if (section.type === 'contact') return String(c.heading  ?? '');
  if (section.type === 'process') return `${(c.steps    as unknown[])?.length ?? 0} steps`;
  if (section.type === 'work')    return `${(c.projects as unknown[])?.length ?? 0} projects`;
  if (section.type === 'skills')  return `${(c.skills   as unknown[])?.length ?? 0} categories`;
  return '';
}

interface Props {
  section: Section;
  isSelected: boolean;
  isConfirmingDelete: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function SortableSection({
  section,
  isSelected,
  isConfirmingDelete,
  onSelect,
  onDuplicate,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: Props) {
  const toggleVisibility = usePortfolioStore(s => s.toggleSectionVisibility);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const meta     = TYPE_META[section.type] || TYPE_META['custom'];
  const subtitle = getSectionSubtitle(section);

  return (
    <div ref={setNodeRef} style={style}>
      <div className={`layer-row group ${isSelected ? 'selected' : ''} ${!section.visible ? 'opacity-40' : ''}`}>

        {/* Drag handle — invisible until hover */}
        <button
          {...attributes}
          {...listeners}
          tabIndex={-1}
          aria-label="Drag to reorder"
          onClick={e => e.stopPropagation()}
          className="flex-shrink-0 w-4 h-4 flex items-center justify-center
            text-white/0 group-hover:text-white/30 hover:!text-white/60
            cursor-grab active:cursor-grabbing transition-colors touch-none"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
            <circle cx="2" cy="2" r="1"/><circle cx="7" cy="2" r="1"/>
            <circle cx="2" cy="5" r="1"/><circle cx="7" cy="5" r="1"/>
            <circle cx="2" cy="8" r="1"/><circle cx="7" cy="8" r="1"/>
          </svg>
        </button>

        {/* Type badge */}
        <div
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
          style={{ background: meta.color + '1a' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="1.5">
            <path d={meta.path} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Label — click selects */}
        <button
          onClick={onSelect}
          className="flex-1 min-w-0 text-left flex flex-col justify-center gap-px"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-white/80 capitalize leading-none group-[.selected]:text-white">
              {section.type}
            </span>
            {!section.visible && (
              <span className="text-[9px] text-white/25 italic">hidden</span>
            )}
          </div>
          {subtitle && (
            <span className="text-[9px] text-white/30 truncate leading-none">{subtitle}</span>
          )}
        </button>

        {/* ── Actions (reveal on hover / selected) ────────────────────── */}
        {isConfirmingDelete ? (
          <div className="layer-actions flex items-center gap-1 !opacity-100">
            <span className="text-[9px] text-red-400">Delete?</span>
            <button onClick={onConfirmDelete}
              className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/35 transition-colors">
              Yes
            </button>
            <button onClick={onCancelDelete}
              className="text-[9px] px-1.5 py-0.5 rounded bg-white/6 text-white/35 hover:bg-white/10 transition-colors">
              No
            </button>
          </div>
        ) : (
          <div className="layer-actions">
            {/* Visibility */}
            <button
              onClick={e => { e.stopPropagation(); toggleVisibility(section.id); }}
              title={section.visible ? 'Hide section' : 'Show section'}
              className="p-1 rounded text-white/28 hover:text-white/70 hover:bg-white/6 transition-colors"
            >
              {section.visible ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20C6 20 2 12 2 12a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c6 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              )}
            </button>

            {/* Duplicate */}
            <button
              onClick={e => { e.stopPropagation(); onDuplicate(); }}
              title="Duplicate section"
              className="p-1 rounded text-white/28 hover:text-white/70 hover:bg-white/6 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={e => { e.stopPropagation(); onRequestDelete(); }}
              title="Delete section"
              className="p-1 rounded text-white/18 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
