import * as React from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { useUIStore }        from '../store/uiStore';
import { HeroPanel }         from './panels/HeroPanel';
import { AboutPanel }        from './panels/AboutPanel';
import { WorkPanel }         from './panels/WorkPanel';
import { SkillsPanel }       from './panels/SkillsPanel';
import { ProcessPanel }      from './panels/ProcessPanel';
import { ContactPanel }      from './panels/ContactPanel';
import { AnimationPanel }    from './AnimationPanel';
import { CodePanel }         from './CodePanel';
import { MetaPanel }         from './panels/MetaPanel';
import { EffectsPanel }      from './panels/EffectsPanel';
import { CustomThemePanel }  from './panels/CustomThemePanel';
import { TypographyPanel }   from './panels/TypographyPanel';
import { StylePanel }        from './panels/StylePanel';
import { BackgroundPanel }   from './panels/BackgroundPanel';
import { LayoutPicker }      from './controls/LayoutPicker';
import { bridge }            from '../preview/PreviewBridge';

// ── Section type icons ────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, { path: string; color: string }> = {
  hero:    { path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3', color: '#818cf8' },
  about:   { path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',            color: '#34d399' },
  work:    { path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#fb923c' },
  skills:  { path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: '#a78bfa' },
  process: { path: 'M13 10V3L4 14h7v7l9-11h-7z',                                                      color: '#fbbf24' },
  contact: { path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#38bdf8' },
  custom:  { path: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',                                           color: '#f472b6' },
};

// ── Site tab definitions ──────────────────────────────────────────────────────

const SITE_TABS = [
  { key: 'identity',   label: 'Identity' },
  { key: 'typography', label: 'Type'     },
  { key: 'theme',      label: 'Theme'    },
  { key: 'effects',    label: 'Effects'  },
] as const;
type SiteTab = (typeof SITE_TABS)[number]['key'];

const SECTION_TABS = [
  { key: 'content',   label: 'Content' },
  { key: 'layout',    label: 'Layout'  },
  { key: 'style',     label: 'Style'   },
  { key: 'animation', label: 'Motion'  },
] as const;

// ── Pill Tab Bar ──────────────────────────────────────────────────────────────

function PillTabBar({
  tabs,
  active,
  onSelect,
}: {
  tabs: readonly { key: string; label: string }[];
  active: string;
  onSelect: (k: string) => void;
}) {
  return (
    <div className="panel-tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={`panel-tab ${active === tab.key ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Section divider label ─────────────────────────────────────────────────────

export function FigSectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="fig-section-label">{children}</div>;
}

// ── Inspector ─────────────────────────────────────────────────────────────────

export function Inspector() {
  const activeSectionId = useUIStore(s => s.activeSectionId);
  const activeTab       = useUIStore(s => s.inspectorTab);
  const setTab          = useUIStore(s => s.setInspectorTab);
  const setActiveId     = useUIStore(s => s.setActiveSectionId);
  const sections        = usePortfolioStore(s => s.sections);
  const activeSection   = sections.find(s => s.id === activeSectionId);

  // ── Site Settings ────────────────────────────────────────────────────────
  if (!activeSection) {
    const siteTab = (activeTab as SiteTab) || 'identity';
    return (
      <div className="h-full flex flex-col bg-[#141414]">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
          <div className="w-5 h-5 rounded bg-white/8 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/30 leading-none">Portfolio</div>
            <div className="text-[12px] font-medium text-white/85 leading-tight mt-0.5">Site Settings</div>
          </div>
        </div>

        {/* Pill tabs */}
        <PillTabBar
          tabs={SITE_TABS}
          active={siteTab}
          onSelect={k => setTab(k as Parameters<typeof setTab>[0])}
        />

        {/* Content */}
        <div className="flex-1 inspector-scroll px-3 pb-4 space-y-4 pt-1">
          {siteTab === 'identity'   && <MetaPanel />}
          {siteTab === 'typography' && <TypographyPanel />}
          {siteTab === 'theme'      && <CustomThemePanel />}
          {siteTab === 'effects'    && <EffectsPanel />}
        </div>
      </div>
    );
  }

  // ── Section Inspector ────────────────────────────────────────────────────
  const currentIndex = sections.findIndex(s => s.id === activeSectionId);
  const prevSection  = sections[currentIndex - 1];
  const nextSection  = sections[currentIndex + 1];

  const sectionTabs = [
    ...SECTION_TABS,
    ...(activeSection.type === 'custom' ? [{ key: 'code', label: 'Code' } as const] : []),
  ];

  const typeIcon    = TYPE_ICONS[activeSection.type] || TYPE_ICONS['custom'];
  const activeLayout = activeSection.layout || 'default';

  function navigateTo(id: string) {
    setActiveId(id);
    bridge.scrollToSection(id);
  }

  return (
    <div className="h-full flex flex-col bg-[#141414]">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[10px] text-white/28 mb-1.5">
          <button
            onClick={() => setActiveId(null)}
            className="hover:text-white/55 transition-colors"
          >
            Site
          </button>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="text-white/50 capitalize">{activeSection.type}</span>
        </div>

        {/* Main header row */}
        <div className="flex items-center gap-2">
          {/* Type badge icon */}
          <div
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: typeIcon.color + '22' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={typeIcon.color} strokeWidth="1.5">
              <path d={typeIcon.path} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white/90 capitalize leading-none">
              {activeSection.type}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-white/25 font-mono">#{activeSection.id.slice(-6)}</span>
              <span className="text-[9px] text-white/18">·</span>
              <span
                className="text-[9px] text-white/30 capitalize px-1 py-0.5 rounded"
                style={{ background: typeIcon.color + '18' }}
              >
                {activeLayout}
              </span>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setActiveId(null)}
            className="p-1 rounded text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            title="Back to site settings (Escape)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
        </div>

        {/* ── SectionNav mini-bar ────────────────────────────────────── */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => prevSection && navigateTo(prevSection.id)}
            disabled={!prevSection}
            title={prevSection ? `Go to ${prevSection.type}` : 'No previous section'}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] text-white/30
              hover:text-white/65 hover:bg-white/[0.05] disabled:opacity-20
              disabled:cursor-not-allowed transition-all flex-1 justify-center"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span className="truncate max-w-[60px]">{prevSection?.type ?? '—'}</span>
          </button>

          <span className="text-[9px] text-white/18 font-mono px-1">
            {currentIndex + 1}/{sections.length}
          </span>

          <button
            onClick={() => nextSection && navigateTo(nextSection.id)}
            disabled={!nextSection}
            title={nextSection ? `Go to ${nextSection.type}` : 'No next section'}
            className="flex items-center gap-1 px-2 py-1 rounded text-[9px] text-white/30
              hover:text-white/65 hover:bg-white/[0.05] disabled:opacity-20
              disabled:cursor-not-allowed transition-all flex-1 justify-center"
          >
            <span className="truncate max-w-[60px]">{nextSection?.type ?? '—'}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Pill Tabs ────────────────────────────────────────────────────── */}
      <PillTabBar
        tabs={sectionTabs}
        active={activeTab}
        onSelect={k => setTab(k as Parameters<typeof setTab>[0])}
      />

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 inspector-scroll px-3 pb-4 pt-1 space-y-4">

        {activeTab === 'content' && (
          <>
            {activeSection.type === 'hero'    && <HeroPanel    sectionId={activeSection.id} />}
            {activeSection.type === 'about'   && <AboutPanel   sectionId={activeSection.id} />}
            {activeSection.type === 'work'    && <WorkPanel    sectionId={activeSection.id} />}
            {activeSection.type === 'skills'  && <SkillsPanel  sectionId={activeSection.id} />}
            {activeSection.type === 'process' && <ProcessPanel sectionId={activeSection.id} />}
            {activeSection.type === 'contact' && <ContactPanel sectionId={activeSection.id} />}
            {activeSection.type === 'custom'  && (
              <p className="text-[11px] text-white/30 text-center py-4">
                Edit raw HTML in the{' '}
                <button
                  className="underline text-white/50 hover:text-white transition-colors"
                  onClick={() => setTab('code' as any)}
                >
                  Code tab
                </button>.
              </p>
            )}
          </>
        )}

        {activeTab === 'layout' && (
          <LayoutPicker sectionId={activeSection.id} sectionType={activeSection.type} />
        )}

        {activeTab === 'style' && (
          <div className="space-y-5">
            <BackgroundPanel sectionId={activeSection.id} />
            <div className="border-t border-white/[0.06] pt-4">
              <StylePanel sectionId={activeSection.id} />
            </div>
          </div>
        )}

        {activeTab === 'animation' && (
          <AnimationPanel sectionId={activeSection.id} />
        )}

        {activeTab === 'code' && <CodePanel />}
      </div>
    </div>
  );
}

