import { useState, useCallback } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { ColourControl } from '../controls/ColourControl';
import { SelectControl } from '../controls/SelectControl';
import { CSSValueControl } from '../controls/CSSValueControl';
import { THEME_PRESETS } from '../../themes';
import type { ThemeColors, ThemeComponents, ThemeConfig } from '../../types/portfolio';

// ─── Field definitions ────────────────────────────────────────────────────────

const COLOUR_FIELDS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: 'background',  label: 'Background',   hint: 'Page body color' },
  { key: 'surface',     label: 'Surface',       hint: 'Cards, panels' },
  { key: 'text',        label: 'Text',          hint: 'Primary body copy' },
  { key: 'textMuted',   label: 'Text Muted',    hint: 'Captions, placeholders' },
  { key: 'accent',      label: 'Accent',        hint: 'Buttons, links, highlights' },
  { key: 'accentMuted', label: 'Accent Muted',  hint: 'Tag backgrounds, tints' },
  { key: 'border',      label: 'Border',        hint: 'Dividers, card edges' },
];

const BUTTON_VARIANTS = [
  { label: 'Fill (solid background)',  value: 'fill' },
  { label: 'Outline (transparent + border)', value: 'outline' },
  { label: 'Ghost (no border)',        value: 'ghost' },
  { label: 'Pill (rounded + fill)',    value: 'pill' },
];

const HEADING_FONT_STYLES = [
  { label: 'Normal', value: 'normal' },
  { label: 'Italic',  value: 'italic' },
];

