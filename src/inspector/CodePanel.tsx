import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { usePortfolioStore } from '../store/portfolioStore';
import { useUIStore } from '../store/uiStore';
import { debounce } from '../lib/debounce';
import type { Section } from '../types/portfolio';

export function CodePanel() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [internalUpdate, setInternalUpdate] = useState(false);

  const activeSectionId = useUIStore(s => s.activeSectionId);
  const sections = usePortfolioStore(s => s.sections);
  const activeSection = sections.find(s => s.id === activeSectionId);

  const updateSectionConfig = usePortfolioStore(s => s.updateSectionConfig);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    viewRef.current = new EditorView({
      doc: '',
      extensions: [
        basicSetup,
        html(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !internalUpdate) {
            const newHtml = update.state.doc.toString();
            debounce(() => {
              if (activeSectionId) {
                updateSectionConfig(activeSectionId, { html: newHtml, css: '' });
              }
            }, 500)();
          }
        }),
      ],
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, []);

  // Update editor content when section changes
  useEffect(() => {
    if (!viewRef.current || !activeSection) return;

    const currentHtml = generateSectionHtml(activeSection);
    const currentDoc = viewRef.current.state.doc.toString();

    if (currentHtml !== currentDoc) {
      setInternalUpdate(true);
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: currentHtml,
        },
      });
      setTimeout(() => setInternalUpdate(false), 0);
    }
  }, [activeSectionId, activeSection]);

  if (!activeSection) {
    return (
      <div className="p-6 text-white/40 text-sm text-center">
        Select a section to view and edit its HTML.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b border-white/8">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
          HTML Code — {activeSection.type}
        </h3>
        <p className="text-xs text-white/30 mt-0.5">
          Edit the generated HTML. Changes sync live.
        </p>
      </div>
      <div ref={editorRef} className="flex-1 overflow-auto" />
    </div>
  );
}

function generateSectionHtml(section: Section): string {
  const config = section.config as Record<string, unknown>;

  switch (section.type) {
    case 'hero':
      return `<section id="${section.id}" class="hero-section">
  <h1>${(config.heading as string) || 'Your Name'}</h1>
  <p>${(config.subheading as string) || 'What you do'}</p>
  ${config.ctaText ? `<a href="${(config.ctaLink as string) || '#'}">${config.ctaText}</a>` : ''}
</section>`;
    case 'about':
      return `<section id="${section.id}" class="about-section">
  <h2>About Me</h2>
  ${config.imageUrl ? `<img src="${config.imageUrl}" alt="${(config.imageAlt as string) || 'Profile'}" />` : ''}
  <p>${(config.bio as string) || 'Your bio...'}</p>
</section>`;
    case 'work':
      const projects = (config.projects as Array<{ title: string; description: string; imageUrl: string; link: string; tags: string[] }>) || [];
      return `<section id="${section.id}" class="work-section">
  <h2>Work</h2>
  ${projects.map(p => `
    <article class="project">
      ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" />` : ''}
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      ${p.tags ? `<div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
      ${p.link ? `<a href="${p.link}">View Project</a>` : ''}
    </article>`).join('')}
</section>`;
    case 'skills':
      const skills = (config.skills as Array<{ title: string; items: string[] }>) || [];
      return `<section id="${section.id}" class="skills-section">
  <h2>Skills</h2>
  ${skills.map(cat => `
    <div class="skill-category">
      <h3>${cat.title}</h3>
      <ul>${cat.items.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>`).join('')}
</section>`;
    case 'process':
      const steps = (config.steps as Array<{ title: string; description: string }>) || [];
      return `<section id="${section.id}" class="process-section">
  <h2>Process</h2>
  ${steps.map((step, i) => `
    <div class="step" data-step="${i + 1}">
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    </div>`).join('')}
</section>`;
    case 'contact':
      return `<section id="${section.id}" class="contact-section">
  <h2>${(config.heading as string) || 'Get in touch'}</h2>
  <p>${(config.email as string) || ''}</p>
  ${config.socials ? `<div class="socials">${(config.socials as Array<{ platform: string; url: string }>).map(s => 
    `<a href="${s.url}" data-platform="${s.platform}">${s.platform}</a>`).join('')}</div>` : ''}
</section>`;
    case 'custom':
      return (config.html as string) || '<!-- Custom HTML -->';
    default:
      return `<section id="${section.id}"><!-- Unknown type: ${section.type} --></section>`;
  }
}
