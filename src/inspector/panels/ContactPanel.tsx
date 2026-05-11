import { usePortfolioStore } from '../../store/portfolioStore';
import { TextControl } from '../controls/TextControl';
import { Plus, Trash2 } from 'lucide-react';
import type { SocialLink } from '../../types/portfolio';

export function ContactPanel({ sectionId }: { sectionId: string }) {
  const { sections, updateSectionConfig } = usePortfolioStore();
  const section = sections.find(s => s.id === sectionId)!;
  const config = section.config as import('../../types/portfolio').ContactSectionConfig;

  const socials = config.socials || [];

  const addSocial = () => {
    updateSectionConfig(sectionId, { socials: [...socials, { platform: 'website', url: '' }] });
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const newSocials = [...socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    updateSectionConfig(sectionId, { socials: newSocials });
  };

  const removeSocial = (index: number) => {
    updateSectionConfig(sectionId, { socials: socials.filter((_, i) => i !== index) });
  };

  const platforms: SocialLink['platform'][] = ['twitter', 'github', 'linkedin', 'instagram', 'website'];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <TextControl
          label="Heading"
          value={config.heading}
          onChange={(v) => updateSectionConfig(sectionId, { heading: v })}
        />
        <TextControl
          label="Email"
          value={config.email}
          onChange={(v) => updateSectionConfig(sectionId, { email: v })}
        />
      </div>

      <div className="pt-4 border-t border-white/8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Social Links ({socials.length})
          </h3>
          <button
            onClick={addSocial}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
          >
            <Plus size={12} />
            Add
          </button>
        </div>

        {socials.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-2">
            No social links added.
          </p>
        ) : (
          <div className="space-y-2">
            {socials.map((social, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/10"
              >
                <select
                  value={social.platform}
                  onChange={(e) => updateSocial(index, 'platform', e.target.value as SocialLink['platform'])}
                  className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  {platforms.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => updateSocial(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => removeSocial(index)}
                  className="p-1 rounded text-white/40 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
