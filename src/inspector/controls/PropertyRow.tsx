import * as React from 'react';

interface PropertyRowProps {
  label: string;
  hint?: string;
  /** Called when user clicks the reset icon (only shown if provided) */
  onReset?: () => void;
  children: React.ReactNode;
  /** Stack label above children instead of inline */
  stacked?: boolean;
}

/**
 * Universal Figma-style property row.
 * Wraps label + control slot with consistent spacing and hover-reveal reset action.
 */
export function PropertyRow({ label, hint, onReset, children, stacked = false }: PropertyRowProps) {
  if (stacked) {
    return (
      <div className="prop-row space-y-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] text-white/35 uppercase tracking-[0.06em] font-medium leading-none">
            {label}
          </span>
          {hint && <span className="text-[9px] text-white/20 italic truncate max-w-[120px]">{hint}</span>}
          {onReset && (
            <span className="prop-actions">
              <button
                type="button"
                onClick={onReset}
                title="Reset to default"
                className="p-0.5 rounded text-white/20 hover:text-white/60 transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="prop-row flex items-center gap-2 py-0.5 min-h-[28px]">
      <div className="flex items-center gap-1 shrink-0" style={{ width: '38%' }}>
        <span className="text-[10px] text-white/38 uppercase tracking-[0.06em] font-medium leading-none truncate">
          {label}
        </span>
        {hint && <span className="text-[9px] text-white/18 italic truncate hidden">{hint}</span>}
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {onReset && (
        <span className="prop-actions shrink-0">
          <button
            type="button"
            onClick={onReset}
            title="Reset"
            className="p-0.5 rounded text-white/20 hover:text-white/60 transition-colors"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </span>
      )}
    </div>
  );
}
