/**
 * Layout Registry
 * Each section type declares its available layout variants.
 * renderFn receives (el, config, meta) and mutates el's innerHTML/style.
 * Non-destructive: switching layouts never erases another variant's stored data.
 */

import type { SectionConfig, SectionType, LayoutVariantMeta } from '../types/portfolio';

export type LayoutMeta = Record<string, MetaData>;

interface MetaData {
  id: string;
  label: string;
  description: string;
  thumbnail: string; // schematic SVG rects as path data
}

export type RenderFn = (el: HTMLElement, config: SectionConfig, meta: Record<string, unknown>) => void;

interface LayoutVariant {
  meta: MetaData;
  render: RenderFn;
}

type Registry = Partial<Record<SectionType, Record<string, LayoutVariant>>>;

// ─── Hero Layouts ──────────────────────────────────────────────────────────────

const heroDefault: LayoutVariant = {
  meta: { id: 'default', label: 'Editorial Left', description: 'Left-aligned, typographic', thumbnail: 'left' },
  render(el, c) {
    const cfg = c as { heading?: string; subheading?: string; ctaText?: string; ctaLink?: string; showArrow?: boolean };
    el.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:8vw 10vw;position:relative;overflow:hidden;';
    el.innerHTML =
      `<p data-animate="label" data-editable="title" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1.5rem;">${(c as any).__meta?.title || 'Designer & Developer'}</p>` +
      `<h1 data-animate="heading" data-editable="heading" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;margin-bottom:2rem;max-width:12ch;">${cfg.heading || 'Your Name'}</h1>` +
      `<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-xl);color:var(--text-muted);max-width:40ch;margin-bottom:3rem;line-height:1.6;">${cfg.subheading || 'What you do'}</p>` +
      (cfg.ctaText ? `<a data-animate="cta" href="${cfg.ctaLink||'#'}" style="display:inline-flex;align-items:center;gap:.75rem;padding:1rem 2.5rem;background:var(--accent);color:var(--bg);text-decoration:none;font-size:var(--text-sm);font-weight:600;">${cfg.ctaText}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>` : '') +
      (cfg.showArrow ? `<div style="position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);animation:bounce 2s ease-in-out infinite;color:var(--text-muted);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>` : '');
  },
};

const heroCentered: LayoutVariant = {
  meta: { id: 'centered', label: 'Centered Stage', description: 'Full-center, dramatic', thumbnail: 'center' },
  render(el, c) {
    const cfg = c as { heading?: string; subheading?: string; eyebrow?: string; ctaText?: string; ctaLink?: string };
    el.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:8vw 10vw;position:relative;overflow:hidden;';
    el.innerHTML =
      (cfg.eyebrow ? `<p data-animate="label" data-editable="eyebrow" style="font-size:var(--text-xs);letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">${cfg.eyebrow}</p>` : '') +
      `<h1 data-animate="heading" data-editable="heading" style="font-size:clamp(3rem,8vw,7rem);font-family:var(--font-heading);line-height:.95;margin-bottom:2rem;max-width:16ch;">${cfg.heading||'Your Name'}</h1>` +
      `<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-lg);color:var(--text-muted);max-width:48ch;margin-bottom:3rem;line-height:1.7;">${cfg.subheading||'What you do'}</p>` +
      (cfg.ctaText ? `<a data-animate="cta" href="${cfg.ctaLink||'#'}" style="padding:.875rem 2.5rem;border:1px solid var(--text);color:var(--text);text-decoration:none;font-size:var(--text-sm);letter-spacing:.08em;">${cfg.ctaText}</a>` : '');
  },
};

