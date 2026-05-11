import React, { useCallback, useRef } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import type { BackgroundType, SectionBackground } from '../../types/portfolio';

const BG_TYPES: { key: BackgroundType; label: string }[] = [
  { key: 'inherit', label: 'Theme' },
  { key: 'solid',   label: 'Solid' },
  { key: 'gradient',label: 'Gradient' },
  { key: 'image',   label: 'Image' },
  { key: 'mesh',    label: 'Mesh' },
];

const MESH_PRESETS = [
  { key: 'aurora',  label: 'Aurora',  colors: ['#1e3a5f','#1a3c2b','#3c1a1a'] },
  { key: 'sunset',  label: 'Sunset',  colors: ['#3c1a3c','#3c2a1a','#3c1a1a'] },
  { key: 'forest',  label: 'Forest',  colors: ['#0f2b1a','#0a2030','#1a2a0a'] },
];

function ColorSwatch({ color, onChange }: { color: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded border border-white/20 relative overflow-hidden cursor-pointer shrink-0"
        style={{ backgroundColor: color || '#000' }}
      >
        <input
          type="color"
          value={color || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <input
        type="text"
        value={color || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-white/30"
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-white/40">{label}</label>
      {children}
    </div>
  );
}

export function BackgroundPanel({ sectionId }: { sectionId: string }) {
  const section = usePortfolioStore(
    useCallback(s => s.sections.find(sec => sec.id === sectionId), [sectionId])
  );
  const updateBackground = usePortfolioStore(s => s.updateSectionBackground);

  if (!section) return null;
  const bg: SectionBackground = section.background || { type: 'inherit' };

  // Direct update (for type/preset/discrete changes)
  const update = useCallback(
    (patch: Partial<SectionBackground>) => updateBackground(sectionId, patch),
    [sectionId, updateBackground]
  );

  // Debounced update for high-frequency color picker drags (100ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedUpdate = useCallback(
    (patch: Partial<SectionBackground>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateBackground(sectionId, patch), 100);
    },
    [sectionId, updateBackground]
  );

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Background</h3>
        <div className="grid grid-cols-5 gap-1">
          {BG_TYPES.map(t => (
            <button
              key={t.key}
              onClick={() => update({ type: t.key })}
              className={`py-1.5 rounded text-xs font-medium transition-all ${
                bg.type === t.key
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Solid */}
      {bg.type === 'solid' && (
        <div className="space-y-3">
          <Row label="Color">
            <ColorSwatch color={bg.color || '#0a0a0a'} onChange={v => debouncedUpdate({ color: v })} />
          </Row>
          <Row label="Opacity">
            <div className="flex items-center gap-2">
              <input
                type="range" min="0" max="1" step="0.05"
                value={bg.opacity ?? 1}
                onChange={e => update({ opacity: parseFloat(e.target.value) })}
                className="flex-1 accent-white"
              />
              <span className="text-xs text-white/40 w-8 text-right">
                {Math.round((bg.opacity ?? 1) * 100)}%
              </span>
            </div>
          </Row>
        </div>
      )}

      {/* Gradient */}
      {bg.type === 'gradient' && (
        <div className="space-y-3">
          <Row label="From">
            <ColorSwatch color={bg.gradientFrom || '#0a0a0a'} onChange={v => debouncedUpdate({ gradientFrom: v })} />
          </Row>
          <Row label="To">
            <ColorSwatch color={bg.gradientTo || '#1a1a2e'} onChange={v => debouncedUpdate({ gradientTo: v })} />
          </Row>
          <Row label={`Angle: ${bg.gradientAngle ?? 135}°`}>
            <input
              type="range" min="0" max="360" step="5"
              value={bg.gradientAngle ?? 135}
              onChange={e => debouncedUpdate({ gradientAngle: parseInt(e.target.value) })}
              className="w-full accent-white"
            />
          </Row>
        </div>
      )}

      {/* Image */}
      {bg.type === 'image' && (
        <div className="space-y-3">
          <Row label="Image URL">
            <input
              type="text"
              value={bg.imageUrl || ''}
              onChange={e => update({ imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
            />
          </Row>
          <Row label="Size">
            <div className="flex gap-1.5">
              {(['cover', 'contain', 'auto'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => update({ imageSize: s })}
                  className={`flex-1 py-1.5 rounded text-xs border transition-all capitalize ${
                    (bg.imageSize || 'cover') === s
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/4 border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Position">
            <select
              value={bg.imagePosition || 'center'}
              onChange={e => update({ imagePosition: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
            >
              {['center','top','bottom','left','right','top center','bottom center'].map(p => (
                <option key={p} value={p} className="bg-neutral-900">{p}</option>
              ))}
            </select>
          </Row>
          {/* Live preview thumbnail */}
          {bg.imageUrl && (
            <div
              className="w-full h-20 rounded border border-white/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${bg.imageUrl})` }}
            />
          )}
        </div>
      )}

      {/* Mesh */}
      {bg.type === 'mesh' && (
        <div className="space-y-2">
          <h4 className="text-xs text-white/40">Preset</h4>
          <div className="grid grid-cols-3 gap-2">
            {MESH_PRESETS.map(preset => (
              <button
                key={preset.key}
                onClick={() => update({ meshPreset: preset.key })}
                className={`rounded-lg overflow-hidden border transition-all ${
                  bg.meshPreset === preset.key
                    ? 'border-white/40 scale-[1.03]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Color preview */}
                <div
                  className="h-12"
                  style={{
                    background: `radial-gradient(at 0% 0%,${preset.colors[0]} 0px,transparent 60%),radial-gradient(at 100% 100%,${preset.colors[1]} 0px,transparent 60%),radial-gradient(at 50% 50%,${preset.colors[2]} 0px,transparent 60%)`,
                  }}
                />
                <div className="py-1 text-xs text-white/50 text-center">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {bg.type !== 'inherit' && (
        <button
          onClick={() => update({ type: 'inherit' })}
          className="w-full py-1.5 text-xs text-white/30 hover:text-white/60 border border-white/8 hover:border-white/20 rounded transition-colors"
        >
          Reset to theme default
        </button>
      )}
    </div>
  );
}
