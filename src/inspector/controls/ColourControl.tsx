import * as React from 'react';
import { SketchPicker } from 'react-color';
import type { ColorResult } from 'react-color';

interface ColourControlProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

/**
 * Figma-style compact colour control.
 * – Compact 28px trigger: swatch | hex value
 * – Popover uses fixed positioning to avoid panel overflow clipping
 */
export function ColourControl({ label, value, onChange }: ColourControlProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const pickerRef  = React.useRef<HTMLDivElement>(null);
  const [popPos, setPopPos] = React.useState({ top: 0, left: 0 });

  function openPicker() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position below trigger, prefer left-aligned
      const top  = rect.bottom + 6;
      const left = Math.min(rect.left, window.innerWidth - 240);
      setPopPos({ top, left });
    }
    setShowPicker(true);
  }

  // Close on outside click
  React.useEffect(() => {
    if (!showPicker) return;
    function handle(e: MouseEvent) {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showPicker]);

  return (
    <div className="group space-y-1">
      <span className="text-[10px] text-white/35 uppercase tracking-[0.06em] font-medium leading-none block">
        {label}
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={showPicker ? () => setShowPicker(false) : openPicker}
        className={`w-full flex items-center gap-2 bg-white/[0.04] border rounded px-2 py-1 text-left
          transition-all duration-150 outline-none
          ${showPicker
            ? 'border-white/28 bg-white/[0.07]'
            : 'border-white/[0.07] hover:border-white/14 hover:bg-white/[0.06]'
          }`}
        aria-label={`Pick colour for ${label}`}
      >
        {/* Swatch */}
        <span
          className="w-3.5 h-3.5 rounded-sm border border-white/15 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        {/* Hex */}
        <span className="font-mono text-[11px] text-white/75 uppercase tracking-wider">
          {value.toUpperCase()}
        </span>
      </button>

      {/* Fixed-position popover */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="fixed z-[9999]"
          style={{ top: popPos.top, left: popPos.left }}
        >
          <div className="shadow-2xl rounded-xl overflow-hidden border border-white/10"
            style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))' }}>
            <SketchPicker
              color={value}
              onChangeComplete={(c: ColorResult) => onChange(c.hex)}
              disableAlpha
              styles={{
                default: {
                  picker: {
                    background: '#1a1a1a',
                    boxShadow: 'none',
                    borderRadius: '0',
                    fontFamily: 'inherit',
                    width: '220px',
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
