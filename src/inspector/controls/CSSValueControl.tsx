import * as React from 'react';

interface CSSValueControlProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  presets?: string[];
  placeholder?: string;
}

/** Parse numeric prefix + unit from a CSS value string.
 *  e.g. "0.875rem" → { num: 0.875, unit: "rem", rest: "" }
 *       "1px solid var(--border)" → { num: 1, unit: "px", rest: " solid var(--border)" }
 *       "none" → null
 */
function parseCSSNumber(v: string): { num: number; unit: string; rest: string } | null {
  const m = v.match(/^(-?[\d.]+)(px|rem|em|%|vh|vw|deg|s|ms)(.*)/);
  if (!m) return null;
  return { num: parseFloat(m[1]), unit: m[2], rest: m[3] };
}

/**
 * Figma-style CSS token input.
 * – Label is draggable for scrubbing numeric values
 * – Preset chips revealed on row hover
 * – 150ms transition on focus
 */
export function CSSValueControl({
  label,
  value,
  onChange,
  hint,
  presets,
  placeholder,
}: CSSValueControlProps) {
  const [draft, setDraft]     = React.useState(value);
  const [focused, setFocused] = React.useState(false);

  // Scrub state
  const scrubRef  = React.useRef(false);
  const scrubData = React.useRef<{ startX: number; startNum: number; unit: string; rest: string } | null>(null);

  React.useEffect(() => {
    if (!focused) setDraft(value);
  }, [value, focused]);

  function commit(val: string) {
    const trimmed = val.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
  }

  // ── Scrub interaction ────────────────────────────────────────────────────
  function onLabelMouseDown(e: React.MouseEvent<HTMLSpanElement>) {
    const parsed = parseCSSNumber(value);
    if (!parsed) return; // non-numeric value — don't scrub
    e.preventDefault();
    scrubRef.current  = true;
    scrubData.current = { startX: e.clientX, startNum: parsed.num, unit: parsed.unit, rest: parsed.rest };
    document.body.style.cursor    = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  React.useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!scrubRef.current || !scrubData.current) return;
      const { startX, startNum, unit, rest } = scrubData.current;
      const step    = e.shiftKey ? 10 : 1;
      const delta   = (e.clientX - startX) * step;
      // For rem/em we use 0.1 as base step
      const factor  = unit === 'rem' || unit === 'em' ? 0.1 : 1;
      const raw     = startNum + delta * factor;
      const rounded = unit === 'rem' || unit === 'em'
        ? Math.round(raw * 100) / 100
        : Math.round(raw);
      const next = `${rounded}${unit}${rest}`;
      setDraft(next);
      onChange(next);
    }
    function onMouseUp() {
      if (!scrubRef.current) return;
      scrubRef.current  = false;
      scrubData.current = null;
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [onChange]);

  const isScrubable = !!parseCSSNumber(value);

  return (
    <div className="group space-y-1">
      {/* Label row */}
      <div className="flex items-center justify-between gap-1 h-4">
        <span
          onMouseDown={onLabelMouseDown}
          className={`text-[10px] text-white/35 uppercase tracking-[0.06em] font-medium leading-none select-none transition-colors ${
            isScrubable ? 'cursor-ew-resize hover:text-white/65' : 'cursor-default'
          }`}
          title={isScrubable ? 'Drag to scrub value (Shift = 10×)' : undefined}
        >
          {label}
        </span>
        {hint && <span className="text-[9px] text-white/18 italic truncate max-w-[120px]">{hint}</span>}
      </div>

      {/* Input */}
      <input
        type="text"
        value={draft}
        placeholder={placeholder ?? label}
        onChange={e => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={e  => { setFocused(false); commit(e.target.value); }}
        onKeyDown={e => {
          if (e.key === 'Enter')  { e.currentTarget.blur(); }
          if (e.key === 'Escape') { setDraft(value); e.currentTarget.blur(); }
          // Arrow key nudge when focused
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const parsed = parseCSSNumber(draft);
            if (!parsed) return;
            e.preventDefault();
            const step   = e.shiftKey ? 10 : 1;
            const factor = parsed.unit === 'rem' || parsed.unit === 'em' ? 0.1 : 1;
            const delta  = (e.key === 'ArrowUp' ? 1 : -1) * step * factor;
            const raw    = parsed.num + delta;
            const rounded = parsed.unit === 'rem' || parsed.unit === 'em'
              ? Math.round(raw * 100) / 100 : Math.round(raw);
            const next = `${rounded}${parsed.unit}${parsed.rest}`;
            setDraft(next);
            onChange(next);
          }
        }}
        className={`w-full bg-white/[0.04] border rounded px-2 py-1 text-[11px] font-mono text-white/80
          placeholder:text-white/18 outline-none transition-all duration-150
          ${focused
            ? 'border-white/28 bg-white/[0.07]'
            : 'border-white/[0.07] hover:border-white/14'
          }`}
      />

      {/* Presets — hidden until row hovered */}
      {presets && presets.length > 0 && (
        <div className="hidden group-hover:flex flex-wrap gap-1 pt-0.5">
          {presets.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { setDraft(p); onChange(p); }}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-100 ${
                value === p
                  ? 'border-white/30 bg-white/10 text-white/75'
                  : 'border-white/[0.07] bg-white/[0.02] text-white/28 hover:text-white/55 hover:border-white/18'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
