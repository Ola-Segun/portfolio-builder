import * as React from 'react';
import * as Select from '@radix-ui/react-select';

interface SelectControlProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}

/**
 * Figma-style custom select control.
 * Compact trigger with consistent 28px height, matching other inputs.
 */
export function SelectControl({ label, value, options, onChange }: SelectControlProps) {
  const current = options.find(o => o.value === value);

  return (
    <div className="group space-y-1">
      <span className="text-[10px] text-white/35 uppercase tracking-[0.06em] font-medium leading-none block">
        {label}
      </span>

      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          className={`w-full flex items-center justify-between gap-1.5
            bg-white/[0.04] border border-white/[0.07] rounded px-2 py-1
            text-[11px] text-white/80 font-mono
            hover:border-white/14 hover:bg-white/[0.06]
            focus:outline-none focus:border-white/28 focus:bg-white/[0.07]
            data-[state=open]:border-white/28 data-[state=open]:bg-white/[0.07]
            transition-all duration-150 cursor-pointer`}
        >
          <Select.Value>
            <span>{current?.label ?? value}</span>
          </Select.Value>
          <Select.Icon className="text-white/30 flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 4.5L6 7.5L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bg-[#1f1f1f] border border-white/[0.10] rounded-lg shadow-2xl overflow-hidden z-50 min-w-[140px]"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {options.map(opt => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className={`flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded-md cursor-pointer outline-none transition-colors
                    data-[highlighted]:bg-white/8
                    ${opt.value === value ? 'text-white font-medium' : 'text-white/60 hover:text-white/80'}`}
                >
                  {opt.value === value && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                  {opt.value !== value && <span className="w-[9px]" />}
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
