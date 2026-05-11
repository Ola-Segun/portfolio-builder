import type { PortfolioStore } from '../types/portfolio';
import { generateCSS } from '../export/generateCSS';
import { RENDER_SECTIONS_JS } from './runtimeParts/renderSections';
import { ANIMATIONS_JS } from './runtimeParts/animations';
import { INIT_SYSTEMS_JS } from './runtimeParts/initSystems';
import { MESSAGE_HANDLER_JS } from './runtimeParts/messageHandler';

export function buildPreviewDocument(store: PortfolioStore): string {
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(store.typography.headingFont)}:wght@100..900&family=${encodeURIComponent(store.typography.bodyFont)}:wght@300;400;500&display=swap`;
  const css = generateCSS(store.theme, store.typography);
  const storeJson = JSON.stringify({
    meta: store.meta,
    sections: store.sections,
    theme: store.theme,
    typography: store.typography,
    animation: store.animation,
    webgl: store.webgl,
    cursor: store.cursor,
  });

  // Nav links from visible sections
  const navLinks = store.sections
    .filter(s => s.visible && s.type !== 'custom')
    .map(s => `<a href="#${s.id}" style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;transition:color 0.2s;">${s.type}</a>`)
    .join('');

  // NOTE: All <\/script> below are intentional — in a JS template literal
  // `\/` === `/`, so these produce valid </script> closing tags in the output HTML.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portfolio Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontsUrl}" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
<style id="theme-styles">${css}</style>
<style>
*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0}
/* Preview nav */
#site-nav-preview{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:1rem 4vw;transition:background 0.3s,border-color 0.3s;
  border-bottom:1px solid transparent;
}
#site-nav-preview.scrolled{
  background:color-mix(in srgb,var(--bg) 88%,transparent);
  backdrop-filter:blur(12px);border-color:var(--border);
}
#site-nav-preview .nav-logo{
  font-family:var(--font-heading);font-size:0.8rem;
  letter-spacing:0.08em;text-transform:uppercase;color:var(--text);text-decoration:none;
}
#site-nav-preview .nav-links{display:flex;gap:1.5rem;align-items:center;}
/* Scroll progress */
#scroll-progress{
  position:fixed;top:0;left:0;height:2px;width:100%;
  background:var(--accent);z-index:200;
  transform-origin:left;transform:scaleX(0);
}
/* Accessibility */
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
#portfolio{container-type:inline-size;}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
}

/* ── Responsive layout classes ────────────────────────────────────────────────
   Uses @media (not @container) so rules fire against the iframe's own
   viewport width — 390px on mobile, ~768px on tablet inside the device frame.
   Data-attribute selectors target section-level grids (hero split/bento).
   Named classes target inner grid wrappers in all other layouts.
──────────────────────────────────────────────────────────────────────────── */

