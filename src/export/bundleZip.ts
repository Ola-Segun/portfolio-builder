import JSZip from 'jszip';
import type { PortfolioStore } from '../types/portfolio';
import { buildHTML } from './buildHTML';

/** Bundle the exported portfolio into a downloadable ZIP */
export async function bundleExport(store: PortfolioStore): Promise<Blob> {
  const html = buildHTML(store);
  const zip = new JSZip();

  zip.file('index.html', html);
  zip.file('README.md', generateReadme(store));

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

/** Download a Blob as a file */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateReadme(store: PortfolioStore): string {
  return `# ${store.meta.name} — Portfolio

${store.meta.tagline}

## About

This portfolio was built with Portfolio Builder. It is a self-contained single-page HTML file with:

- GSAP scroll-driven animations
- Lenis smooth scrolling
- Custom cursor effects
- WebGL background (Three.js)

## Usage

Open \`index.html\` in any modern browser. No server required.

## Contact

- Email: ${store.meta.email}
${store.meta.socials.map(s => `- ${s.platform}: ${s.url}`).join('\n')}
`;
}
