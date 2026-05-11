import { useEffect, useRef, useState } from 'react';
import { bridge } from './PreviewBridge';
import { usePortfolioStore } from '../store/portfolioStore';
import { useUIStore } from '../store/uiStore';
import { buildPreviewDocument } from './buildPreviewDocument';

// ── Device chrome overlays ─────────────────────────────────────────────────────
// These are purely decorative overlays that sit on top of the stable iframe
// container — they never unmount the iframe itself.

function TabletTopBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 22, background: '#0d0d0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e1e1e', border: '1px solid #2a2a2a' }} />
    </div>
  );
}

function TabletBottomBar() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 22, background: '#0d0d0d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none',
    }}>
      <div style={{ width: 60, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.18)' }} />
    </div>
  );
}

function PhoneTopBar() {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 44, background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none',
    }}>
      {/* Dynamic island */}
      <div style={{
        width: 110, height: 28, borderRadius: 999, background: '#000',
        border: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #2a2a2a' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a2235' }} />
      </div>
      {/* Time */}
      <span style={{
        position: 'absolute', left: 18, fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.75)', fontFamily: 'system-ui, sans-serif',
        letterSpacing: '-0.01em',
      }}>9:41</span>
      {/* Status icons */}
      <div style={{
        position: 'absolute', right: 18, display: 'flex', gap: 5, alignItems: 'center',
      }}>
        <svg width="12" height="9" viewBox="0 0 12 9" fill="rgba(255,255,255,0.75)">
          <rect x="0" y="6" width="2" height="3" rx="0.5"/>
          <rect x="2.5" y="4" width="2" height="5" rx="0.5"/>
          <rect x="5" y="2" width="2" height="7" rx="0.5"/>
          <rect x="7.5" y="0" width="2" height="9" rx="0.5"/>
        </svg>
        <svg width="13" height="10" viewBox="0 0 18 13" fill="none">
          <path d="M9 10a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="rgba(255,255,255,0.75)"/>
          <path d="M4.5 7C6.1 5.4 7.9 4.5 9 4.5c1.1 0 2.9.9 4.5 2.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M1 3.5C3.5 1 6.1 0 9 0s5.5 1 8 3.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 20, height: 10, borderRadius: 2.5, border: '1.5px solid rgba(255,255,255,0.5)', padding: '1.5px', display: 'flex' }}>
            <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 1.5, flex: '0 0 70%' }}/>
          </div>
          <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.4)', borderRadius: '0 1px 1px 0' }}/>
        </div>
      </div>
    </div>
  );
}

function PhoneBottomBar() {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 32, background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, pointerEvents: 'none',
    }}>
      <div style={{ width: 110, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.22)' }} />
    </div>
  );
}

function PhoneSideButtons() {
  return (
    <>
      {/* Volume up */}
      <div style={{ position: 'absolute', left: -4, top: 90, width: 4, height: 28, background: '#1c1c1c', borderRadius: '2px 0 0 2px', zIndex: 10, pointerEvents: 'none' }} />
      {/* Volume down */}
      <div style={{ position: 'absolute', left: -4, top: 132, width: 4, height: 44, background: '#1c1c1c', borderRadius: '2px 0 0 2px', zIndex: 10, pointerEvents: 'none' }} />
      {/* Silent switch */}
      <div style={{ position: 'absolute', left: -4, top: 60, width: 4, height: 22, background: '#1c1c1c', borderRadius: '2px 0 0 2px', zIndex: 10, pointerEvents: 'none' }} />
      {/* Power */}
      <div style={{ position: 'absolute', right: -4, top: 110, width: 4, height: 60, background: '#1c1c1c', borderRadius: '0 2px 2px 0', zIndex: 10, pointerEvents: 'none' }} />
    </>
  );
}

// ── Device frame dimensions ────────────────────────────────────────────────────

const DEVICE_CONFIG = {
  desktop: {
    contentWidth:  '100%',
    maxWidth:      '100%',
    maxHeight:     '100%',
    borderRadius:  8,
    border:        'none',
    shadow:        'none',
    background:    'transparent',
    topPad:        0,
    bottomPad:     0,
  },
  tablet: {
    contentWidth:  768,
    maxWidth:      768 + 28, // bezel on each side
    maxHeight:     1050,
    borderRadius:  22,
    border:        '2px solid rgba(255,255,255,0.10)',
    shadow:        '0 28px 80px rgba(0,0,0,0.70)',
    background:    '#111',
    topPad:        22,  // TabletTopBar height
    bottomPad:     22,  // TabletBottomBar height
  },
  mobile: {
    contentWidth:  390,
    maxWidth:      390 + 24, // bezel on each side
    maxHeight:     844,
    borderRadius:  44,
    border:        '2px solid rgba(255,255,255,0.10)',
    shadow:        '0 28px 80px rgba(0,0,0,0.75)',
    background:    '#0e0e0e',
    topPad:        44,  // PhoneTopBar height
    bottomPad:     32,  // PhoneBottomBar height
  },
} as const;

