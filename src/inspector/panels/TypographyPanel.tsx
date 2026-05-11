import React from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { SliderControl } from '../controls/SliderControl';
import { SelectControl } from '../controls/SelectControl';
import { TextControl } from '../controls/TextControl';

const FONT_OPTIONS = [
  // Serif
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Libre Baskerville', value: 'Libre Baskerville' },
  { label: 'EB Garamond', value: 'EB Garamond' },
  { label: 'Lora', value: 'Lora' },
  // Sans-serif
  { label: 'Inter', value: 'Inter' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Geist', value: 'Geist' },
  { label: 'Satoshi', value: 'Satoshi' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Syne', value: 'Syne' },
  // Monospace
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
  { label: 'Fira Code', value: 'Fira Code' },
];

const HEADING_WEIGHTS = [
  { label: '100 Thin', value: '100' },
  { label: '200 ExtraLight', value: '200' },
  { label: '300 Light', value: '300' },
  { label: '400 Regular', value: '400' },
  { label: '500 Medium', value: '500' },
  { label: '600 SemiBold', value: '600' },
  { label: '700 Bold', value: '700' },
  { label: '800 ExtraBold', value: '800' },
  { label: '900 Black', value: '900' },
];

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider pt-3 border-t border-white/8 first:border-0 first:pt-0">
        {label}
      </h3>
      {children}
    </div>
  );
}

export function TypographyPanel() {
  const typography = usePortfolioStore(s => s.typography);
  const updateTypography = usePortfolioStore(s => s.updateTypography);

  return (
    <div className="space-y-5">

      {/* ── Fonts ──────────────────────────────────────────── */}
      <FieldGroup label="Fonts">
        <SelectControl
          label="Heading Font"
          value={typography.headingFont}
          options={FONT_OPTIONS}
          onChange={v => updateTypography({ headingFont: v })}
        />
        <SelectControl
          label="Heading Weight"
          value={String(typography.headingWeight)}
          options={HEADING_WEIGHTS}
          onChange={v => updateTypography({ headingWeight: Number(v) })}
        />
        <SelectControl
          label="Body Font"
          value={typography.bodyFont}
          options={FONT_OPTIONS}
          onChange={v => updateTypography({ bodyFont: v })}
        />
      </FieldGroup>

      {/* ── Scale ──────────────────────────────────────────── */}
      <FieldGroup label="Scale">
        <SliderControl
          label="Base Font Size"
          value={typography.baseSize}
          min={0.75}
          max={1.5}
          step={0.05}
          format={v => `${v.toFixed(2)}rem`}
          onChange={v => updateTypography({ baseSize: v })}
        />
        <SliderControl
          label="Line Height"
          value={typography.lineHeight}
          min={1.0}
          max={2.2}
          step={0.05}
          format={v => v.toFixed(2)}
          onChange={v => updateTypography({ lineHeight: v })}
        />
        <SliderControl
          label="Letter Spacing"
          value={typography.letterSpacing}
          min={-0.05}
          max={0.2}
          step={0.005}
          format={v => `${v.toFixed(3)}em`}
          onChange={v => updateTypography({ letterSpacing: v })}
        />
      </FieldGroup>

      {/* ── Live preview ───────────────────────────────────── */}
      <FieldGroup label="Preview">
        <div
          className="rounded-lg bg-white/4 p-4 border border-white/8"
          style={{
            fontFamily: `'${typography.headingFont}', serif`,
            lineHeight: typography.lineHeight,
            letterSpacing: `${typography.letterSpacing}em`,
          }}
        >
          <div
            style={{
              fontWeight: typography.headingWeight,
              fontSize: `clamp(1.1rem, 2vw, 1.4rem)`,
              marginBottom: '0.5rem',
            }}
          >
            The quick brown fox
          </div>
          <div
            style={{
              fontFamily: `'${typography.bodyFont}', sans-serif`,
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 400,
            }}
          >
            Jumps over the lazy dog. Typography sets the rhythm and voice of your portfolio.
          </div>
        </div>
      </FieldGroup>

    </div>
  );
}
