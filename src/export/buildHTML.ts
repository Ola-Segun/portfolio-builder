import type { PortfolioStore } from '../types/portfolio';
import { generateCSS } from './generateCSS';
import { RENDER_SECTIONS_JS } from '../preview/runtimeParts/renderSections';
import { ANIMATIONS_JS } from '../preview/runtimeParts/animations';
import { INIT_SYSTEMS_JS } from '../preview/runtimeParts/initSystems';

/**
 * Build a fully standalone HTML file from the portfolio store.
 * Unlike buildPreviewDocument, this has NO postMessage bridge — it's
 * a real, self-contained webpage you can open in any browser.
 */
export function buildHTML(store: PortfolioStore): string {
  const { meta, theme, typography, webgl, cursor, sections, animation } = store;

  const fontsUrl = `https://fonts.googleapis.com/css2?family=${
    encodeURIComponent(typography.headingFont)
  }:wght@100..900&family=${
    encodeURIComponent(typography.bodyFont)
  }:wght@300;400;500&display=swap`;

  const css = generateCSS(theme, typography);

  // Serialise only visible sections for the static bootstrap
  const storeJson = JSON.stringify({
    meta,
    sections: sections.filter(s => s.visible),
    theme,
    typography,
    animation,
    webgl,
    cursor,
  });

  // Standalone init script — no postMessage, just boots and renders
  const standaloneInit = buildStandaloneInit(store);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${meta.name}${meta.title ? ` — ${meta.title}` : ''}</title>
<meta name="description" content="${meta.tagline}">
<meta property="og:title" content="${meta.name}">
<meta property="og:description" content="${meta.tagline}">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontsUrl}" rel="stylesheet">

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>

<!-- Lenis smooth scroll -->
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"><\/script>

${webgl.enabled ? `<!-- Three.js WebGL -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>` : ''}

<style>
${css}

/* Navigation */
#site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 4vw;
  transition: background 0.3s;
}
#site-nav.scrolled {
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text);
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 2rem;
}
.nav-links a {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--text); }

/* Scroll progress bar */
#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  z-index: 200;
  transform-origin: left;
  transform: scaleX(0);
  width: 100%;
}

/* Portfolio container */
#portfolio {
  container-type: inline-size;
}

/* Responsive section padding */
@container (max-width: 768px) {
  .section-hero, .section-about, .section-work,
  .section-skills, .section-process, .section-contact {
    padding: 5rem 6vw !important;
    grid-template-columns: 1fr !important;
  }
}
@container (max-width: 480px) {
  .section-hero, .section-about, .section-work,
  .section-skills, .section-process, .section-contact {
    padding: 4rem 5vw !important;
  }
}

/* Focus visible rings */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
</head>
<body>
<!-- Skip to content -->
<a href="#portfolio" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden" class="skip-link">Skip to content</a>

<!-- Scroll progress -->
<div id="scroll-progress" aria-hidden="true"></div>

<!-- Navigation -->
<nav id="site-nav" aria-label="Site navigation">
  <a href="#" class="nav-logo">${meta.name}</a>
  <div class="nav-links">
    ${sections.filter(s => s.visible && s.type !== 'custom').map(s =>
      `<a href="#${s.id}">${s.type.charAt(0).toUpperCase() + s.type.slice(1)}</a>`
    ).join('\n    ')}
  </div>
</nav>

${webgl.enabled ? `<!-- WebGL canvas (behind everything) -->
<canvas id="webgl-canvas" style="position:fixed;inset:0;z-index:0;pointer-events:none;" aria-hidden="true"></canvas>` : ''}

<!-- Portfolio content -->
<main id="portfolio" style="position:relative;z-index:1;">
</main>

${cursor.enabled ? `<!-- Custom cursor -->
<div id="cursor-inner" aria-hidden="true"></div>
<div id="cursor-outer" aria-hidden="true"></div>` : ''}

<script>
// Bootstrap store (static — no postMessage)
window.__STORE__ = ${storeJson};

${RENDER_SECTIONS_JS}
${ANIMATIONS_JS}
${INIT_SYSTEMS_JS}

${standaloneInit}
<\/script>
</body>
</html>`;
}

/**
 * Standalone init — boots all systems from __STORE__ without any
 * postMessage bridge. Replaces messageHandler.ts for export.
 */
function buildStandaloneInit(store: PortfolioStore): string {
  const { webgl, cursor, animation, sections } = store;

  // Build nav scroll behaviour + scroll progress
  const navSections = sections
    .filter(s => s.visible && s.type !== 'custom')
    .map(s => s.id);

  return `
(function() {
  var store = window.__STORE__;

  // ── Render all sections ──────────────────────────────────────────────
  renderAllSections(store);

  // ── Apply theme CSS vars ─────────────────────────────────────────────
  applyTheme(store.theme);

  // ── Init smooth scroll (Lenis) ───────────────────────────────────────
  ${animation.lenis.smoothWheel ? `initLenis(store.animation.lenis);` : '// Lenis disabled'}

  // ── Init WebGL background ────────────────────────────────────────────
  ${webgl.enabled ? `initWebGL(store);` : '// WebGL disabled'}

  // ── Init custom cursor ───────────────────────────────────────────────
  ${cursor.enabled ? `initCursor(store.cursor);` : '// Cursor disabled'}

  // ── Register GSAP animations ─────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    store.sections.forEach(function(s) {
      if (s.visible) registerAnimation(s.id, s.animation);
    });
  }

  // ── Scroll progress bar ───────────────────────────────────────────────
  var progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      },
    });
  }

  // ── Nav scroll behaviour ──────────────────────────────────────────────
  var nav = document.getElementById('site-nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 60) { nav.classList.add('scrolled'); }
      else { nav.classList.remove('scrolled'); }
    }, { passive: true });
  }

})();
`;
}