const heroSplit: LayoutVariant = {
  meta: { id: 'split', label: 'Split Screen', description: 'Text left, image right', thumbnail: 'split' },
  render(el, c) {
    const cfg = c as { heading?: string; subheading?: string; ctaText?: string; ctaLink?: string; imageUrl?: string; imageAlt?: string };
    el.style.cssText = 'min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;';
    el.innerHTML =
      `<div style="display:flex;flex-direction:column;justify-content:center;padding:8vw;gap:2rem;">` +
        `<h1 data-animate="heading" data-editable="heading" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;">${cfg.heading||'Your Name'}</h1>` +
        `<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-xl);color:var(--text-muted);max-width:36ch;line-height:1.6;">${cfg.subheading||'What you do'}</p>` +
        (cfg.ctaText ? `<a href="${cfg.ctaLink||'#'}" style="display:inline-flex;align-items:center;gap:.5rem;color:var(--accent);text-decoration:none;font-size:var(--text-sm);letter-spacing:.05em;font-weight:600;">${cfg.ctaText} →</a>` : '') +
      `</div>` +
      `<div style="position:relative;overflow:hidden;">` +
        (cfg.imageUrl
          ? `<img src="${cfg.imageUrl}" alt="${cfg.imageAlt||''}" style="width:100%;height:100%;object-fit:cover;">`
          : `<div style="width:100%;height:100%;background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--text-sm);">Add image in inspector</div>`) +
      `</div>`;
  },
};

// ─── About Layouts ─────────────────────────────────────────────────────────────

const aboutGrid: LayoutVariant = {
  meta: { id: 'default', label: 'Photo Grid', description: 'Image left, bio right', thumbnail: 'grid' },
  render(el, c, meta) {
    const cfg = c as { name?: string; bio?: string; imageUrl?: string; imageAlt?: string; stats?: Array<{label:string;value:string}> };
    el.style.cssText = 'min-height:80vh;padding:8vw 10vw;display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;';
    const img = cfg.imageUrl
      ? `<img src="${cfg.imageUrl}" alt="${cfg.imageAlt||'Profile'}" style="width:100%;aspect-ratio:1;object-fit:cover;">`
      : `<div style="width:100%;aspect-ratio:1;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--text-sm);">Add photo URL in inspector</div>`;
    const stats = (cfg.stats||[]).map(s => `<div><div style="font-size:var(--text-3xl);font-family:var(--font-heading);">${s.value}</div><div style="font-size:var(--text-xs);color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;">${s.label}</div></div>`).join('');
    el.innerHTML =
      `<div>${img}</div>` +
      `<div>` +
        `<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">About</p>` +
        `<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-4xl);font-family:var(--font-heading);line-height:1.1;margin-bottom:2rem;">${cfg.name||(meta.name as string)||'Your Name'}</h2>` +
        `<p data-animate="body" data-editable="bio" style="font-size:var(--text-lg);color:var(--text-muted);line-height:1.8;margin-bottom:2rem;">${cfg.bio||'Tell your story.'}</p>` +
        (stats ? `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;border-top:1px solid var(--border);padding-top:2rem;">${stats}</div>` : '') +
      `</div>`;
  },
};

const aboutTextOnly: LayoutVariant = {
  meta: { id: 'text-only', label: 'Text Only', description: 'Wide bio, no photo', thumbnail: 'text' },
  render(el, c, meta) {
    const cfg = c as { name?: string; bio?: string; quote?: string };
    el.style.cssText = 'padding:10vw;max-width:80ch;margin:0 auto;';
    el.innerHTML =
      `<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">About</p>` +
      `<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;margin-bottom:3rem;">${cfg.name||(meta.name as string)||'Your Name'}</h2>` +
      (cfg.quote ? `<blockquote data-editable="quote" style="font-size:var(--text-2xl);font-family:var(--font-heading);line-height:1.4;border-left:3px solid var(--accent);padding-left:2rem;margin:0 0 3rem;">${cfg.quote}</blockquote>` : '') +
      `<p data-animate="body" data-editable="bio" style="font-size:var(--text-xl);color:var(--text-muted);line-height:1.9;">${cfg.bio||'Tell your story.'}</p>`;
  },
};

// ─── Work Layouts ──────────────────────────────────────────────────────────────

