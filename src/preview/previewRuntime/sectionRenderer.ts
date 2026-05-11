// Renders all sections into the #portfolio element

import type { PortfolioStore, Section, HeroSectionConfig, AboutSectionConfig, WorkSectionConfig, SkillsSectionConfig, ContactSectionConfig, ProcessSectionConfig, CustomSectionConfig } from '../../types/portfolio';

export function renderAllSections(store: PortfolioStore): void {
  const container = document.getElementById('portfolio');
  if (!container) return;

  container.innerHTML = '';

  store.sections.forEach(section => {
    if (section.visible) {
      const el = renderSection(section);
      container.appendChild(el);
    }
  });
}

export function updateSection(sectionId: string, config: Record<string, unknown>): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const store = window.__STORE__;
  const section = store.sections.find(s => s.id === sectionId);
  if (section) {
    Object.assign(section.config, config);
    const newEl = renderSection(section);
    el.replaceWith(newEl);
  }
}

function renderSection(section: Section): HTMLElement {
  return renderSectionEl(section);
}

export function renderSectionEl(section: Section): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.id = section.id;
  wrapper.dataset.sectionType = section.type;
  wrapper.dataset.sectionLayout = section.layout || 'default';
  wrapper.className = `section section-${section.type}`;

  // Apply per-section styles
  const styles = section.styles || {};
  if (styles.paddingTop)    wrapper.style.paddingTop    = styles.paddingTop;
  if (styles.paddingBottom) wrapper.style.paddingBottom = styles.paddingBottom;
  if (styles.textAlign)     wrapper.style.textAlign     = styles.textAlign;
  if (styles.maxWidth && styles.maxWidth !== 'full') {
    wrapper.style.maxWidth    = styles.maxWidth;
    wrapper.style.marginLeft  = 'auto';
    wrapper.style.marginRight = 'auto';
  }

  // Resolve config from active layoutConfigs slot (non-destructive layouts)
  const layout = section.layout || 'default';
  const config = (section.layoutConfigs && section.layoutConfigs[layout])
    ? section.layoutConfigs[layout]
    : (section.config || {});

  switch (section.type) {
    case 'hero':    renderHero(wrapper,    config as any); break;
    case 'about':   renderAbout(wrapper,   config as any); break;
    case 'work':    renderWork(wrapper,    config as any); break;
    case 'skills':  renderSkills(wrapper,  config as any); break;
    case 'contact': renderContact(wrapper, config as any); break;
    case 'process': renderProcess(wrapper, config as any); break;
    case 'custom':  renderCustom(wrapper,  config as any); break;
  }

  return wrapper;
}

// // --- Section template functions ---

function renderHero(container: HTMLElement, config: HeroSectionConfig) {
  container.style.minHeight = '100vh';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.padding = '8vw 6vw';
  container.style.textAlign = 'center';

  if (config.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.textContent = config.eyebrow;
    eyebrow.className = 'tag';
    eyebrow.style.cssText = 'margin-bottom:1.5rem;';
    container.appendChild(eyebrow);
  }

  const h1 = document.createElement('h1');
  h1.textContent = config.heading;
  h1.dataset.animate = 'heading';
  h1.style.cssText = 'font-size:var(--text-5xl);margin-bottom:1.25rem;color:var(--text);';
  container.appendChild(h1);

  const sub = document.createElement('p');
  sub.textContent = config.subheading;
  sub.dataset.animate = 'subheading';
  sub.style.cssText = 'font-size:var(--text-xl);color:var(--text-muted);max-width:42rem;margin-bottom:2.5rem;line-height:1.7;';
  container.appendChild(sub);

  if (config.ctaText) {
    const a = document.createElement('a');
    a.href = config.ctaLink || '#';
    a.textContent = config.ctaText;
    a.className = 'btn btn-primary';
    a.dataset.animate = 'cta';
    container.appendChild(a);
  }

  if (config.showArrow) {
    const arrow = document.createElement('div');
    arrow.textContent = '↓';
    arrow.dataset.animate = 'arrow';
    arrow.style.cssText = 'margin-top:4rem;animation:bounce 2s infinite;opacity:0.4;font-size:1.5rem;';
    container.appendChild(arrow);
  }
}

