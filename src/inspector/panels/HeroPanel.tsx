import { usePortfolioStore } from '../../store/portfolioStore';
import { TextControl } from '../../inspector/controls/TextControl';
import { ToggleControl } from '../../inspector/controls/ToggleControl';
import type { HeroSectionConfig } from '../../types/portfolio';
import { useUIStore } from '../../store/uiStore';

export function HeroPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionConfig } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const config = section.config as HeroSectionConfig;
  const activeLayout = section.layout || 'default';

  const up = (patch: Partial<HeroSectionConfig>) => updateSectionConfig(sectionId, patch);

  return (
    <div className="space-y-4">
      {/* Eyebrow — centered & fullscreen layouts */}
      {(activeLayout === 'centered' || activeLayout === 'fullscreen' || activeLayout === 'bento') && (
        <TextControl
          label="Eyebrow Label"
          value={config.eyebrow || ''}
          onChange={v => up({ eyebrow: v })}
          placeholder="Designer & Developer"
        />
      )}

      <TextControl
        label="Heading"
        value={config.heading}
        onChange={v => up({ heading: v })}
      />
      <TextControl
        label="Subheading"
        value={config.subheading}
        onChange={v => up({ subheading: v })}
        placeholder="What you do best"
      />
      <TextControl
        label="CTA Text"
        value={config.ctaText}
        onChange={v => up({ ctaText: v })}
        placeholder="View my work"
      />
      <TextControl
        label="CTA Link"
        value={config.ctaLink}
        onChange={v => up({ ctaLink: v })}
        placeholder="#work"
      />

      {/* Image — split, bento, fullscreen layouts */}
      {(activeLayout === 'split' || activeLayout === 'bento' || activeLayout === 'fullscreen') && (
        <>
          <div className="border-t border-white/8 pt-3">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
              {activeLayout === 'split' ? 'Right Panel Image' : 'Hero Image'}
            </p>
          </div>
          <TextControl
            label="Image URL"
            value={config.imageUrl || ''}
            onChange={v => up({ imageUrl: v })}
            placeholder="https://..."
          />
          <TextControl
            label="Image Alt Text"
            value={config.imageAlt || ''}
            onChange={v => up({ imageAlt: v })}
            placeholder="Your photo or project"
          />
          {/* Live thumbnail */}
          {config.imageUrl && (
            <div
              className="w-full h-24 rounded-lg border border-white/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${config.imageUrl})` }}
            />
          )}
        </>
      )}

      <ToggleControl
        label="Show scroll arrow"
        checked={!!config.showArrow}
        onChange={v => up({ showArrow: v })}
      />
    </div>
  );
}
