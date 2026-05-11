import React from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { SliderControl } from '../controls/SliderControl';
import { ToggleControl } from '../controls/ToggleControl';
import { SelectControl } from '../controls/SelectControl';

const BLEND_MODES = [
  { label: 'Difference', value: 'difference' },
  { label: 'Exclusion', value: 'exclusion' },
  { label: 'Multiply', value: 'multiply' },
  { label: 'Screen', value: 'screen' },
  { label: 'Normal', value: 'normal' },
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

export function EffectsPanel() {
  const webgl         = usePortfolioStore(s => s.webgl);
  const cursor        = usePortfolioStore(s => s.cursor);
  const animation     = usePortfolioStore(s => s.animation);
  const updateWebGL   = usePortfolioStore(s => s.updateWebGL);
  const updateCursor  = usePortfolioStore(s => s.updateCursor);
  const updateLenis   = usePortfolioStore(s => s.updateLenisConfig);

  return (
    <div className="space-y-5">

      {/* ── WebGL Background ─────────────────────────────────── */}
      <FieldGroup label="WebGL Background">
        <ToggleControl
          label="Enable WebGL"
          value={webgl.enabled}
          onChange={v => updateWebGL({ enabled: v })}
          description="Animated GLSL mesh that reacts to cursor and scroll"
        />

        {webgl.enabled && (
          <>
            <SliderControl
              label="Opacity"
              value={webgl.opacity}
              min={0}
              max={1}
              step={0.05}
              format={v => `${Math.round(v * 100)}%`}
              onChange={v => updateWebGL({ opacity: v })}
            />
            <SliderControl
              label="Distortion"
              value={(webgl.uniforms?.uDistortion as number) ?? 0.3}
              min={0}
              max={1}
              step={0.05}
              format={v => v.toFixed(2)}
              onChange={v => updateWebGL({ uniforms: { ...webgl.uniforms, uDistortion: v } })}
            />
          </>
        )}
      </FieldGroup>

      {/* ── Custom Cursor ────────────────────────────────────── */}
      <FieldGroup label="Custom Cursor">
        <ToggleControl
          label="Enable Custom Cursor"
          value={cursor.enabled}
          onChange={v => updateCursor({ enabled: v })}
          description="Replaces the default OS cursor (desktop only)"
        />

        {cursor.enabled && (
          <>
            <SliderControl
              label="Inner Dot Size"
              value={cursor.innerSize}
              min={4}
              max={20}
              step={1}
              format={v => `${v}px`}
              onChange={v => updateCursor({ innerSize: v })}
            />
            <SliderControl
              label="Outer Ring Size"
              value={cursor.outerSize}
              min={16}
              max={64}
              step={2}
              format={v => `${v}px`}
              onChange={v => updateCursor({ outerSize: v })}
            />
            <SliderControl
              label="Ring Follow Speed"
              value={cursor.lerpOuter}
              min={0.05}
              max={0.6}
              step={0.01}
              format={v => v.toFixed(2)}
              onChange={v => updateCursor({ lerpOuter: v })}
            />
            <SelectControl
              label="Blend Mode"
              value={cursor.blendMode}
              options={BLEND_MODES}
              onChange={v => updateCursor({ blendMode: v })}
            />
          </>
        )}
      </FieldGroup>

      {/* ── Smooth Scroll (Lenis) ────────────────────────────── */}
      <FieldGroup label="Smooth Scroll">
        <ToggleControl
          label="Smooth Scrolling"
          value={animation.lenis.smoothWheel}
          onChange={v => updateLenis({ smoothWheel: v })}
          description="Lenis inertia-based smooth scrolling"
        />
        {animation.lenis.smoothWheel && (
          <>
            <SliderControl
              label="Lerp (Inertia)"
              value={animation.lenis.lerp}
              min={0.02}
              max={0.25}
              step={0.01}
              format={v => v.toFixed(2)}
              onChange={v => updateLenis({ lerp: v })}
            />
            <SliderControl
              label="Wheel Multiplier"
              value={animation.lenis.wheelMultiplier}
              min={0.5}
              max={3}
              step={0.1}
              format={v => `${v.toFixed(1)}×`}
              onChange={v => updateLenis({ wheelMultiplier: v })}
            />
          </>
        )}
      </FieldGroup>

    </div>
  );
}