const workAlternating: LayoutVariant = {
  meta: { id: 'default', label: 'Alternating', description: 'Rows flip left/right', thumbnail: 'alt' },
  render(el, c) {
    const cfg = c as { projects?: Array<{title:string;description:string;imageUrl:string;link:string;tags:string[]}> };
    el.style.cssText = 'padding:8vw 10vw;';
    const projects = (cfg.projects||[]).map((p,i) =>
      `<article data-animate="item" style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:4rem 0;border-top:1px solid var(--border);${i%2===1?'direction:rtl;':''}">` +
        `<div style="direction:ltr;">${p.imageUrl?`<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;aspect-ratio:16/10;object-fit:cover;">`:`<div style="width:100%;aspect-ratio:16/10;background:var(--surface);border:1px solid var(--border);"></div>`}</div>` +
        `<div style="direction:ltr;">` +
          `<div style="font-size:var(--text-sm);color:var(--accent);letter-spacing:.15em;text-transform:uppercase;margin-bottom:1rem;">${(p.tags||[]).join(' / ')}</div>` +
          `<h3 style="font-size:var(--text-3xl);font-family:var(--font-heading);margin-bottom:1rem;">${p.title}</h3>` +
          `<p style="color:var(--text-muted);line-height:1.8;margin-bottom:2rem;">${p.description}</p>` +
          (p.link?`<a href="${p.link}" style="color:var(--accent);text-decoration:none;font-size:var(--text-sm);letter-spacing:.05em;text-transform:uppercase;">View Project →</a>`:'') +
        `</div>` +
      `</article>`
    ).join('') || `<div style="padding:6rem 0;text-align:center;border-top:1px solid var(--border);color:var(--text-muted);">Add projects in the inspector →</div>`;
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2rem;padding-bottom:2rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);">Selected Work</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Projects</h2></div>${projects}`;
  },
};

const workGrid: LayoutVariant = {
  meta: { id: 'grid', label: 'Grid Cards', description: '2-column project cards', thumbnail: 'grid' },
  render(el, c) {
    const cfg = c as { projects?: Array<{title:string;description:string;imageUrl:string;link:string;tags:string[];year?:string}> };
    el.style.cssText = 'padding:8vw 10vw;';
    const cards = (cfg.projects||[]).map(p =>
      `<a href="${p.link||'#'}" style="text-decoration:none;color:inherit;display:block;border:1px solid var(--border);transition:border-color .2s;" data-animate="item">` +
        `<div style="aspect-ratio:16/10;overflow:hidden;">${p.imageUrl?`<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;transition:transform .4s;">`:  `<div style="width:100%;height:100%;background:var(--surface);"></div>`}</div>` +
        `<div style="padding:1.5rem;">` +
          `<div style="display:flex;justify-content:space-between;margin-bottom:.75rem;">` +
            `<span style="font-size:var(--text-xs);color:var(--accent);letter-spacing:.12em;text-transform:uppercase;">${(p.tags||[]).join(', ')}</span>` +
            (p.year?`<span style="font-size:var(--text-xs);color:var(--text-muted);">${p.year}</span>`:'') +
          `</div>` +
          `<h3 style="font-size:var(--text-xl);font-family:var(--font-heading);margin-bottom:.5rem;">${p.title}</h3>` +
          `<p style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.7;">${p.description}</p>` +
        `</div>` +
      `</a>`
    ).join('') || `<div style="padding:4rem 0;color:var(--text-muted);">Add projects in the inspector →</div>`;
    el.innerHTML = `<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem;">Work</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Projects</h2></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">${cards}</div>`;
  },
};

// ─── Skills Layouts ────────────────────────────────────────────────────────────

