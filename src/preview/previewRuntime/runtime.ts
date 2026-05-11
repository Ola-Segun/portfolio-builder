// Entry point for preview runtime — runs inside the iframe

import { initLenis, updateLenisConfig } from './scrollSetup';
import { initWebGL, updatePalette, setUniform } from './webglCanvas';
import { initCursor } from './cursor';
import { animationRunner } from './animationRunner';
import { renderAllSections, updateSection as updateSectionDOM, renderSectionEl } from './sectionRenderer';
import type { BridgeMessage } from '../../types/bridge';
import type { PortfolioStore, ThemeConfig } from '../../types/portfolio';

// Store is injected as global by the builder
declare global {
  interface Window {
    __STORE__: PortfolioStore;
  }
}

const store = window.__STORE__;

// Initialize everything
function init(): void {
  // Register GSAP plugin
  gsap.registerPlugin(ScrollTrigger);

  // 1. Render static HTML
  renderAllSections(store);

  // 2. Initialize Lenis smooth scroll and sync with GSAP
  initLenis(store.animation.lenis);

  // 3. Initialize WebGL canvas (if enabled)
  if (store.webgl.enabled) {
    initWebGL(store);
  }

  // 4. Initialize custom cursor (if enabled)
  if (store.cursor.enabled) {
    initCursor(store.cursor);
  }

  // 5. Register GSAP ScrollTrigger animations for each section
  store.sections.forEach(section => {
    if (section.visible) {
      animationRunner.register(section.id, section.animation);
    }
  });

  // 6. Signal ready to builder
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');

  // 7. Intercept all anchor clicks inside the preview and smooth-scroll via Lenis.
  //    This covers section nav arrows, CTA buttons with #hash links, etc.
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const hash = anchor.getAttribute('href')!;
    const el = document.querySelector(hash) as HTMLElement | null;
    if (!el) return;
    e.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// Start initialization
init();

// --- Global message handler (builder → preview) ---

window.addEventListener('message', (e: MessageEvent<BridgeMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'SECTION_ADD': {
      // Inject a new section into the DOM without a full rewrite
      const container = document.getElementById('portfolio');
      if (!container) break;
      const newEl = renderSectionEl(msg.section);
      store.sections.push(msg.section);
      if (msg.afterId) {
        const afterEl = document.getElementById(msg.afterId);
        if (afterEl) {
          afterEl.insertAdjacentElement('afterend', newEl);
        } else {
          container.appendChild(newEl);
        }
      } else {
        container.appendChild(newEl);
      }
      // Smooth scroll to the new section after it's painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const lenis = (window as any).__lenis;
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(newEl, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
          } else {
            newEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      break;
    }

    case 'SECTION_REMOVE': {
      const removeEl = document.getElementById(msg.sectionId);
      if (removeEl) removeEl.remove();
      store.sections = store.sections.filter(s => s.id !== msg.sectionId);
      break;
    }

    case 'SECTION_UPDATE':
      updateSectionDOM(msg.sectionId, msg.data);
      break;

    case 'REORDER_SECTIONS': {
      // Reorder existing DOM elements instead of nuking and rebuilding
      // (innerHTML = '' would reset scroll and trigger ScrollTrigger)
      const container = document.getElementById('portfolio');
      if (!container) break;
      store.sections = msg.order
        .map(id => store.sections.find(s => s.id === id)!)
        .filter(Boolean);
      msg.order.forEach(id => {
        const el = document.getElementById(id);
        if (el) container.appendChild(el); // move to end in new order
      });
      break;
    }

    case 'SECTION_VISIBILITY': {
      const vs = store.sections.find(s => s.id === msg.sectionId);
      if (!vs) break;
      vs.visible = msg.visible;
      const vEl = document.getElementById(msg.sectionId);
      if (vEl) {
        // Show/hide in-place — avoids scroll reset and ScrollTrigger reflow
        vEl.style.display = msg.visible ? '' : 'none';
      }
      break;
    }

    case 'SECTION_LAYOUT': {
      const ls = store.sections.find(s => s.id === msg.sectionId);
      if (ls) {
        ls.layout = msg.layout;
        if (!ls.layoutConfigs) ls.layoutConfigs = {};
        ls.layoutConfigs[msg.layout] = Object.assign({}, ls.layoutConfigs[msg.layout] || {}, msg.config);
        ls.config = ls.layoutConfigs[msg.layout];
        const lEl = document.getElementById(msg.sectionId);
        if (lEl) lEl.replaceWith(renderSectionEl(ls));
      }
      break;
    }

    case 'SECTION_STYLES': {
      const ss = store.sections.find(s => s.id === msg.sectionId);
      if (ss) {
        ss.styles = Object.assign({}, ss.styles || {}, msg.styles);
        const sEl = document.getElementById(msg.sectionId);
        if (sEl) sEl.replaceWith(renderSectionEl(ss));
      }
      break;
    }

    case 'SECTION_BACKGROUND': {
      const bs = store.sections.find(s => s.id === msg.sectionId);
      if (bs) {
        bs.background = Object.assign({}, bs.background || { type: 'inherit' }, msg.background);
        const bEl = document.getElementById(msg.sectionId);
        if (bEl) bEl.replaceWith(renderSectionEl(bs));
      }
      break;
    }

    case 'THEME_CHANGE':
      store.theme = msg.theme;
      applyTheme(msg.theme);
      if (store.webgl.enabled) {
        updatePalette(msg.theme.colors);
      }
      break;

    case 'FONT_CHANGE':
      store.typography.headingFont = msg.heading;
      store.typography.bodyFont = msg.body;
      injectFonts(msg.heading, msg.body);
      break;

    case 'ANIMATION_SEEK':
      animationRunner.seek(msg.sectionId, msg.progress);
      break;

    case 'ANIMATION_UPDATE':
      animationRunner.update(msg.sectionId, msg.animation);
      break;

    case 'LENIS_CONFIG':
      Object.assign(store.animation.lenis, msg.config);
      updateLenisConfig(msg.config);
      break;

    case 'WEBGL_UNIFORM':
      setUniform(msg.key, msg.value);
      break;

    case 'WEBGL_CONFIG':
      Object.assign(store.webgl, msg.config);
      break;

    case 'CURSOR_CONFIG':
      Object.assign(store.cursor, msg.config);
      break;

    case 'VIEWPORT_RESIZE':
      break;

    case 'FULL_REFRESH':
      // Re-render everything from new state (don't reload — that kills the iframe)
      Object.assign(store, msg.state);
      window.__STORE__ = msg.state;
      renderAllSections(store);
      applyTheme(store.theme);
      // Re-register animations
      store.sections.forEach(section => {
        if (section.visible) {
          animationRunner.update(section.id, section.animation);
        }
      });
      break;

    case 'SCROLL_RESTORE': {
      // Restore scroll after a full iframe rewrite.
      // Double rAF ensures content is painted and the document has scrollable height.
      const targetY = msg.scrollY;
      if (targetY <= 0) break;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Native scroll is the most reliable — Lenis syncs on its next RAF tick
          window.scrollTo(0, targetY);
          // Also tell Lenis so its internal state stays consistent
          const lenis = (window as any).__lenis;
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(targetY, { immediate: true });
          }
        });
      });
      break;
    }

    case 'SCROLL_TO_SECTION': {
      const targetId = msg.sectionId;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const sectionEl = document.getElementById(targetId);
          if (!sectionEl) return;
          const lenis = (window as any).__lenis;
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(sectionEl, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
          } else {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
      break;
    }
  }
});

