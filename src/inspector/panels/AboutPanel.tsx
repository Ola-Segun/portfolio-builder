import { usePortfolioStore } from '../../store/portfolioStore';
import { TextControl } from '../../inspector/controls/TextControl';
import type { AboutSectionConfig } from '../../types/portfolio';

export function AboutPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionConfig } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const config = section.config as AboutSectionConfig;

  return (
    <div className="space-y-4">
      <TextControl
        label="Name"
        value={config.name}
        onChange={(v) => updateSectionConfig(sectionId, { name: v })}
      />
      <TextControl
        label="Bio"
        value={config.bio}
        multiline
        onChange={(v) => updateSectionConfig(sectionId, { bio: v })}
      />
      <TextControl
        label="Image URL"
        value={config.imageUrl}
        onChange={(v) => updateSectionConfig(sectionId, { imageUrl: v })}
      />
      <TextControl
        label="Image Alt"
        value={config.imageAlt}
        onChange={(v) => updateSectionConfig(sectionId, { imageAlt: v })}
      />
    </div>
  );
}
