/**
 * Vanilla JS string: section DOM rendering for the preview iframe.
 * Uses the layout registry pattern â€” each section delegates to its active variant.
 * Supports: layout variants, per-section styles, per-section backgrounds, in-place editing.
 */
export const RENDER_SECTIONS_JS = `
// â”€â”€â”€ Layout Registry (inline, no imports in iframe) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

var LAYOUTS = {};

// Hero
LAYOUTS.hero = {};
LAYOUTS.hero.default = function(el, c, meta) {
  el.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:8vw 10vw;position:relative;overflow:hidden;';
  el.innerHTML =
    '<p data-animate="label" data-editable="title" data-field-type="text" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1.5rem;">' + (meta.title || 'Designer & Developer') + '</p>' +
    '<h1 data-animate="heading" data-editable="heading" data-field-type="text" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;margin-bottom:2rem;max-width:12ch;">' + (c.heading || 'Your Name') + '</h1>' +
    '<p data-animate="sub" data-editable="subheading" data-field-type="text" style="font-size:var(--text-xl);color:var(--text-muted);max-width:40ch;margin-bottom:3rem;line-height:1.6;">' + (c.subheading || 'What you do') + '</p>' +
    (c.ctaText ? '<a data-animate="cta" href="' + (c.ctaLink||'#') + '" class="btn btn-primary" style="margin-top:.5rem;">' + c.ctaText + ' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>' : '') +
    (c.showArrow ? '<div style="position:absolute;bottom:3rem;left:50%;transform:translateX(-50%);animation:bounce 2s ease-in-out infinite;color:var(--text-muted);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg></div>' : '');
};
LAYOUTS.hero.centered = function(el, c, meta) {
  el.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:8vw 10vw;position:relative;overflow:hidden;';
  el.innerHTML =
    (c.eyebrow ? '<p data-animate="label" data-editable="eyebrow" style="font-size:var(--text-xs);letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">' + c.eyebrow + '</p>' : '') +
    '<h1 data-animate="heading" data-editable="heading" style="font-size:clamp(3rem,8vw,7rem);font-family:var(--font-heading);line-height:.95;margin-bottom:2rem;max-width:16ch;">' + (c.heading||'Your Name') + '</h1>' +
    '<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-lg);color:var(--text-muted);max-width:48ch;margin-bottom:3rem;line-height:1.7;">' + (c.subheading||'What you do') + '</p>' +
    (c.ctaText ? '<a data-animate="cta" href="' + (c.ctaLink||'#') + '" class="btn btn-primary" style="margin-top:.5rem;">' + c.ctaText + '</a>' : '');
};
LAYOUTS.hero.split = function(el, c, meta) {
  el.style.cssText = 'min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;';
  el.innerHTML =
    '<div style="display:flex;flex-direction:column;justify-content:center;padding:8vw;gap:2rem;">' +
      '<h1 data-animate="heading" data-editable="heading" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;">' + (c.heading||'Your Name') + '</h1>' +
      '<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-xl);color:var(--text-muted);max-width:36ch;line-height:1.6;">' + (c.subheading||'What you do') + '</p>' +
      (c.ctaText ? '<a href="' + (c.ctaLink||'#') + '" class="btn btn-primary">' + c.ctaText + ' â†’</a>' : '') +
    '</div>' +
    '<div style="position:relative;overflow:hidden;">' +
      (c.imageUrl ? '<img src="' + c.imageUrl + '" alt="' + (c.imageAlt||'') + '" style="width:100%;height:100%;object-fit:cover;display:block;">' :
        '<div style="width:100%;height:100%;background:var(--surface);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--text-sm);">Add image in inspector</div>') +
    '</div>';
};

LAYOUTS.hero.fullscreen = function(el, c, meta) {
  el.style.cssText = 'min-height:100vh;position:relative;display:flex;align-items:flex-end;overflow:hidden;';
  var img = c.imageUrl ? 'url(' + c.imageUrl + ')' : 'none';
  el.innerHTML =
    '<div style="position:absolute;inset:0;background-image:' + img + ';background-size:cover;background-position:center;"></div>' +
    '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 60%,transparent 100%);"></div>' +
    '<div style="position:relative;z-index:2;padding:6vw 8vw;width:100%;">' +
      (c.eyebrow ? '<p data-animate="label" style="font-size:var(--text-xs);letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;">' + c.eyebrow + '</p>' : '') +
      '<h1 data-animate="heading" data-editable="heading" style="font-size:clamp(3rem,9vw,8rem);font-family:var(--font-heading);line-height:.92;margin-bottom:2rem;max-width:14ch;color:#fff;">' + (c.heading||'Your Name') + '</h1>' +
      '<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-xl);color:rgba(255,255,255,.7);max-width:44ch;margin-bottom:3rem;">' + (c.subheading||'What you do') + '</p>' +
      (c.ctaText ? '<a data-animate="cta" href="' + (c.ctaLink||'#') + '" class="btn btn-primary" style="margin-top:.5rem;">' + c.ctaText + '</a>' : '') +
    '</div>';
};
LAYOUTS.hero.bento = function(el, c, meta) {
  el.style.cssText = 'padding:6vw;min-height:100vh;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:auto auto auto;gap:1rem;align-content:center;';
  var imgEl = c.imageUrl ? '<img src="' + c.imageUrl + '" alt="' + (c.imageAlt||'') + '" style="width:100%;height:100%;object-fit:cover;display:block;">' :
    '<div style="width:100%;height:100%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);color:var(--text-muted);">Add image in inspector</div>';
  el.innerHTML =
    '<div style="grid-column:1/3;grid-row:1/3;background:var(--surface);border:1px solid var(--border);padding:3rem;display:flex;flex-direction:column;justify-content:flex-end;">' +
      '<h1 data-animate="heading" data-editable="heading" style="font-size:clamp(2.5rem,5vw,5rem);font-family:var(--font-heading);line-height:1.0;">' + (c.heading||'Your Name') + '</h1>' +
    '</div>' +
    '<div style="grid-column:3/5;background:var(--surface);border:1px solid var(--border);overflow:hidden;">' + imgEl + '</div>' +
    '<div style="grid-column:1/3;background:var(--surface);border:1px solid var(--border);padding:2rem;">' +
      '<p data-animate="sub" data-editable="subheading" style="font-size:var(--text-lg);color:var(--text-muted);line-height:1.7;">' + (c.subheading||'What you do') + '</p>' +
    '</div>' +
    '<div style="background:var(--accent);padding:2rem;display:flex;align-items:center;justify-content:center;">' +
      (c.ctaText ? '<a href="' + (c.ctaLink||'#') + '" style="color:var(--bg);text-decoration:none;font-size:var(--text-sm);font-weight:700;letter-spacing:.05em;">' + c.ctaText + ' â†’</a>' : '<span style="color:var(--bg);font-size:var(--text-sm);">Available for work</span>') +
    '</div>' +
    '<div style="background:var(--surface);border:1px solid var(--border);padding:2rem;">' +
      (c.eyebrow ? '<p style="font-size:var(--text-xs);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);">' + c.eyebrow + '</p>' : '<p style="font-size:var(--text-xs);color:var(--text-muted);">'+  meta.title + '</p>') +
    '</div>';
};

// About
LAYOUTS.about = {};
LAYOUTS.about.default = function(el, c, meta) {
  el.style.cssText = 'min-height:80vh;padding:8vw 10vw;';
  var img = c.imageUrl ? '<div class="img-wrapper img-square"><img src="' + c.imageUrl + '" alt="' + (c.imageAlt||'Profile') + '" class="img-themed"></div>' :
    '<div style="width:100%;aspect-ratio:1;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:var(--text-sm);">Add photo URL</div>';
  var stats = (c.stats||[]).map(function(s) { return '<div><div style="font-size:var(--text-3xl);font-family:var(--font-heading);">' + s.value + '</div><div style="font-size:var(--text-xs);color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;">' + s.label + '</div></div>'; }).join('');
  el.innerHTML =
    '<div class="about-split-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;">' +
      '<div>' + img + '</div>' +
      '<div>' +
        '<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">About</p>' +
        '<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-4xl);font-family:var(--font-heading);line-height:1.1;margin-bottom:2rem;">' + (c.name||meta.name||'Your Name') + '</h2>' +
        '<p data-animate="body" data-editable="bio" style="font-size:var(--text-lg);color:var(--text-muted);line-height:1.8;margin-bottom:2rem;">' + (c.bio||'Tell your story.') + '</p>' +
        (stats ? '<div class="about-stats-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;border-top:1px solid var(--border);padding-top:2rem;">' + stats + '</div>' : '') +
      '</div>' +
    '</div>';
};
// Photo Grid = default layout with image prominently placed
LAYOUTS.about['photo-grid'] = LAYOUTS.about.default;
LAYOUTS.about['text-only'] = function(el, c, meta) {
  el.style.cssText = 'padding:10vw;max-width:80ch;margin:0 auto;';
  el.innerHTML =
    '<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">About</p>' +
    '<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-5xl);font-family:var(--font-heading);line-height:1.0;margin-bottom:3rem;">' + (c.name||meta.name||'Your Name') + '</h2>' +
    (c.quote ? '<blockquote data-editable="quote" style="font-size:var(--text-2xl);font-family:var(--font-heading);line-height:1.4;border-left:3px solid var(--accent);padding-left:2rem;margin:0 0 3rem;">' + c.quote + '</blockquote>' : '') +
    '<p data-animate="body" data-editable="bio" style="font-size:var(--text-xl);color:var(--text-muted);line-height:1.9;">' + (c.bio||'Tell your story.') + '</p>';
};
LAYOUTS.about.centered = function(el, c, meta) {
  el.style.cssText = 'padding:8vw 10vw;display:flex;flex-direction:column;align-items:center;text-align:center;';
  var img = c.imageUrl ? '<div class="img-wrapper" style="width:180px;height:180px;border-radius:50%;margin-bottom:3rem;"><img src="' + c.imageUrl + '" alt="' + (c.imageAlt||'Profile') + '" class="img-themed" style="border-radius:50%;"></div>' :
    '<div style="width:180px;height:180px;border-radius:50%;background:var(--surface);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;margin-bottom:3rem;color:var(--text-muted);font-size:var(--text-xs);">Add photo</div>';
  el.innerHTML = img +
    '<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-4xl);font-family:var(--font-heading);margin-bottom:1.5rem;">' + (c.name||meta.name||'Your Name') + '</h2>' +
    '<p data-animate="body" data-editable="bio" style="font-size:var(--text-lg);color:var(--text-muted);line-height:1.9;max-width:52ch;">' + (c.bio||'Tell your story.') + '</p>';
};
LAYOUTS.about.editorial = function(el, c, meta) {
  el.style.cssText = 'padding:8vw 10vw;';
  el.innerHTML =
    '<div class="about-editorial-grid" style="display:grid;grid-template-columns:1fr 2fr;gap:6rem;align-items:start;">' +
      '<div>' +
        '<p style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">About</p>' +
        '<h2 data-animate="heading" data-editable="name" style="font-size:var(--text-4xl);font-family:var(--font-heading);line-height:1.05;margin-bottom:2rem;">' + (c.name||meta.name||'Your Name') + '</h2>' +
        (c.imageUrl ? '<div class="img-wrapper img-portrait" style="margin-top:2rem;"><img src="' + c.imageUrl + '" alt="' + (c.imageAlt||'') + '" class="img-themed"></div>' : '') +
      '</div>' +
      '<div class="about-editorial-body" style="padding-top:4rem;">' +
        (c.quote ? '<blockquote style="font-size:var(--text-3xl);font-family:var(--font-heading);line-height:1.3;margin:0 0 3rem;color:var(--text);">“' + c.quote + '”</blockquote>' : '') +
        '<p data-animate="body" data-editable="bio" style="font-size:var(--text-xl);color:var(--text-muted);line-height:1.9;">' + (c.bio||'Tell your story.') + '</p>' +
      '</div>' +
    '</div>';
};

// Work
LAYOUTS.work = {};
LAYOUTS.work.default = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var projects = c.projects && c.projects.length ? c.projects.map(function(p, i) {
    return '<article data-animate="item" class="work-default-article" style="display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:4rem 0;border-top:1px solid var(--border);' + (i % 2 === 1 ? 'direction:rtl;' : '') + '">' +
      '<div style="direction:ltr;">' + (p.imageUrl ? '<div class="img-wrapper img-wide"><img src="' + p.imageUrl + '" alt="' + p.title + '" class="img-themed"></div>' : '<div style="width:100%;aspect-ratio:16/10;background:var(--surface);border:1px solid var(--border);"></div>') + '</div>' +
      '<div style="direction:ltr;">' +
        '<div style="font-size:var(--text-sm);color:var(--accent);letter-spacing:.15em;text-transform:uppercase;margin-bottom:1rem;">' + (p.tags||[]).join(' / ') + '</div>' +
        '<h3 style="font-size:var(--text-3xl);font-family:var(--font-heading);margin-bottom:1rem;">' + p.title + '</h3>' +
        '<p style="color:var(--text-muted);line-height:1.8;margin-bottom:2rem;">' + p.description + '</p>' +
        (p.link ? '<a href="' + p.link + '" style="color:var(--accent);text-decoration:none;font-size:var(--text-sm);letter-spacing:.05em;text-transform:uppercase;">View Project →</a>' : '') +
      '</div></article>';
  }).join('') : '<div style="padding:6rem 0;text-align:center;border-top:1px solid var(--border);color:var(--text-muted);">Add projects in inspector →</div>';
  el.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2rem;padding-bottom:2rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);">Selected Work</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Projects</h2></div>' + projects;
};
LAYOUTS.work.grid = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var cards = c.projects && c.projects.length ? c.projects.map(function(p) {
    return '<a href="' + (p.link||'#') + '" style="text-decoration:none;color:inherit;display:block;border:1px solid var(--border);" data-animate="item">' +
      '<div class="img-wrapper img-wide">' + (p.imageUrl ? '<img src="' + p.imageUrl + '" alt="' + p.title + '" class="img-themed">' : '<div style="width:100%;height:100%;background:var(--surface);"></div>') + '</div>' +
      '<div style="padding:1.5rem;">' +
        '<div style="font-size:var(--text-xs);color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem;">' + (p.tags||[]).join(', ') + (p.year ? ' · ' + p.year : '') + '</div>' +
        '<h3 style="font-size:var(--text-xl);font-family:var(--font-heading);margin-bottom:.5rem;">' + p.title + '</h3>' +
        '<p style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.7;">' + p.description + '</p>' +
      '</div></a>';
  }).join('') : '<div style="color:var(--text-muted);">Add projects in inspector →</div>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem;">Work</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Projects</h2></div>' +
    '<div class="work-grid-cards" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">' + cards + '</div>';
};
LAYOUTS.work.bento = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var projects = c.projects && c.projects.length ? c.projects : [];
  var cells = projects.map(function(p, i) {
    var span = i === 0 ? 'grid-column:1/3;grid-row:1/3;' : '';
    var imgH  = i === 0 ? 'aspect-ratio:auto;height:100%;' : 'aspect-ratio:16/9;';
    return '<div data-animate="item" class="work-bento-cell" style="' + span + 'border:1px solid var(--border);overflow:hidden;display:flex;flex-direction:column;">' +
      '<div style="' + imgH + 'overflow:hidden;flex:1;">' + (p.imageUrl ? '<div class="img-wrapper" style="width:100%;height:100%;"><img src="' + p.imageUrl + '" alt="' + p.title + '" class="img-themed"></div>' : '<div style="width:100%;height:100%;min-height:200px;background:var(--surface);"></div>') + '</div>' +
      '<div style="padding:1.5rem;">' +
        '<p style="font-size:var(--text-xs);color:var(--accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem;">' + (p.tags||[]).slice(0,2).join(' / ') + '</p>' +
        '<h3 style="font-size:' + (i===0?'var(--text-2xl)':'var(--text-lg)') + ';font-family:var(--font-heading);">' + p.title + '</h3>' +
      '</div></div>';
  }).join('') || '<div style="grid-column:1/4;padding:4rem;text-align:center;border:1px solid var(--border);color:var(--text-muted);">Add projects in inspector →</div>';
  el.innerHTML = '<div style="margin-bottom:3rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Projects</h2></div>' +
    '<div class="work-bento-grid" style="display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:280px;gap:1rem;">' + cells + '</div>';
};
LAYOUTS.work.list = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var projects = c.projects || [];
  var rows = projects.length ? projects.map(function(p, i) {
    return '<a href="' + (p.link||'#') + '" data-animate="item" class="work-list-row" style="text-decoration:none;color:inherit;display:grid;grid-template-columns:4rem 1fr auto;gap:2rem;align-items:center;padding:1.5rem 0;border-top:1px solid var(--border);transition:opacity .2s;">' +
      '<span style="font-size:var(--text-2xl);font-family:var(--font-heading);color:var(--border);">' + String(i+1).padStart(2,'0') + '</span>' +
      '<div><h3 style="font-size:var(--text-xl);font-family:var(--font-heading);margin-bottom:.25rem;">' + p.title + '</h3><p style="font-size:var(--text-sm);color:var(--text-muted);">' + (p.tags||[]).join(' · ') + '</p></div>' +
      '<span style="font-size:var(--text-xs);color:var(--accent);letter-spacing:.08em;text-transform:uppercase;">' + (p.year||'↗') + '</span>' +
    '</a>';
  }).join('') : '<div style="padding:4rem 0;border-top:1px solid var(--border);color:var(--text-muted);">Add projects →</div>';
  el.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Work</h2><p style="font-size:var(--text-sm);color:var(--text-muted);">' + projects.length + ' projects</p></div>' + rows;
};

// Skills
LAYOUTS.skills = {};
LAYOUTS.skills.default = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var cats = c.skills && c.skills.length ? c.skills.map(function(cat) {
    return '<div data-animate="item" style="border-top:1px solid var(--border);padding:2rem 0;">' +
      '<h3 style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;">' + (cat.title||cat.category||'') + '</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.75rem;">' + (cat.items||[]).map(function(s) { return '<span style="padding:.5rem 1.25rem;border:1px solid var(--border);font-size:var(--text-sm);color:var(--text-muted);">' + s + '</span>'; }).join('') + '</div>' +
    '</div>';
  }).join('') : '<div style="padding:4rem 0;border-top:1px solid var(--border);color:var(--text-muted);">Add skills in inspector →</div>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">Expertise</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Skills</h2></div>' + cats;
};
LAYOUTS.skills.pills = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;text-align:center;';
  var allItems = (c.skills||[]).reduce(function(acc, cat) { return acc.concat(cat.items||[]); }, []);
  var pills = allItems.map(function(s) { return '<span data-animate="item" style="display:inline-block;padding:.5rem 1.5rem;border:1px solid var(--border);border-radius:999px;font-size:var(--text-sm);color:var(--text-muted);margin:.375rem;">' + s + '</span>'; }).join('');
  el.innerHTML = '<h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);margin-bottom:3rem;">Skills</h2><div style="max-width:60ch;margin:0 auto;">' + (pills||'<p style="color:var(--text-muted);">Add skills in inspector</p>') + '</div>';
};
LAYOUTS.skills.bento = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var cats = c.skills && c.skills.length ? c.skills.map(function(cat, i) {
    var colSpan = i === 0 ? 'grid-column:1/3;' : '';
    return '<div data-animate="item" class="skills-bento-cell" style="' + colSpan + 'border:1px solid var(--border);padding:2.5rem;">' +
      '<h3 style="font-size:var(--text-sm);letter-spacing:.15em;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem;">' + (cat.title||cat.category||'') + '</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.5rem;">' + (cat.items||[]).map(function(s) {
        return '<span style="padding:.375rem 1rem;border:1px solid var(--border);font-size:var(--text-sm);color:var(--text-muted);">' + s + '</span>';
      }).join('') + '</div>' +
    '</div>';
  }).join('') : '<div style="grid-column:1/4;border:1px solid var(--border);padding:4rem;text-align:center;color:var(--text-muted);">Add skills →</div>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Skills</h2></div>' +
    '<div class="skills-bento-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;">' + cats + '</div>';
};
LAYOUTS.skills.bars = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var allItems = [];
  (c.skills||[]).forEach(function(cat) {
    (cat.items||[]).forEach(function(item) { allItems.push({ name: item, level: cat.level || 80 }); });
  });
  var rows = allItems.map(function(s) {
    return '<div data-animate="item" style="margin-bottom:1.5rem;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:.5rem;"><span style="font-size:var(--text-sm);">' + s.name + '</span><span style="font-size:var(--text-xs);color:var(--text-muted);">' + s.level + '%</span></div>' +
      '<div style="height:2px;background:var(--border);"><div style="height:100%;width:' + s.level + '%;background:var(--accent);transition:width .8s ease;"></div></div>' +
    '</div>';
  }).join('');
  el.innerHTML = '<div style="margin-bottom:4rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Skills</h2></div><div style="max-width:60ch;">' + (rows||'<p style="color:var(--text-muted);">Add skills →</p>') + '</div>';
};

// Process
LAYOUTS.process = {};
LAYOUTS.process.default = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var steps = c.steps && c.steps.length ? c.steps.map(function(s, i) {
    return '<div data-animate="step" style="display:grid;grid-template-columns:5rem 1fr;gap:2rem;padding:2.5rem 0;border-top:1px solid var(--border);">' +
      '<div style="font-size:var(--text-4xl);font-family:var(--font-heading);color:var(--border);line-height:1;">' + String(i+1).padStart(2,'0') + '</div>' +
      '<div><h3 style="font-size:var(--text-2xl);font-family:var(--font-heading);margin-bottom:.75rem;">' + s.title + '</h3><p style="color:var(--text-muted);line-height:1.8;">' + s.description + '</p></div>' +
    '</div>';
  }).join('') : '<div style="padding:4rem 0;border-top:1px solid var(--border);color:var(--text-muted);">Add steps in inspector →</div>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">Approach</p><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Process</h2></div>' + steps;
};
LAYOUTS.process.timeline = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var steps = c.steps && c.steps.length ? c.steps.map(function(s, i) {
    return '<div data-animate="step" style="display:grid;grid-template-columns:3rem 1fr;gap:2rem;padding-bottom:3rem;position:relative;">' +
      '<div style="display:flex;flex-direction:column;align-items:center;">' +
        '<div style="width:2.5rem;height:2.5rem;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);font-weight:700;color:var(--bg);flex-shrink:0;">' + (i+1) + '</div>' +
        '<div style="width:1px;flex:1;background:var(--border);margin-top:.5rem;"></div>' +
      '</div>' +
      '<div style="padding-top:.5rem;"><h3 style="font-size:var(--text-2xl);font-family:var(--font-heading);margin-bottom:.75rem;">' + s.title + '</h3><p style="color:var(--text-muted);line-height:1.8;">' + s.description + '</p></div>' +
    '</div>';
  }).join('') : '<p style="color:var(--text-muted);">Add steps →</p>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">Process</h2></div>' + steps;
};
LAYOUTS.process.cards = function(el, c) {
  el.style.cssText = 'padding:8vw 10vw;';
  var steps = c.steps && c.steps.length ? c.steps.map(function(s, i) {
    return '<div data-animate="item" style="border:1px solid var(--border);padding:2.5rem;">' +
      '<div style="font-size:var(--text-3xl);font-family:var(--font-heading);color:var(--accent);margin-bottom:1rem;">' + String(i+1).padStart(2,'0') + '</div>' +
      '<h3 style="font-size:var(--text-xl);font-family:var(--font-heading);margin-bottom:.75rem;">' + s.title + '</h3>' +
      '<p style="font-size:var(--text-sm);color:var(--text-muted);line-height:1.8;">' + s.description + '</p>' +
    '</div>';
  }).join('') : '<div style="border:1px solid var(--border);padding:4rem;text-align:center;color:var(--text-muted);">Add steps →</div>';
  el.innerHTML = '<div style="margin-bottom:4rem;"><h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);">How I Work</h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;">' + steps + '</div>';
};

// Contact
LAYOUTS.contact = {};
LAYOUTS.contact.default = function(el, c, meta) {
  el.style.cssText = 'min-height:80vh;padding:8vw 10vw;display:flex;flex-direction:column;justify-content:center;';
  var email = c.email || meta.email || '';
  var socials = (c.socials || meta.socials || []).map(function(s) {
    return '<a href="' + s.url + '" target="_blank" rel="noopener" style="font-size:var(--text-sm);letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;padding:.5rem 0;border-bottom:1px solid var(--border);">' + s.platform + '</a>';
  }).join('');
  el.innerHTML =
    '<p data-animate="label" style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">' + (c.heading||"Let's Talk") + '</p>' +
    '<a data-animate="email" href="mailto:' + email + '" style="font-size:var(--text-4xl);font-family:var(--font-heading);color:var(--text);text-decoration:none;line-height:1.1;margin-bottom:4rem;display:block;max-width:20ch;">' + (email||'hello@example.com') + '</a>' +
    (socials ? '<div style="display:flex;gap:3rem;flex-wrap:wrap;">' + socials + '</div>' : '');
};
LAYOUTS.contact.split = function(el, c, meta) {
  el.style.cssText = 'padding:8vw 10vw;min-height:80vh;';
  var email = c.email || meta.email || '';
  var socials = (c.socials || meta.socials || []).map(function(s) {
    return '<a href="' + s.url + '" target="_blank" rel="noopener" style="display:block;font-size:var(--text-sm);color:var(--text-muted);text-decoration:none;padding:.75rem 0;border-bottom:1px solid var(--border);">' + s.platform + ' ↗</a>';
  }).join('');
  el.innerHTML =
    '<div class="contact-split-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;">' +
      '<div>' +
        '<p style="font-size:var(--text-sm);letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;">' + (c.heading || "Let’s Talk") + '</p>' +
        '<h2 data-animate="heading" style="font-size:var(--text-4xl);font-family:var(--font-heading);line-height:1.1;margin-bottom:3rem;">Get in<br>touch.</h2>' +
        '<a href="mailto:' + email + '" style="display:block;font-size:var(--text-lg);color:var(--accent);text-decoration:none;margin-bottom:3rem;">' + (email || 'hello@example.com') + '</a>' +
        (socials ? '<div>' + socials + '</div>' : '') +
      '</div>' +
      '<div style="background:var(--surface);border:1px solid var(--border);padding:3rem;">' +
        '<p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:2rem;">Quick message</p>' +
        '<input placeholder="Your name" style="display:block;width:100%;box-sizing:border-box;background:transparent;border:none;border-bottom:1px solid var(--border);padding:.75rem 0;margin-bottom:1.5rem;font-size:var(--text-sm);color:var(--text);outline:none;">' +
        '<input placeholder="Email" style="display:block;width:100%;box-sizing:border-box;background:transparent;border:none;border-bottom:1px solid var(--border);padding:.75rem 0;margin-bottom:1.5rem;font-size:var(--text-sm);color:var(--text);outline:none;">' +
        '<textarea placeholder="Message..." rows="4" style="display:block;width:100%;box-sizing:border-box;background:transparent;border:none;border-bottom:1px solid var(--border);padding:.75rem 0;margin-bottom:2rem;font-size:var(--text-sm);color:var(--text);resize:none;outline:none;"></textarea>' +
        '<button class="btn btn-primary">Send Message</button>' +
      '</div>' +
    '</div>';
};
LAYOUTS.contact.minimal = function(el, c, meta) {
  el.style.cssText = 'min-height:80vh;padding:8vw 10vw;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
  var email = c.email || meta.email || '';
  el.innerHTML =
    '<p data-animate=\"label\" style=\"font-size:var(--text-xs);letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);margin-bottom:3rem;\">' + (c.heading||'Contact') + '</p>' +
    '<a data-animate=\"email\" href=\"mailto:' + email + '\" style=\"font-size:clamp(2rem,6vw,5rem);font-family:var(--font-heading);color:var(--text);text-decoration:none;line-height:1.1;margin-bottom:4rem;border-bottom:2px solid var(--accent);padding-bottom:.5rem;\">' + (email||'hello@example.com') + '</a>';
};

// Custom
LAYOUTS.custom = {};
LAYOUTS.custom.default = function(el, c) {
  el.style.cssText = 'min-height:50vh;padding:4rem 2rem;';
  el.innerHTML = c.html || '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted);font-size:var(--text-sm);">Write custom HTML in the Code tab â†’</div>';
};

// â”€â”€â”€ Apply Section Background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function applySectionBackground(el, bg) {
  if (!bg || bg.type === 'inherit') return;
  if (bg.type === 'solid') {
    el.style.backgroundColor = bg.color || 'transparent';
    if (bg.opacity !== undefined) el.style.opacity = bg.opacity;
  } else if (bg.type === 'gradient') {
    el.style.background = 'linear-gradient(' + (bg.gradientAngle||135) + 'deg,' + (bg.gradientFrom||'var(--bg)') + ',' + (bg.gradientTo||'var(--accent)') + ')';
  } else if (bg.type === 'image' && bg.imageUrl) {
    el.style.backgroundImage = 'url(' + bg.imageUrl + ')';
    el.style.backgroundSize  = bg.imageSize || 'cover';
    el.style.backgroundPosition = bg.imagePosition || 'center';
  } else if (bg.type === 'mesh') {
    // Mesh gradient presets
    var meshes = {
      aurora:  'radial-gradient(at 40% 20%,hsla(228,60%,30%,1) 0px,transparent 50%),radial-gradient(at 80% 0%,hsla(189,60%,30%,1) 0px,transparent 50%),radial-gradient(at 0% 50%,hsla(355,60%,30%,1) 0px,transparent 50%)',
      sunset:  'radial-gradient(at 0% 0%,hsla(253,60%,30%,1) 0px,transparent 50%),radial-gradient(at 50% 0%,hsla(339,60%,30%,1) 0px,transparent 50%),radial-gradient(at 100% 0%,hsla(14,60%,30%,1) 0px,transparent 50%)',
      forest:  'radial-gradient(at 0% 100%,hsla(122,60%,20%,1) 0px,transparent 50%),radial-gradient(at 100% 0%,hsla(196,60%,20%,1) 0px,transparent 50%)',
    };
    el.style.background = meshes[bg.meshPreset] || meshes.aurora;
  }
}

// â”€â”€â”€ Apply Section Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function applySectionStyles(el, styles) {
  if (!styles) return;
  if (styles.paddingTop)    el.style.paddingTop    = styles.paddingTop;
  if (styles.paddingBottom) el.style.paddingBottom = styles.paddingBottom;
  if (styles.maxWidth) {
    if (styles.maxWidth === 'full') { el.style.maxWidth = '100%'; }
    else { el.style.maxWidth = styles.maxWidth; el.style.marginLeft = 'auto'; el.style.marginRight = 'auto'; }
  }
  if (styles.textAlign)    el.style.textAlign    = styles.textAlign;
  if (styles.contentAlign) el.style.alignItems   = styles.contentAlign;
}

// â”€â”€â”€ Core render functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function renderAllSections(store) {
  var container = document.getElementById('portfolio');
  if (!container) return;
  container.innerHTML = '';
  store.sections.forEach(function(section) {
    if (section.visible) container.appendChild(renderSection(section, store));
  });
}

function renderSection(section, store) {
  var el = document.createElement('section');
  el.id = section.id;
  el.dataset.sectionType   = section.type;
  el.dataset.sectionLayout = section.layout || 'default';
  el.className = 'section section-' + section.type;

  var meta = (store && store.meta) || {};

  // Resolve active config from layoutConfigs (non-destructive)
  var layout = section.layout || 'default';
  var config = (section.layoutConfigs && section.layoutConfigs[layout])
    ? section.layoutConfigs[layout]
    : (section.config || {});

  // Attach meta to config for hero title
  config.__meta = meta;

  // Render via layout registry
  var variants = LAYOUTS[section.type];
  var renderFn = variants && (variants[layout] || variants['default']);
  if (renderFn) renderFn(el, config, meta);

  // Apply per-section background and styles (on top of layout defaults)
  if (section.background) applySectionBackground(el, section.background);
  if (section.styles)     applySectionStyles(el, section.styles);

  return el;
}

// â”€â”€â”€ DOM Update (bridge: SECTION_UPDATE) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function updateSectionDOM(sectionId, config) {
  var store = window.__STORE__;
  var section = store.sections.find(function(s) { return s.id === sectionId; });
  if (!section) return;
  // Update the active layout's config in layoutConfigs
  var layout = section.layout || 'default';
  if (!section.layoutConfigs) section.layoutConfigs = {};
  Object.assign(section.layoutConfigs[layout] || {}, config);
  section.config = section.layoutConfigs[layout];
  var el = document.getElementById(sectionId);
  if (el) el.replaceWith(renderSection(section, store));
}

// â”€â”€â”€ In-place editing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function initInPlaceEditing() {
  // Delegate click on [data-editable] to activate contenteditable
  document.addEventListener('click', function(e) {
    var target = e.target;
    // Skip if already editing
    if (document.querySelector('[data-editing]')) return;

    // Walk up to find data-editable
    var editable = target.closest('[data-editable]');
    if (!editable) return;

    // Find parent section
    var sectionEl = editable.closest('section[id]');
    if (!sectionEl) return;

    var sectionId = sectionEl.id;
    var field = editable.getAttribute('data-editable');

    // Notify builder (focus inspector on this section + field)
    window.parent.postMessage({ type: 'ELEMENT_CLICKED', sectionId: sectionId, field: field }, '*');

    // Activate contenteditable
    editable.setAttribute('contenteditable', 'true');
    editable.setAttribute('data-editing', 'true');
    editable.setAttribute('spellcheck', 'false');
    editable.style.outline = '2px solid var(--accent)';
    editable.style.outlineOffset = '4px';
    editable.style.borderRadius = '2px';
    editable.focus();

    // Place cursor at end
    var range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    function finish() {
      var newValue = editable.innerText.trim();
      editable.removeAttribute('contenteditable');
      editable.removeAttribute('data-editing');
      editable.style.outline = '';
      editable.style.outlineOffset = '';
      editable.style.borderRadius = '';

      // Send update to builder
      window.parent.postMessage({
        type: 'CONTENT_EDIT',
        sectionId: sectionId,
        field: field,
        value: newValue
      }, '*');

      editable.removeEventListener('blur', finish);
      editable.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); finish(); }
      if (e.key === 'Escape') { editable.innerText = editable.getAttribute('data-original') || editable.innerText; finish(); }
    }

    // Store original value for Escape
    editable.setAttribute('data-original', editable.innerText);
    editable.addEventListener('blur', finish, { once: true });
    editable.addEventListener('keydown', onKey);
  });
}
`;

