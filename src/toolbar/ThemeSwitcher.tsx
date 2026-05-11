import { usePortfolioStore } from '../store/portfolioStore';
import { THEME_PRESETS } from '../themes';
import * as Select from '@radix-ui/react-select';

export function ThemeSwitcher() {
  const theme       = usePortfolioStore(s => s.theme);
  const updateTheme = usePortfolioStore(s => s.updateTheme);

  const isCustom = !THEME_PRESETS.some(t => t.id === theme.id);

  return (
    <Select.Root
      value={theme.id}
      onValueChange={id => {
        const t = THEME_PRESETS.find(t => t.id === id);
        if (t) updateTheme({ ...t });  // spread so store gets a fresh object
      }}
    >
      <Select.Trigger className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white hover:bg-white/10 focus:outline-none transition-colors min-w-[160px]">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.colors.accent }} />
        <Select.Value>{isCustom ? `${theme.name} (custom)` : theme.name}</Select.Value>
        <svg className="ml-auto opacity-40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="bg-neutral-900 border border-white/10 rounded-lg shadow-2xl z-50 min-w-[180px]"
        >
          <Select.Viewport className="p-1">
            {/* Always render all presets so Dark Editorial is always visible */}
            {THEME_PRESETS.map(t => (
              <Select.Item
                key={t.id}
                value={t.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer outline-none text-sm text-white/80 hover:text-white transition-colors data-[highlighted]:bg-white/10 data-[state=checked]:text-white"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white/10"
                  style={{ backgroundColor: t.colors.accent }}
                />
                <Select.ItemText>{t.name}</Select.ItemText>
                {theme.id === t.id && !isCustom && (
                  <svg className="ml-auto opacity-60" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </Select.Item>
            ))}

            {/* Show custom option only when active — selecting it is a no-op */}
            {isCustom && (
              <>
                <div className="mx-2 my-1 border-t border-white/8" />
                <Select.Item
                  value={theme.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-white/50 outline-none data-[highlighted]:bg-white/6"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-white/10"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <Select.ItemText>{theme.name} (custom)</Select.ItemText>
                  <svg className="ml-auto opacity-60" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </Select.Item>
              </>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