const DIVIDER_STYLES = [
  { label: 'Solid',  value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pt-3 pb-0.5">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[10px] font-semibold tracking-widest text-white/30 uppercase whitespace-nowrap">
          {title}
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>
      {subtitle && (
        <p className="text-[10px] text-white/22 text-center mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Collapsible accordion block ──────────────────────────────────────────────

function TokenBlock({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/7 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white/3 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm opacity-60">{icon}</span>
          <span className="text-xs font-medium text-white/65">{title}</span>
        </div>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`text-white/25 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-3 pt-2 pb-3 space-y-3 border-t border-white/6 bg-white/[0.012]">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Inline row for 2 controls side by side ───────────────────────────────────

function ControlRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function CustomThemePanel() {
  const theme       = usePortfolioStore(s => s.theme);
  const updateTheme = usePortfolioStore(s => s.updateTheme);
  const isPreset    = THEME_PRESETS.some(t => t.id === theme.id);

  // ── Granular update helpers ───────────────────────────────────────────────

  /** Update a single color. Marks theme as custom (id='custom') only if it
   *  was already custom — preserves preset-id so the toolbar stays in sync. */
  const updateColor = useCallback((key: keyof ThemeColors, hex: string) => {
    updateTheme({ ...theme, colors: { ...theme.colors, [key]: hex } });
  }, [theme, updateTheme]);

  /** Update a single component token key inside a component block.
   *  Merges shallowly so other token keys in the same block are preserved. */
  const updateToken = useCallback(<K extends keyof ThemeComponents>(
    block: K,
    key: keyof NonNullable<ThemeComponents[K]>,
    value: string,
  ) => {
    updateTheme({
      ...theme,
      components: {
        ...theme.components,
        [block]: {
          ...(theme.components?.[block] as object ?? {}),
          [key]: value,
        },
      },
    });
  }, [theme, updateTheme]);

  const setName = useCallback((name: string) => {
    // Renaming forces id → 'custom' so it desyncs from presets
    updateTheme({ ...theme, id: 'custom', name });
  }, [theme, updateTheme]);

  const resetToPreset = useCallback(() => {
    const preset = THEME_PRESETS.find(t => t.id === theme.id);
    if (preset) updateTheme(preset);
  }, [theme, updateTheme]);

  /** Create a blank custom theme from scratch */
  const newCustomTheme = useCallback(() => {
    const custom: ThemeConfig = {
      id: 'custom',
      name: 'My Custom Theme',
      style: 'minimal',
      darkMode: false,
      colors: {
        background: '#ffffff',
        surface:    '#f5f5f5',
        text:       '#111111',
        textMuted:  '#6b6b6b',
        accent:     '#000000',
        accentMuted:'#e5e5e5',
        border:     '#e5e5e5',
      },
      components: {
        button:  { radius:'4px', variant:'fill', letterSpacing:'0.02em',
                   textTransform:'none', padding:'0.85rem 1.75rem',
                   fontSize:'0.875rem', fontWeight:500, shadow:'none' },
        card:    { radius:'8px', shadow:'0 2px 12px rgba(0,0,0,0.06)',
                   border:'1px solid var(--border)', background:'var(--surface)',
                   hoverTransform:'translateY(-3px)',
                   hoverShadow:'0 8px 32px rgba(0,0,0,0.1)', padding:'1.5rem' },
        tag:     { radius:'4px', padding:'0.25rem 0.6rem', fontSize:'0.7rem',
                   letterSpacing:'0.04em', textTransform:'none', border:'none',
                   background:'var(--accent-muted)', color:'var(--accent)' },
        heading: { letterSpacing:'-0.03em', lineHeight:'1.05',
                   textTransform:'none', fontStyle:'normal' },
        divider: { style:'solid', opacity:'0.2', thickness:'1px' },
        input:   { radius:'6px', border:'1px solid var(--border)',
                   background:'var(--surface)',
                   focusBorder:'1px solid var(--accent)', padding:'0.75rem 1rem' },
        surface: { backdropFilter:'blur(12px)' },
        image: {
          radius: '0px', objectFit: 'cover', aspectRatio: 'auto',
          border: 'none', shadow: 'none', filter: 'none',
          hoverFilter: 'none', hoverTransform: 'scale(1.02)', transition: '0.4s ease',
        },
      },
    };
    updateTheme(custom);
  }, [updateTheme]);

  // Convenient shorthand for current component block values
  const c = theme.components ?? {};
  const btn     = c.button  ?? {};
  const card    = c.card    ?? {};
  const tag     = c.tag     ?? {};
  const heading = c.heading ?? {};
  const divider = c.divider ?? {};
  const input   = c.input   ?? {};
  const surf    = c.surface ?? {};
  const img     = c.image   ?? {};

  return (
    <div className="space-y-3">

      {/* ── Status / Actions ────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2 bg-white/4 rounded-lg p-3 border border-white/6">
        <p className="text-[10px] text-white/40 leading-relaxed">
          {isPreset
            ? `Editing "${theme.name}" preset — changes apply live.`
            : theme.id === 'custom'
              ? 'Custom theme — all fields are editable.'
              : `Custom theme "${theme.name}"`}
        </p>
        <div className="flex flex-col gap-1.5 shrink-0">
          {isPreset && (
            <button
              onClick={resetToPreset}
              className="text-[10px] text-white/35 hover:text-white/65 underline underline-offset-2 transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
          <button
            onClick={newCustomTheme}
            className="text-[10px] text-white/35 hover:text-white/65 underline underline-offset-2 transition-colors whitespace-nowrap"
          >
            New blank
          </button>
        </div>
      </div>

      {/* Theme name */}
      <CSSValueControl
        label="Theme Name"
        value={theme.name}
        onChange={setName}
        placeholder="My Custom Theme"
      />

      {/* ── COLORS ──────────────────────────────────────────────────── */}
      <SectionHeader title="Colors" subtitle="Global palette" />
      <div className="space-y-2">
        {COLOUR_FIELDS.map(({ key, label, hint }) => (
          <ColourControl
            key={key}
            label={`${label} — ${hint}`}
            value={theme.colors[key]}
            onChange={hex => updateColor(key, hex)}
          />
        ))}
      </div>

      {/* ── COMPONENT TOKENS ────────────────────────────────────────── */}
      <SectionHeader title="Component Tokens" subtitle="Per-element design language" />
      <div className="space-y-2">

        {/* ── Buttons ──────────────────────────────────────────────── */}
        <TokenBlock title="Buttons" icon="◉" defaultOpen>
          <SelectControl
            label="Variant"
            value={btn.variant ?? 'fill'}
            options={BUTTON_VARIANTS}
            onChange={v => updateToken('button', 'variant', v)}
          />
          <ControlRow>
            <CSSValueControl
              label="Border Radius"
              value={btn.radius ?? '4px'}
              onChange={v => updateToken('button', 'radius', v)}
              presets={['0px','4px','8px','12px','999px']}
            />
            <CSSValueControl
              label="Font Size"
              value={btn.fontSize ?? '0.875rem'}
              onChange={v => updateToken('button', 'fontSize', v)}
              presets={['0.75rem','0.875rem','1rem']}
            />
          </ControlRow>
          <ControlRow>
            <CSSValueControl
              label="Font Weight"
              value={String(btn.fontWeight ?? 500)}
              onChange={v => updateToken('button', 'fontWeight', v)}
              presets={['400','500','600','700']}
            />
            <CSSValueControl
              label="Letter Spacing"
              value={btn.letterSpacing ?? '0.02em'}
              onChange={v => updateToken('button', 'letterSpacing', v)}
              presets={['0','0.04em','0.08em','0.12em']}
            />
          </ControlRow>
          <CSSValueControl
            label="Text Transform"
            value={btn.textTransform ?? 'none'}
            onChange={v => updateToken('button', 'textTransform', v)}
            presets={['none','uppercase','lowercase','capitalize']}
          />
          <CSSValueControl
            label="Padding"
            value={btn.padding ?? '0.85rem 1.75rem'}
            onChange={v => updateToken('button', 'padding', v)}
            hint="vertical horizontal"
            presets={['0.6rem 1.25rem','0.85rem 1.75rem','1rem 2.2rem']}
          />
          <CSSValueControl
            label="Hover Shadow"
            value={btn.shadow ?? 'none'}
            onChange={v => updateToken('button', 'shadow', v)}
            hint="box-shadow value"
            presets={['none']}
          />
        </TokenBlock>

        {/* ── Cards ─────────────────────────────────────────────────── */}
        <TokenBlock title="Cards" icon="▭">
          <ControlRow>
            <CSSValueControl
              label="Border Radius"
              value={card.radius ?? '8px'}
              onChange={v => updateToken('card', 'radius', v)}
              presets={['0px','4px','8px','12px','20px']}
            />
            <CSSValueControl
              label="Padding"
              value={card.padding ?? '1.5rem'}
              onChange={v => updateToken('card', 'padding', v)}
              presets={['1rem','1.5rem','2rem']}
            />
          </ControlRow>
          <CSSValueControl
            label="Border"
            value={card.border ?? '1px solid var(--border)'}
            onChange={v => updateToken('card', 'border', v)}
            presets={['none','1px solid var(--border)']}
          />
          <CSSValueControl
            label="Box Shadow"
            value={card.shadow ?? 'none'}
            onChange={v => updateToken('card', 'shadow', v)}
            hint="CSS box-shadow"
            presets={['none','0 2px 12px rgba(0,0,0,0.08)']}
          />
          <CSSValueControl
            label="Hover Transform"
            value={card.hoverTransform ?? 'translateY(-3px)'}
            onChange={v => updateToken('card', 'hoverTransform', v)}
            presets={['none','translateY(-3px)','translateY(-6px)']}
          />
          <CSSValueControl
            label="Hover Shadow"
            value={card.hoverShadow ?? 'none'}
            onChange={v => updateToken('card', 'hoverShadow', v)}
            presets={['none','0 8px 32px rgba(0,0,0,0.12)']}
          />
        </TokenBlock>

        {/* ── Tags & Badges ─────────────────────────────────────────── */}
        <TokenBlock title="Tags & Badges" icon="⬡">
          <ControlRow>
            <CSSValueControl
              label="Border Radius"
              value={tag.radius ?? '4px'}
              onChange={v => updateToken('tag', 'radius', v)}
              presets={['0px','4px','999px']}
            />
            <CSSValueControl
              label="Padding"
              value={tag.padding ?? '0.25rem 0.6rem'}
              onChange={v => updateToken('tag', 'padding', v)}
              presets={['0.2rem 0.5rem','0.3rem 0.75rem']}
            />
          </ControlRow>
          <ControlRow>
            <CSSValueControl
              label="Font Size"
              value={tag.fontSize ?? '0.7rem'}
              onChange={v => updateToken('tag', 'fontSize', v)}
              presets={['0.65rem','0.7rem','0.75rem']}
            />
            <CSSValueControl
              label="Letter Spacing"
              value={tag.letterSpacing ?? '0.04em'}
              onChange={v => updateToken('tag', 'letterSpacing', v)}
              presets={['0','0.04em','0.1em']}
            />
          </ControlRow>
          <CSSValueControl
            label="Text Transform"
            value={tag.textTransform ?? 'none'}
            onChange={v => updateToken('tag', 'textTransform', v)}
            presets={['none','uppercase']}
          />
          <CSSValueControl
            label="Border"
            value={tag.border ?? 'none'}
            onChange={v => updateToken('tag', 'border', v)}
            presets={['none','1px solid var(--border)','1px solid var(--accent)']}
          />
          <ControlRow>
            <CSSValueControl
              label="Background"
              value={tag.background ?? 'var(--accent-muted)'}
              onChange={v => updateToken('tag', 'background', v)}
            />
            <CSSValueControl
              label="Color"
              value={tag.color ?? 'var(--accent)'}
              onChange={v => updateToken('tag', 'color', v)}
            />
          </ControlRow>
        </TokenBlock>

        {/* ── Headings ──────────────────────────────────────────────── */}
        <TokenBlock title="Headings" icon="T">
          <ControlRow>
            <CSSValueControl
              label="Letter Spacing"
              value={heading.letterSpacing ?? '-0.03em'}
              onChange={v => updateToken('heading', 'letterSpacing', v)}
              presets={['-0.04em','-0.02em','0','0.04em']}
            />
            <CSSValueControl
              label="Line Height"
              value={heading.lineHeight ?? '1.05'}
              onChange={v => updateToken('heading', 'lineHeight', v)}
              presets={['0.95','1.0','1.1','1.2']}
            />
          </ControlRow>
          <ControlRow>
            <CSSValueControl
              label="Text Transform"
              value={heading.textTransform ?? 'none'}
              onChange={v => updateToken('heading', 'textTransform', v)}
              presets={['none','uppercase']}
            />
            <SelectControl
              label="Font Style"
              value={heading.fontStyle ?? 'normal'}
              options={HEADING_FONT_STYLES}
              onChange={v => updateToken('heading', 'fontStyle', v)}
            />
          </ControlRow>
        </TokenBlock>

        {/* ── Form Inputs ───────────────────────────────────────────── */}
        <TokenBlock title="Form Inputs" icon="▬">
          <ControlRow>
            <CSSValueControl
              label="Border Radius"
              value={input.radius ?? '6px'}
              onChange={v => updateToken('input', 'radius', v)}
              presets={['0px','4px','6px','8px','12px','999px']}
            />
            <CSSValueControl
              label="Padding"
              value={input.padding ?? '0.75rem 1rem'}
              onChange={v => updateToken('input', 'padding', v)}
            />
          </ControlRow>
          <CSSValueControl
            label="Border"
            value={input.border ?? '1px solid var(--border)'}
            onChange={v => updateToken('input', 'border', v)}
            presets={['none','1px solid var(--border)','2px solid var(--border)']}
          />
          <CSSValueControl
            label="Focus Border"
            value={input.focusBorder ?? '1px solid var(--accent)'}
            onChange={v => updateToken('input', 'focusBorder', v)}
            hint="Border on :focus"
            presets={['2px solid var(--accent)','1px solid var(--accent)']}
          />
          <CSSValueControl
            label="Background"
            value={input.background ?? 'var(--surface)'}
            onChange={v => updateToken('input', 'background', v)}
            presets={['var(--surface)','transparent','var(--bg)']}
          />
        </TokenBlock>

        {/* ── Dividers ──────────────────────────────────────────────── */}
        <TokenBlock title="Dividers / HR" icon="—">
          <SelectControl
            label="Style"
            value={divider.style ?? 'solid'}
            options={DIVIDER_STYLES}
            onChange={v => updateToken('divider', 'style', v)}
          />
          <ControlRow>
            <CSSValueControl
              label="Thickness"
              value={divider.thickness ?? '1px'}
              onChange={v => updateToken('divider', 'thickness', v)}
              presets={['1px','2px']}
            />
            <CSSValueControl
              label="Opacity"
              value={divider.opacity ?? '0.2'}
              onChange={v => updateToken('divider', 'opacity', v)}
              presets={['0.1','0.2','0.4','1']}
            />
          </ControlRow>
        </TokenBlock>

        {/* ── Images & Media ────────────────────────────────────────── */}
        <TokenBlock title="Images & Media" icon="🖼">
          <ControlRow>
            <CSSValueControl
              label="Border Radius"
              value={img.radius ?? '0px'}
              onChange={v => updateToken('image', 'radius', v)}
              presets={['0px','4px','8px','12px','16px','999px']}
            />
            <SelectControl
              label="Object Fit"
              value={img.objectFit ?? 'cover'}
              options={[
                { label: 'Cover (fill)', value: 'cover' },
                { label: 'Contain',      value: 'contain' },
                { label: 'Fill',         value: 'fill' },
              ]}
              onChange={v => updateToken('image', 'objectFit', v)}
            />
          </ControlRow>
          <CSSValueControl
            label="CSS Filter"
            value={img.filter ?? 'none'}
            onChange={v => updateToken('image', 'filter', v)}
            hint="Applied at rest — grayscale, saturate, etc."
            presets={['none','grayscale(100%)','grayscale(30%) contrast(1.05)','saturate(1.2)','sepia(20%) brightness(0.9)']}
          />
          <CSSValueControl
            label="Hover Filter"
            value={img.hoverFilter ?? 'none'}
            onChange={v => updateToken('image', 'hoverFilter', v)}
            hint="Applied on image hover"
            presets={['none','grayscale(0%)','saturate(1.4) brightness(1.05)','brightness(1.05)']}
          />
          <CSSValueControl
            label="Hover Transform"
            value={img.hoverTransform ?? 'scale(1.02)'}
            onChange={v => updateToken('image', 'hoverTransform', v)}
            presets={['none','scale(1.02)','scale(1.04)','scale(1.03) rotate(-0.5deg)']}
          />
          <CSSValueControl
            label="Border"
            value={img.border ?? 'none'}
            onChange={v => updateToken('image', 'border', v)}
            presets={['none','1px solid var(--border)','2px solid var(--accent)']}
          />
          <CSSValueControl
            label="Box Shadow"
            value={img.shadow ?? 'none'}
            onChange={v => updateToken('image', 'shadow', v)}
            presets={['none','0 2px 12px rgba(0,0,0,0.08)','0 8px 24px rgba(0,0,0,0.14)']}
          />
          <CSSValueControl
            label="Transition"
            value={img.transition ?? '0.4s ease'}
            onChange={v => updateToken('image', 'transition', v)}
            presets={['0.2s ease','0.4s ease','0.45s cubic-bezier(0.34,1.56,0.64,1)']}
          />
        </TokenBlock>

        {/* ── Glass / Surface ───────────────────────────────────────── */}
        <TokenBlock title="Glass Surface" icon="◈">
          <CSSValueControl
            label="Backdrop Filter"
            value={surf.backdropFilter ?? 'blur(12px)'}
            onChange={v => updateToken('surface', 'backdropFilter', v)}
            hint="Applied to .card-glass"
            presets={['none','blur(8px)','blur(12px)','blur(20px) saturate(1.4)']}
          />
        </TokenBlock>

      </div>{/* /tokens */}

      {/* ── COPY TOKEN CSS ──────────────────────────────────────────── */}
      <SectionHeader title="CSS Variables" subtitle="Available in custom HTML sections" />
      <div className="bg-white/3 rounded-lg border border-white/6 p-3">
        <p className="text-[10px] text-white/30 leading-relaxed mb-2">
          All tokens are exposed as CSS custom properties in the preview and export:
        </p>
        <div className="space-y-0.5 font-mono text-[9px] text-white/25 leading-loose">
          {[
            '--btn-radius', '--btn-shadow', '--btn-padding',
            '--card-radius', '--card-shadow', '--card-border',
            '--tag-radius', '--tag-bg', '--tag-color',
            '--heading-letter-spacing', '--heading-line-height',
            '--input-radius', '--input-border', '--input-focus-border',
            '--divider-style', '--surface-backdrop',
            '--img-radius', '--img-filter', '--img-hover-filter',
            '--img-border', '--img-shadow', '--img-hover-transform',
          ].map(v => (
            <div key={v}>{v}</div>
          ))}
        </div>
      </div>

    </div>
  );
}