// --- Helper functions ---

function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;

  // ── Color tokens ──────────────────────────────────────────────────────────
  root.style.setProperty('--bg',           theme.colors.background);
  root.style.setProperty('--surface',      theme.colors.surface);
  root.style.setProperty('--text',         theme.colors.text);
  root.style.setProperty('--text-muted',   theme.colors.textMuted);
  root.style.setProperty('--accent',       theme.colors.accent);
  root.style.setProperty('--accent-muted', theme.colors.accentMuted);
  root.style.setProperty('--border',       theme.colors.border);

  // ── Component tokens ──────────────────────────────────────────────────────
  const c = theme.components;
  const set = (prop: string, val: string | undefined, fallback: string) =>
    root.style.setProperty(prop, val ?? fallback);

  // Button
  set('--btn-radius',         c?.button?.radius,        '4px');
  set('--btn-letter-spacing', c?.button?.letterSpacing, '0.04em');
  set('--btn-text-transform', c?.button?.textTransform, 'none');
  set('--btn-padding',        c?.button?.padding,       '0.85rem 1.75rem');
  set('--btn-font-size',      c?.button?.fontSize,      '0.875rem');
  set('--btn-font-weight',    String(c?.button?.fontWeight ?? 500), '500');
  set('--btn-shadow',         c?.button?.shadow,        'none');

  // Card
  set('--card-radius',          c?.card?.radius,         '8px');
  set('--card-shadow',          c?.card?.shadow,         '0 2px 12px rgba(0,0,0,0.08)');
  set('--card-border',          c?.card?.border,         '1px solid var(--border)');
  set('--card-bg',              c?.card?.background,     'var(--surface)');
  set('--card-hover-transform', c?.card?.hoverTransform, 'translateY(-3px)');
  set('--card-hover-shadow',    c?.card?.hoverShadow,    '0 8px 32px rgba(0,0,0,0.12)');
  set('--card-padding',         c?.card?.padding,        '1.5rem');

  // Tag
  set('--tag-radius',         c?.tag?.radius,        '4px');
  set('--tag-padding',        c?.tag?.padding,       '0.25rem 0.6rem');
  set('--tag-font-size',      c?.tag?.fontSize,      '0.7rem');
  set('--tag-letter-spacing', c?.tag?.letterSpacing, '0.04em');
  set('--tag-text-transform', c?.tag?.textTransform, 'none');
  set('--tag-border',         c?.tag?.border,        'none');
  set('--tag-bg',             c?.tag?.background,    'var(--accent-muted)');
  set('--tag-color',          c?.tag?.color,         'var(--accent)');

  // Heading
  set('--heading-letter-spacing', c?.heading?.letterSpacing, '-0.03em');
  set('--heading-line-height',    c?.heading?.lineHeight,    '1.05');
  set('--heading-text-transform', c?.heading?.textTransform, 'none');
  set('--heading-font-style',     c?.heading?.fontStyle,     'normal');

  // Divider
  set('--divider-style',     c?.divider?.style,     'solid');
  set('--divider-opacity',   c?.divider?.opacity,   '0.2');
  set('--divider-thickness', c?.divider?.thickness, '1px');

  // Input
  set('--input-radius',       c?.input?.radius,      '6px');
  set('--input-border',       c?.input?.border,      '1px solid var(--border)');
  set('--input-bg',           c?.input?.background,  'var(--surface)');
  set('--input-focus-border', c?.input?.focusBorder, '1px solid var(--accent)');
  set('--input-padding',      c?.input?.padding,     '0.75rem 1rem');

  // Surface
  set('--surface-backdrop', c?.surface?.backdropFilter, 'blur(12px)');

  // ── Regenerate button-variant CSS block so variant switch takes effect ────
  const variantStyle = document.getElementById('btn-variant-css') ?? (() => {
    const s = document.createElement('style');
    s.id = 'btn-variant-css';
    document.head.appendChild(s);
    return s;
  })();
  variantStyle.textContent = buildButtonVariantCSS(c?.button?.variant ?? 'fill', theme);

  // ── Body class for style discriminator ───────────────────────────────────
  document.body.className = document.body.className
    .replace(/\btheme-style-\S+/g, '')
    .trim();
  if (theme.style) {
    document.body.classList.add(`theme-style-${theme.style}`);
  }
}

