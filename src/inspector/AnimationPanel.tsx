import { usePortfolioStore } from '../store/portfolioStore';
import { SelectControl } from './controls/SelectControl';
import { SliderControl } from './controls/SliderControl';
import { ToggleControl } from './controls/ToggleControl';
import { bridge } from '../preview/PreviewBridge';
import { useRef } from 'react';

const ANIMATION_PRESETS = [
  { label: 'Character Rise', value: 'char-rise' },
  { label: 'Clip Reveal', value: 'clip-reveal' },
  { label: 'Fade Up', value: 'fade-up' },
  { label: 'Scale In', value: 'scale-in' },
  { label: 'Wipe Right', value: 'wipe-right' },
  { label: 'None', value: 'none' },
];

const EASE_OPTIONS = [
  { label: 'Power1 Out', value: 'power1.out' },
  { label: 'Power2 Out', value: 'power2.out' },
  { label: 'Power3 Out', value: 'power3.out' },
  { label: 'Power4 Out', value: 'power4.out' },
  { label: 'Power2 InOut', value: 'power2.inOut' },
  { label: 'Power3 InOut', value: 'power3.inOut' },
  { label: 'Back Out', value: 'back.out(1.7)' },
  { label: 'Circ Out', value: 'circ.out' },
  { label: 'Expo Out', value: 'expo.out' },
  { label: 'Elastic Out', value: 'elastic.out(1, 0.4)' },
  { label: 'Linear', value: 'linear' },
];

const TRIGGER_STARTS = [
  { label: 'Top of screen', value: 'top top' },
  { label: '10% from top', value: 'top 90%' },
  { label: '20% from top', value: 'top 80%' },
  { label: '30% from top', value: 'top 70%' },
  { label: '40% from top', value: 'top 60%' },
  { label: '50% from top', value: 'top 50%' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider pt-4 border-t border-white/8 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}

export function AnimationPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionAnimation } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const animation = section.animation;
  const scrubRef = useRef<HTMLInputElement>(null);

  const update = (patch: Parameters<typeof updateSectionAnimation>[1]) =>
    updateSectionAnimation(sectionId, patch);

  return (
    <div className="space-y-4">

      {/* ── Entrance Preset ─────────────────────────────── */}
      <SectionLabel>Entrance</SectionLabel>

      <SelectControl
        label="Preset"
        value={animation.preset}
        options={ANIMATION_PRESETS}
        onChange={preset => update({ preset: preset as typeof animation.preset })}
      />

      {animation.preset !== 'none' && (
        <>
          <SliderControl
            label="Duration"
            value={animation.duration}
            min={0.1}
            max={3}
            step={0.05}
            format={v => `${v.toFixed(2)}s`}
            onChange={duration => update({ duration })}
          />

          <SliderControl
            label="Stagger"
            value={animation.stagger}
            min={0}
            max={0.3}
            step={0.005}
            format={v => `${(v * 1000).toFixed(0)}ms`}
            onChange={stagger => update({ stagger })}
          />

          <SliderControl
            label="Delay"
            value={animation.delay ?? 0}
            min={0}
            max={2}
            step={0.05}
            format={v => `${v.toFixed(2)}s`}
            onChange={delay => update({ delay })}
          />

          <SelectControl
            label="Easing"
            value={animation.ease}
            options={EASE_OPTIONS}
            onChange={ease => update({ ease })}
          />
        </>
      )}

      {/* ── Preview Scrubber ────────────────────────────── */}
      {animation.preset !== 'none' && (
        <>
          <SectionLabel>Preview</SectionLabel>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-white/40 uppercase tracking-wider">
                Scrub Progress
              </label>
              <span className="text-xs text-white/30 font-mono" id="scrub-readout">0%</span>
            </div>
            <input
              ref={scrubRef}
              type="range"
              min={0}
              max={1}
              step={0.001}
              defaultValue={0}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
              onChange={e => {
                const progress = parseFloat(e.target.value);
                bridge.send({ type: 'ANIMATION_SEEK', sectionId, progress });
                const readout = document.getElementById('scrub-readout');
                if (readout) readout.textContent = `${Math.round(progress * 100)}%`;
              }}
            />
            <p className="text-xs text-white/25 leading-relaxed">
              Drag to preview the entrance animation at any point. Scroll the preview to trigger it live.
            </p>
          </div>
        </>
      )}

      {/* ── Scroll Trigger ──────────────────────────────── */}
      <SectionLabel>Scroll Trigger</SectionLabel>

      <SelectControl
        label="Trigger Start"
        value={animation.scrollTrigger.start}
        options={TRIGGER_STARTS}
        onChange={start => update({ scrollTrigger: { ...animation.scrollTrigger, start } })}
      />

      <ToggleControl
        label="Scrub (Tie to Scroll)"
        value={!!animation.scrollTrigger.scrub}
        onChange={scrub => update({ scrollTrigger: { ...animation.scrollTrigger, scrub } })}
        description="Animation plays forward/backward as you scroll instead of triggering once"
      />

      {animation.scrollTrigger.scrub && (
        <SliderControl
          label="Scrub Smoothing"
          value={typeof animation.scrollTrigger.scrub === 'number' ? animation.scrollTrigger.scrub : 0.5}
          min={0}
          max={2}
          step={0.1}
          format={v => v === 0 ? 'Instant' : `${v.toFixed(1)}s`}
          onChange={val => update({ scrollTrigger: { ...animation.scrollTrigger, scrub: val } })}
        />
      )}

      <ToggleControl
        label="Pin Section"
        value={animation.scrollTrigger.pin}
        onChange={pin => update({ scrollTrigger: { ...animation.scrollTrigger, pin } })}
        description="Keeps section fixed while animation plays"
      />
    </div>
  );
}
