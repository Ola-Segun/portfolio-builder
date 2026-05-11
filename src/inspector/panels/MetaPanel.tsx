import { useCallback } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { TextControl } from '../controls/TextControl';
import type { SocialLink } from '../../types/portfolio';

const PLATFORM_OPTIONS = ['github', 'linkedin', 'twitter', 'instagram', 'website'] as const;

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider pt-2 border-t border-white/8 first:border-0 first:pt-0">
        {label}
      </h3>
      {children}
    </div>
  );
}

export function MetaPanel() {
  const meta = usePortfolioStore(s => s.meta);
  const updateMeta = usePortfolioStore(s => s.updateMeta);

  // useCallback so functions aren't recreated on every render
  const updateSocial = useCallback((index: number, field: keyof SocialLink, value: string) => {
    const socials = meta.socials.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    updateMeta({ socials });
  }, [meta.socials, updateMeta]);

  const addSocial = useCallback(() => {
    updateMeta({ socials: [...meta.socials, { platform: 'github', url: '' }] });
  }, [meta.socials, updateMeta]);

  const removeSocial = useCallback((index: number) => {
    updateMeta({ socials: meta.socials.filter((_, i) => i !== index) });
  }, [meta.socials, updateMeta]);

  return (
    <div className="space-y-5">
      <FieldGroup label="Identity">
        <TextControl
          label="Your Name"
          value={meta.name}
          onChange={v => updateMeta({ name: v })}
        />
        <TextControl
          label="Role / Title"
          value={meta.title}
          onChange={v => updateMeta({ title: v })}
        />
        <TextControl
          label="Tagline"
          value={meta.tagline}
          onChange={v => updateMeta({ tagline: v })}
        />
      </FieldGroup>

      <FieldGroup label="Contact">
        <TextControl
          label="Email"
          value={meta.email}
          onChange={v => updateMeta({ email: v })}
        />
      </FieldGroup>

      <FieldGroup label="Social Links">
        <div className="space-y-2">
          {meta.socials.map((social, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="flex-1 space-y-1.5">
                <select
                  value={social.platform}
                  onChange={e => updateSocial(i, 'platform', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                >
                  {PLATFORM_OPTIONS.map(p => (
                    <option key={p} value={p} className="bg-neutral-900">
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <TextControl
                  label=""
                  value={social.url}
                  placeholder="https://..."
                  onChange={v => updateSocial(i, 'url', v)}
                  debounceMs={400}
                />
              </div>
              <button
                onClick={() => removeSocial(i)}
                className="mt-1 p-1.5 rounded text-white/30 hover:text-red-400 transition-colors"
                title="Remove"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          <button
            onClick={addSocial}
            className="w-full py-2 border border-dashed border-white/15 rounded text-xs text-white/40 hover:text-white/60 hover:border-white/25 transition-colors"
          >
            + Add Social Link
          </button>
        </div>
      </FieldGroup>
    </div>
  );
}
