import * as React from 'react';

interface ToggleControlProps {
  label: string;
  value?: boolean;
  checked?: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}

/**
 * Figma-style compact pill toggle.
 * 28 × 16 px, 12 × 12 px thumb, 150 ms ease transition.
 */
export function ToggleControl({ label, value, checked, onChange, description }: ToggleControlProps) {
  const isOn = value ?? checked ?? false;
  return (
    <div className="flex items-center justify-between gap-3 min-h-[28px]">
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-white/38 uppercase tracking-[0.06em] font-medium leading-none block">
          {label}
        </span>
        {description && (
          <span className="text-[9px] text-white/22 mt-0.5 leading-relaxed block">{description}</span>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={() => onChange(!isOn)}
        className={`relative flex-shrink-0 rounded-full transition-colors duration-150 outline-none
          focus-visible:ring-1 focus-visible:ring-white/40
          ${isOn ? 'bg-white' : 'bg-white/18'}`}
        style={{ width: 28, height: 16 }}
      >
        <span
          className={`absolute top-[2px] rounded-full bg-[#141414] shadow-sm transition-transform duration-150`}
          style={{
            width: 12,
            height: 12,
            left: 2,
            transform: isOn ? 'translateX(12px)' : 'translateX(0px)',
          }}
        />
      </button>
    </div>
  );
}