const skillsRows: LayoutVariant = {
  meta: { id: 'default', label: 'Category Rows', description: 'Expandable skill rows', thumbnail: 'rows' },
  render(el, c) {
    const cfg = c as { skills?: Array<{title:string;items:string[]}> };
    el.style.cssText = 'padding:8vw 10vw;';
    const cats = (cfg.skills||[]).map(cat =>
      `<div data-animate="item" style="border-top:1px solid var(--border);padding:2rem 0;">` +
        `<h3 style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;">${cat.title}</h3>` +
        `<div style="display:flex;flex-wrap:wrap;gap:.75rem;">${(cat.items||[]).map(s=>`<span style="padding:.5rem 1.25rem;border:1px solid var(--border);font-size:var(--text-sm);color:var(--text-muted);">${s}</span>`).join('')}</div>` +
      `</div>`
    ).join('') || `<div style="padding:4rem 0;border-top:1px solid var(--border);color:var(--text-muted);">Add skills in the inspector →</div>`;
    el.innerHTML = `<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">Expertise</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Skills</h2></div>${cats}`;
  },
};

const skillsPills: LayoutVariant = {
  meta: { id: 'pills', label: 'Pill Cloud', description: 'All skills as a tag cloud', thumbnail: 'pills' },
  render(el, c) {
    const cfg = c as { skills?: Array<{title:string;items:string[]}> };
    el.style.cssText = 'padding:8vw 10vw;text-align:center;';
    const allItems = (cfg.skills||[]).flatMap(cat => cat.items||[]);
    const pills = allItems.map(s=>`<span data-animate="item" style="display:inline-block;padding:.5rem 1.5rem;border:1px solid var(--border);border-radius:999px;font-size:var(--text-sm);color:var(--text-muted);margin:.375rem;">${s}</span>`).join('');
    el.innerHTML = `<h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);margin-bottom:3rem;">Skills</h2><div style="max-width:60ch;margin:0 auto;">${pills||'<p style="color:var(--text-muted);">Add skills in inspector</p>'}</div>`;
  },
};

// ─── Process Layouts ───────────────────────────────────────────────────────────

const processNumbered: LayoutVariant = {
  meta: { id: 'default', label: 'Numbered Steps', description: 'Large number + description', thumbnail: 'num' },
  render(el, c) {
    const cfg = c as { steps?: Array<{title:string;description:string}> };
    el.style.cssText = 'padding:8vw 10vw;';
    const steps = (cfg.steps||[]).map((s,i)=>
      `<div data-animate="step" style="display:grid;grid-template-columns:5rem 1fr;gap:2rem;padding:2.5rem 0;border-top:1px solid var(--border);">` +
        `<div style="font-size:var(--text-4xl);font-family:var(--font-heading);color:var(--border);line-height:1;">${String(i+1).padStart(2,'0')}</div>` +
        `<div><h3 data-editable="steps.${i}.title" style="font-size:var(--text-2xl);font-family:var(--font-heading);margin-bottom:.75rem;">${s.title}</h3><p data-editable="steps.${i}.description" style="color:var(--text-muted);line-height:1.8;">${s.description}</p></div>` +
      `</div>`
    ).join('') || `<div style="padding:4rem 0;border-top:1px solid var(--border);color:var(--text-muted);">Add steps in inspector →</div>`;
    el.innerHTML = `<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">Approach</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Process</h2></div>${steps}`;
  },
};

// ─── Contact Layouts ───────────────────────────────────────────────────────────

const contactMinimal: LayoutVariant = {
  meta: { id: 'default', label: 'Minimal', description: 'Large email + socials', thumbnail: 'min' },
  render(el, c, meta) {
    const cfg = c as { heading?:string; email?:string; socials?:Array<{platform:string;url:string}>; bodyText?:string };
    el.style.cssText = 'min-height:80vh;padding:8vw 10vw;display:flex;flex-direction:column;justify-content:center;';
    const email = cfg.email||(meta.email as string)||'';
    const socials = (cfg.socials||(meta.socials as Array<{platform:string;url:string}>)||[]).map(s=>`<a href="${s.url}" target="_blank" rel="noopener" style="font-size:var(--text-sm);letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;padding:.5rem 0;border-bottom:1px solid var(--border);">${s.platform}</a>`).join('');
    el.innerHTML =
      `<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">${cfg.heading||"Let's Talk"}</p>` +
      `<a data-animate="email" href="mailto:${email}" style="font-size:var(--text-4xl);font-family:var(--font-heading);color:var(--text);text-decoration:none;line-height:1.1;margin-bottom:4rem;display:block;max-width:20ch;">${email||'hello@example.com'}</a>` +
      (socials?`<div style="display:flex;gap:3rem;flex-wrap:wrap;">${socials}</div>`:'');
  },
};

