import * as React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

/**
 * Figma-style slider control.
 * – 2 px track with styled thumb
 * – Label is draggable to scrub (like Figma's numeric inputs)
 * – Editable numeric input on the right
 */
export function SliderControl({
  label,
  value,
  min,
  max,
  step = 0.01,
  unit = '',
  format,
  onChange,
}: SliderControlProps) {
  const display = format ? format(value) : `${Math.round(value * 100) / 100}${unit}`;

  // Scrub on label
  const scrubRef  = React.useRef(false);
  const scrubData = React.useRef({ startX: 0, startVal: 0 });

  function onLabelMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    scrubRef.current  = true;
    scrubData.current = { startX: e.clientX, startVal: value };
    document.body.style.cursor    = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  React.useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!scrubRef.current) return;
      const { startX, startVal } = scrubData.current;
      const range   = max - min;
      const pxRange = 200; // 200px drag = full range
      const delta   = ((e.clientX - startX) / pxRange) * range;
      const next    = Math.min(max, Math.max(min, startVal + delta));
      const snapped = Math.round(next / step) * step;
      onChange(Math.round(snapped * 10000) / 10000);
    }
    function onUp() {
      if (!scrubRef.current) return;
      scrubRef.current = false;
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [min, max, step, onChange]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          onMouseDown={onLabelMouseDown}
          className="text-[10px] text-white/35 uppercase tracking-[0.06em] font-medium leading-none cursor-ew-resize select-none hover:text-white/60 transition-colors"
          title="Drag to scrub"
        >
          {label}
        </span>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="w-14 bg-white/[0.04] border border-white/[0.07] rounded px-1.5 py-0.5
            text-right text-[10px] font-mono text-white/75
            focus:outline-none focus:border-white/28 transition-colors"
        />
      </div>

      {/* Track */}
      <div className="relative h-4 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-full h-0.5 rounded-full appearance-none cursor-pointer
            bg-white/10 accent-white
            [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
        {/* Progress fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/60 rounded-full pointer-events-none"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
    </div>
  );
}
