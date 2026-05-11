import { useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import * as Popover from '@radix-ui/react-popover';

const FEATURED_FONTS = {
  display: [
    'Playfair Display', 'DM Serif Display', 'Fraunces', 'Cormorant Garamond',
    'Bodoni Moda', 'Big Shoulders Display', 'Unbounded', 'Space Grotesk', 'Syne',
  ],
  body: [
    'Inter', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Manrope', 'General Sans',
  ],
};

export function FontPicker() {
  const { typography, updateTypography } = usePortfolioStore();
  const [displayOpen, setDisplayOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Heading font picker */}
      <Popover.Root open={displayOpen} onOpenChange={setDisplayOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs hover:bg-white/10">
            <span style={{ fontFamily: typography.headingFont }}>
              {typography.headingFont.split(' ')[0]}
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-neutral-800 border border-white/10 rounded shadow-lg p-2 z-50 w-64 max-h-80 overflow-y-auto">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Display Fonts</div>
            {FEATURED_FONTS.display.map(font => (
              <button
                key={font}
                onClick={() => {
                  updateTypography({ headingFont: font });
                  setDisplayOpen(false);
                }}
                className={`w-full text-left px-2 py-1 rounded text-sm mb-1 ${
                  typography.headingFont === font ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Body font picker */}
      <Popover.Root open={bodyOpen} onOpenChange={setBodyOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs hover:bg-white/10">
            <span style={{ fontFamily: typography.bodyFont }}>{typography.bodyFont.split(' ')[0]}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="bg-neutral-800 border border-white/10 rounded shadow-lg p-2 z-50 w-64 max-h-80 overflow-y-auto">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Body Fonts</div>
            {FEATURED_FONTS.body.map(font => (
              <button
                key={font}
                onClick={() => {
                  updateTypography({ bodyFont: font });
                  setBodyOpen(false);
                }}
                className={`w-full text-left px-2 py-1 rounded text-sm mb-1 ${
                  typography.bodyFont === font ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