// ─── Custom Layout ─────────────────────────────────────────────────────────────

const customRaw: LayoutVariant = {
  meta: { id: 'default', label: 'Raw HTML', description: 'Custom HTML/CSS block', thumbnail: 'raw' },
  render(el, c) {
    el.style.cssText = 'min-height:50vh;padding:4rem 2rem;';
    el.innerHTML = (c as any).html || `<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted);font-size:var(--text-sm);">Write custom HTML in the Code tab →</div>`;
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const LAYOUT_REGISTRY: Registry = {
  hero:    {
    default:    heroDefault,
    centered:   heroCentered,
    split:      heroSplit,
    fullscreen: { meta: { id: 'fullscreen', label: 'Fullscreen',   description: 'Cinematic full-bleed with image',    thumbnail: 'full' }, render: heroDefault.render },
    bento:      { meta: { id: 'bento',      label: 'Bento Grid',   description: 'Asymmetric grid with stats tiles',  thumbnail: 'bento' }, render: heroDefault.render },
  },
  about:   {
    default:    aboutGrid,
    'text-only': aboutTextOnly,
    centered:   { meta: { id: 'centered',  label: 'Centered',   description: 'Circle avatar, centered bio',        thumbnail: 'center' }, render: aboutGrid.render },
    editorial:  { meta: { id: 'editorial', label: 'Editorial',  description: 'Two-col with pull-quote',            thumbnail: 'edit' }, render: aboutGrid.render },
  },
  work:    {
    default:    workAlternating,
    grid:       workGrid,
    bento:      { meta: { id: 'bento', label: 'Bento Grid', description: 'Asymmetric feature + small cards',       thumbnail: 'bento' }, render: workGrid.render },
    list:       { meta: { id: 'list',  label: 'Numbered List', description: 'Minimal numbered project list',       thumbnail: 'list' }, render: workGrid.render },
  },
  skills:  {
    default:    skillsRows,
    pills:      skillsPills,
    bento:      { meta: { id: 'bento', label: 'Category Bento', description: 'Skill categories as bento grid',    thumbnail: 'bento' }, render: skillsRows.render },
    bars:       { meta: { id: 'bars',  label: 'Progress Bars',  description: 'Horizontal skill level bars',        thumbnail: 'bars' }, render: skillsRows.render },
  },
  process: {
    default:    processNumbered,
    timeline:   { meta: { id: 'timeline', label: 'Timeline',   description: 'Vertical timeline with connectors',  thumbnail: 'time' }, render: processNumbered.render },
    cards:      { meta: { id: 'cards',    label: 'Cards',      description: 'Horizontal card grid per step',      thumbnail: 'cards' }, render: processNumbered.render },
  },
  contact: {
    default:    contactMinimal,
    split:      { meta: { id: 'split',   label: 'Split + Form', description: 'Info left, quick-message form right', thumbnail: 'split' }, render: contactMinimal.render },
    minimal:    { meta: { id: 'minimal', label: 'Minimal',      description: 'Centered giant email address',         thumbnail: 'min' }, render: contactMinimal.render },
  },
  custom:  { default: customRaw },
};

/** Get all layout variants for a section type as metadata array */
export function getLayoutsForType(type: SectionType): LayoutVariantMeta[] {
  const variants = LAYOUT_REGISTRY[type] || {};
  return Object.values(variants).map(v => v.meta as LayoutVariantMeta);
}

/** Render a section using the registry */
export function renderViaRegistry(
  el: HTMLElement,
  type: SectionType,
  layout: string,
  config: SectionConfig,
  meta: Record<string, unknown>
): void {
  const variants = LAYOUT_REGISTRY[type];
  const variant = variants?.[layout] || variants?.['default'];
  if (variant) {
    variant.render(el, config, meta);
  }
}