/* ══ Tablet & below (≤ 768px) ════════════════════════════════════════════════ */
@media (max-width:768px){

  /* ── Nav ──────────────────────────────────────────────────────────────────── */
  #site-nav-preview .nav-links{ display:none; }

  /* ── Hero: Split — 2-col grid → single column stack ─────────────────────── */
  .section-hero[data-section-layout="split"]{
    grid-template-columns:1fr !important;
    grid-template-rows:auto auto !important;
    min-height:auto !important;
  }
  /* Collapse inner divs and reset direction */
  .section-hero[data-section-layout="split"] > div{
    direction:ltr !important;
    padding:6vw 8vw !important;
  }
  /* Hide image panel on mobile to avoid blank box */
  .section-hero[data-section-layout="split"] > div:last-child{
    min-height:260px;
  }

  /* ── Hero: Bento — 4-col → 2-col ────────────────────────────────────────── */
  .section-hero[data-section-layout="bento"]{
    grid-template-columns:repeat(2,1fr) !important;
    grid-template-rows:auto !important;
    padding:4vw !important;
  }
  .section-hero[data-section-layout="bento"] > div{
    grid-column:auto !important;
    grid-row:auto !important;
  }

  /* ── About: default / photo-grid ─────────────────────────────────────────── */
  .about-split-grid{
    grid-template-columns:1fr !important;
    gap:3rem !important;
  }
  .about-stats-grid{
    grid-template-columns:repeat(2,1fr) !important;
  }

  /* ── About: editorial ────────────────────────────────────────────────────── */
  .about-editorial-grid{
    grid-template-columns:1fr !important;
    gap:3rem !important;
  }
  .about-editorial-body{ padding-top:0 !important; }

  /* ── Skills: bento — 3-col → 2-col, reset spanning first cell ───────────── */
  .skills-bento-grid{ grid-template-columns:repeat(2,1fr) !important; }
  .skills-bento-cell{ grid-column:auto !important; }

  /* ── Work: default — article grid → stack ────────────────────────────────── */
  .work-default-article{
    grid-template-columns:1fr !important;
    direction:ltr !important;
    gap:2rem !important;
    padding:2.5rem 0 !important;
  }
  .work-default-article > div{ direction:ltr !important; }

  /* ── Work: grid — 2-col → 1-col ─────────────────────────────────────────── */
  .work-grid-cards{ grid-template-columns:1fr !important; }

  /* ── Work: bento — 3-col → 2-col, reset first-cell spanning ─────────────── */
  .work-bento-grid{
    grid-template-columns:repeat(2,1fr) !important;
    grid-auto-rows:220px !important;
  }
  .work-bento-cell{ grid-column:auto !important; grid-row:auto !important; }

  /* ── Work: list — tighten number column ──────────────────────────────────── */
  .work-list-row{
    grid-template-columns:3rem 1fr auto !important;
    gap:1.25rem !important;
  }

  /* ── Contact: split — 2-col → 1-col ─────────────────────────────────────── */
  .contact-split-grid{
    grid-template-columns:1fr !important;
    gap:3rem !important;
  }
}

/* ══ Mobile (≤ 500px) ════════════════════════════════════════════════════════ */
@media (max-width:500px){

  /* Reduce section padding on narrow screens */
  .section-hero,.section-about,.section-work,
  .section-skills,.section-process,.section-contact{
    padding-left:6vw !important;
    padding-right:6vw !important;
  }

  /* ── Hero: Bento — 2-col → 1-col ────────────────────────────────────────── */
  .section-hero[data-section-layout="bento"]{
    grid-template-columns:1fr !important;
  }

  /* ── About ───────────────────────────────────────────────────────────────── */
  .about-stats-grid{ grid-template-columns:1fr !important; }

  /* ── Skills: bento — fully stack ────────────────────────────────────────── */
  .skills-bento-grid{ grid-template-columns:1fr !important; }

  /* ── Work: bento — 2-col → 1-col ────────────────────────────────────────── */
  .work-bento-grid{
    grid-template-columns:1fr !important;
    grid-auto-rows:auto !important;
  }

  /* ── Work: list — compact ────────────────────────────────────────────────── */
  .work-list-row{
    grid-template-columns:2.5rem 1fr auto !important;
    gap:1rem !important;
    padding:.75rem 0 !important;
  }

  /* ── Contact: split form padding ────────────────────────────────────────── */
  .contact-split-grid > div:last-child{ padding:1.5rem !important; }
}

</style>
</head>
<body>
<div id="scroll-progress" aria-hidden="true"></div>
<nav id="site-nav-preview" aria-label="Site navigation">
  <a href="#" class="nav-logo">${store.meta.name || 'Portfolio'}</a>
  <div class="nav-links">${navLinks}</div>
</nav>
<canvas id="webgl-canvas" style="position:fixed;inset:0;z-index:0;pointer-events:none;display:${store.webgl.enabled ? 'block' : 'none'}" aria-hidden="true"></canvas>
<main id="portfolio" style="position:relative;z-index:1;"></main>
<div id="cursor-inner" aria-hidden="true"></div>
<div id="cursor-outer" aria-hidden="true"></div>
<script>window.__STORE__=${storeJson};<\/script>
<script>
${RENDER_SECTIONS_JS}
${ANIMATIONS_JS}
${INIT_SYSTEMS_JS}
${MESSAGE_HANDLER_JS}
<\/script>
</body>
</html>`;
}