// ── PreviewFrame ───────────────────────────────────────────────────────────────
// KEY DESIGN DECISION: the <iframe> is ALWAYS rendered in the same structural
// position — only the CSS wrapper around it changes per viewport.
// This prevents React from unmounting + remounting the iframe, which would
// wipe its srcdoc and cause the "blank on switch" bug.

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewport  = useUIStore(s => s.viewport);
  const [loading, setLoading] = useState(false);

  const sections = usePortfolioStore(s => s.sections);
  const themeId  = usePortfolioStore(s => s.theme.id);
  const meta     = usePortfolioStore(s => s.meta);

  // Keep live store ref without subscribing to everything
  const storeRef = useRef(usePortfolioStore.getState());
  useEffect(() => usePortfolioStore.subscribe(s => { storeRef.current = s; }), []);

  // Full rewrite — only when section identity, theme, or meta name changes
  const writeIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    setLoading(true);
    bridge.saveScrollPosition(iframe);
    bridge.reset();
    bridge.register(iframe);
    doc.open();
    doc.write(buildPreviewDocument(storeRef.current));
    doc.close();
  };

  const sectionFingerprint = sections.map(s => `${s.id}:${s.type}`).join(',');
  useEffect(() => { writeIframe(); }, [sectionFingerprint, themeId, meta.name]); // eslint-disable-line

  // Viewport resize → bridge message only, no iframe reload
  useEffect(() => {
    const widths: Record<string, number> = { desktop: 1280, tablet: 768, mobile: 390 };
    bridge.send({ type: 'VIEWPORT_RESIZE', width: widths[viewport] ?? 1280 });
  }, [viewport]);

  useEffect(() => () => bridge.unregister(), []); // eslint-disable-line

  // In-place edit messages
  const updateSectionConfig = usePortfolioStore(s => s.updateSectionConfig);
  const setActiveSectionId  = useUIStore(s => s.setActiveSectionId);
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg?.type) return;
      if (msg.type === 'ELEMENT_CLICKED') setActiveSectionId(msg.sectionId);
      if (msg.type === 'CONTENT_EDIT') updateSectionConfig(msg.sectionId, { [msg.field]: msg.value });
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [updateSectionConfig, setActiveSectionId]);

  const cfg = DEVICE_CONFIG[viewport];

  return (
    // ── Canvas background ──────────────────────────────────────────────────
    // overflow:hidden clips any frame that's slightly oversized during
    // the CSS transition between viewports.
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: viewport === 'desktop' ? 0 : '6px',
        overflow: 'hidden',
      }}
    >
      {/* ── Device chrome shell ─────────────────────────────────────────────
          HEIGHT-DRIVEN sizing: the shell always fills the available canvas
          height (minus tiny padding). Width is derived from aspect-ratio and
          then capped at the natural device pixel width.
          This prevents the frame from ever going taller than the screen.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          // Desktop: fill entire canvas
          ...(viewport === 'desktop' ? {
            width:  '100%',
            height: '100%',
          } : {
            // Device modes: height fills canvas, width follows aspect-ratio
            height:      '100%',
            // aspect-ratio lets the browser derive the width automatically
            aspectRatio: viewport === 'tablet' ? '768 / 1024' : '390 / 844',
            // Never wider than the natural device width
            maxWidth:    viewport === 'tablet' ? (768 + 28) + 'px' : (390 + 24) + 'px',
            // Never taller than the natural device height
            maxHeight:   viewport === 'tablet' ? '1050px' : '870px',
          }),
          borderRadius: cfg.borderRadius,
          border:       cfg.border,
          boxShadow:    cfg.shadow,
          background:   cfg.background,
          overflow:     'hidden',
          display:      'flex',
          flexDirection: 'column' as const,
          transition:   'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          flexShrink:   0,
        }}
      >
        {/* Side buttons (phone only) */}
        {viewport === 'mobile' && <PhoneSideButtons />}

        {/* Top chrome bar */}
        {viewport === 'tablet' && <TabletTopBar />}
        {viewport === 'mobile' && <PhoneTopBar />}

        {/* ── Iframe container — always in the same React tree position ── */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            // Push content below top chrome bar
            marginTop:    cfg.topPad,
            marginBottom: cfg.bottomPad,
            overflow: 'hidden',
          }}
        >
          {/* Loading overlay */}
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.15)',
                borderTopColor: 'rgba(255,255,255,0.8)',
                animation: 'spin 0.7s linear infinite',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 10 }}>Rendering…</span>
            </div>
          )}

          {/*
            THE IFRAME — always rendered here, never moves to a different
            component tree. Viewport changes only affect CSS outside this element.
            width: 100% fills the chrome container exactly — no right-side gap.
          */}
          <iframe
            ref={iframeRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
            }}
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setLoading(false)}
          />
        </div>

        {/* Bottom chrome bar */}
        {viewport === 'tablet' && <TabletBottomBar />}
        {viewport === 'mobile' && <PhoneBottomBar />}
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