function renderAbout(container: HTMLElement, config: AboutSectionConfig) {
  container.style.cssText = `
    min-height:80vh;display:flex;gap:5vw;align-items:center;
    justify-content:center;padding:8vw 6vw;flex-wrap:wrap;
  `;

  if (config.imageUrl) {
    const img = document.createElement('img');
    img.src = config.imageUrl;
    img.alt = config.imageAlt;
    img.style.cssText = `
      width:clamp(200px,30vw,320px);height:clamp(200px,30vw,320px);
      object-fit:cover;border-radius:var(--card-radius);
      box-shadow:var(--card-shadow);flex-shrink:0;
    `;
    container.appendChild(img);
  }

  const text = document.createElement('div');
  text.style.maxWidth = '520px';

  const h2 = document.createElement('h2');
  h2.textContent = 'About Me';
  h2.style.cssText = 'font-size:var(--text-4xl);margin-bottom:1rem;';
  text.appendChild(h2);

  const bio = document.createElement('p');
  bio.textContent = config.bio;
  bio.style.cssText = 'color:var(--text-muted);line-height:1.85;font-size:var(--text-base);';
  text.appendChild(bio);

  if (config.quote) {
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = `"${config.quote}"`;
    blockquote.style.cssText = `
      margin:2rem 0 0;padding:1.25rem 1.5rem;
      border-left:3px solid var(--accent);
      color:var(--text-muted);font-style:italic;
      background:var(--surface);border-radius:0 var(--card-radius) var(--card-radius) 0;
    `;
    text.appendChild(blockquote);
  }

  if (config.stats && config.stats.length) {
    const statsRow = document.createElement('div');
    statsRow.style.cssText = 'display:flex;gap:2.5rem;margin-top:2rem;flex-wrap:wrap;';
    config.stats.forEach(stat => {
      const statEl = document.createElement('div');
      statEl.innerHTML = `
        <strong style="display:block;font-size:var(--text-3xl);font-family:var(--font-heading);color:var(--text);">${stat.value}</strong>
        <span style="font-size:var(--text-sm);color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase;">${stat.label}</span>
      `;
      statsRow.appendChild(statEl);
    });
    text.appendChild(statsRow);
  }

  container.appendChild(text);
}

function renderWork(container: HTMLElement, config: WorkSectionConfig) {
  container.style.cssText = 'min-height:60vh;padding:8vw 6vw;';

  const header = document.createElement('div');
  header.style.cssText = 'text-align:center;margin-bottom:4rem;';
  header.innerHTML = `<h2 style="font-size:var(--text-4xl);">Work</h2>`;
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.style.cssText = `
    display:grid;gap:2rem;max-width:1200px;margin:0 auto;
    grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));
  `;

  if (config.projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);">No projects added yet.</p>';
  } else {
    config.projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card card-image';
      card.style.cssText = 'overflow:hidden;';

      let html = '';
      if (p.imageUrl) {
        html += `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:220px;object-fit:cover;display:block;" />`;
      }
      html += `<div class="card-body">`;
      if (p.year || p.role) {
        html += `<div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap;">`;
        if (p.year)  html += `<span class="tag">${p.year}</span>`;
        if (p.role)  html += `<span class="tag">${p.role}</span>`;
        html += `</div>`;
      }
      html += `<h3 style="font-size:var(--text-xl);margin-bottom:0.5rem;">${p.title}</h3>`;
      html += `<p style="color:var(--text-muted);font-size:var(--text-sm);line-height:1.7;margin-bottom:1rem;">${p.description}</p>`;
      if (p.tags.length) {
        html += `<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem;">`;
        p.tags.forEach((t: string) => { html += `<span class="tag">${t}</span>`; });
        html += `</div>`;
      }
      if (p.link) {
        html += `<a href="${p.link}" class="btn" style="font-size:var(--text-sm);padding:0.6rem 1.25rem;">View Project →</a>`;
      }
      html += `</div>`;
      card.innerHTML = html;
      grid.appendChild(card);
    });
  }

  container.appendChild(grid);
}

