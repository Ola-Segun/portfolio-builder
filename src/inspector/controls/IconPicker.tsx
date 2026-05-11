import { useState, useMemo } from 'react';
import * as icons from 'lucide-react';

// Get all icon names from lucide-react (filter out non-icon exports)
const ICON_NAMES = Object.keys(icons).filter(
  name => name !== 'createLucideIcon' && name !== 'default' && typeof (icons as any)[name] === 'object'
);

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return ICON_NAMES.slice(0, 60);
    return ICON_NAMES.filter(name =>
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 60);
  }, [search]);

  const SelectedIcon = value ? (icons as any)[value] : null;

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs text-white/40 uppercase tracking-wider">{label}</label>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white hover:bg-white/10"
      >
        {SelectedIcon && <SelectedIcon size={16} />}
        <span>{value || 'Select icon…'}</span>
      </button>

      {open && (
        <div className="bg-neutral-800 border border-white/10 rounded shadow-lg p-2 max-h-[200px] overflow-y-auto">
          <input
            type="text"
            placeholder="Search icons…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-white mb-2 outline-none focus:border-white/30"
          />
          <div className="grid grid-cols-6 gap-1">
            {filtered.map(name => {
              const Icon = (icons as any)[name];
              if (!Icon) return null;
              return (
                <button
                  key={name}
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={`p-2 rounded hover:bg-white/10 ${value === name ? 'bg-white/15' : ''}`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