function buildButtonVariantCSS(variant: string, theme: ThemeConfig): string {
  const dark = theme.darkMode;
  const textOnAccent = dark ? '#000' : '#fff';
  const shadow = theme.components?.button?.shadow ?? 'none';

  switch (variant) {
    case 'fill': return `
      .btn,.btn-primary{background:var(--accent);color:${textOnAccent};border:2px solid var(--accent);}
      .btn:hover,.btn-primary:hover{opacity:.88;box-shadow:${shadow};transform:translateY(-1px);}
      .btn:active{transform:translateY(0);opacity:1;}`;
    case 'outline': return `
      .btn,.btn-primary{background:transparent;color:var(--accent);border:1.5px solid var(--accent);}
      .btn:hover,.btn-primary:hover{background:var(--accent);color:${textOnAccent};box-shadow:${shadow};transform:translateY(-1px);}
      .btn:active{transform:translateY(0);}`;
    case 'ghost': return `
      .btn,.btn-primary{background:transparent;color:var(--text);border:1px solid var(--border);}
      .btn:hover,.btn-primary:hover{background:var(--surface);border-color:var(--text-muted);transform:translateY(-1px);}
      .btn:active{transform:translateY(0);}`;
    case 'pill': return `
      .btn,.btn-primary{background:var(--accent);color:${textOnAccent};border:none;border-radius:999px;}
      .btn:hover,.btn-primary:hover{opacity:.88;box-shadow:${shadow};transform:translateY(-2px) scale(1.02);}
      .btn:active{transform:translateY(0) scale(1);}`;
    default: return `
      .btn,.btn-primary{background:var(--accent);color:${textOnAccent};border:2px solid var(--accent);}
      .btn:hover,.btn-primary:hover{opacity:.85;box-shadow:${shadow};}`;
  }
}

function injectFonts(heading: string, body: string): void {
  // Remove old font links
  document.querySelectorAll('link[data-injected-font]').forEach(l => l.remove());

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-injected-font', 'true');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(heading)}:wght@100..900&family=${encodeURIComponent(body)}:wght@300;400;500&display=swap`;
  document.head.appendChild(link);

  // Update CSS variables
  const style = document.getElementById('font-vars') || document.createElement('style');
  style.id = 'font-vars';
  style.textContent = `
    :root {
      --font-heading: '${heading}', sans-serif;
      --font-body: '${body}', sans-serif;
    }
  `;
  document.head.appendChild(style);
}