function renderSkills(container: HTMLElement, config: SkillsSectionConfig) {
  container.style.cssText = 'min-height:60vh;padding:8vw 6vw;';

  const header = document.createElement('div');
  header.style.cssText = 'text-align:center;margin-bottom:4rem;';
  header.innerHTML = `<h2 style="font-size:var(--text-4xl);">Skills</h2>`;
  container.appendChild(header);

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'max-width:900px;margin:0 auto;';

  if (config.skills.length === 0) {
    wrapper.innerHTML = '<p style="color:var(--text-muted);">No skills added yet.</p>';
  } else {
    config.skills.forEach(cat => {
      const catDiv = document.createElement('div');
      catDiv.className = 'card';
      catDiv.style.cssText = 'margin-bottom:1.25rem;';
      catDiv.innerHTML = `
        <h3 style="font-size:var(--text-lg);margin-bottom:1rem;color:var(--accent);">${cat.title}</h3>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          ${cat.items.map((skill: string) => `<span class="tag">${skill}</span>`).join('')}
        </div>
      `;
      wrapper.appendChild(catDiv);
    });
  }

  container.appendChild(wrapper);
}

function renderContact(container: HTMLElement, config: ContactSectionConfig) {
  container.style.cssText = `
    min-height:80vh;display:flex;flex-direction:column;
    justify-content:center;align-items:center;
    padding:8vw 6vw;text-align:center;
  `;

  const inner = document.createElement('div');
  inner.style.maxWidth = '560px';
  inner.innerHTML = `
    <h2 style="font-size:var(--text-4xl);margin-bottom:1rem;">${config.heading}</h2>
    <p style="color:var(--text-muted);margin-bottom:2.5rem;font-size:var(--text-lg);line-height:1.7;">${config.subheading ?? ''}</p>
    <a href="mailto:${config.email}" class="btn btn-primary" style="margin-bottom:2.5rem;">${config.email}</a>
    ${config.socials.length ? `
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:1rem;">
      ${config.socials.map(s => `<a href="${s.url}" class="tag" style="text-decoration:none;">${s.platform}</a>`).join('')}
    </div>` : ''}
  `;
  container.appendChild(inner);
}

function renderProcess(container: HTMLElement, config: ProcessSectionConfig) {
  container.style.cssText = 'min-height:60vh;padding:8vw 6vw;';

  const header = document.createElement('div');
  header.style.cssText = 'text-align:center;margin-bottom:4rem;';
  header.innerHTML = `<h2 style="font-size:var(--text-4xl);">Process</h2>`;
  container.appendChild(header);

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem;';

  if (config.steps.length === 0) {
    wrapper.innerHTML = '<p style="color:var(--text-muted);">No steps added yet.</p>';
  } else {
    config.steps.forEach((step, i) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.style.cssText = 'display:flex;gap:1.5rem;align-items:flex-start;';
      div.innerHTML = `
        <div style="
          min-width:44px;height:44px;background:var(--accent);
          color:${config.steps ? 'var(--bg)' : '#fff'};
          border-radius:var(--btn-radius);display:flex;align-items:center;
          justify-content:center;font-weight:700;font-family:var(--font-heading);
          font-size:var(--text-base);flex-shrink:0;
        ">${i + 1}</div>
        <div>
          <h3 style="font-size:var(--text-xl);margin:0 0 0.4rem;">${step.title}</h3>
          <p style="color:var(--text-muted);line-height:1.7;margin:0;">${step.description}</p>
        </div>
      `;
      wrapper.appendChild(div);
    });
  }

  container.appendChild(wrapper);
}

function renderCustom(container: HTMLElement, config: CustomSectionConfig) {
  container.style.cssText = 'min-height:60vh;padding:8vw 6vw;';
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'max-width:800px;margin:0 auto;';
  wrapper.innerHTML = config.html + `<style>${config.css}</style>`;
  container.appendChild(wrapper);
}
