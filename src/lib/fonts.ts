const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=';

/** Curated list of high-quality font pairing candidates */
export const FEATURED_FONTS = {
  display: [
    'Playfair Display', 'DM Serif Display', 'Fraunces',
    'Cormorant Garamond', 'Bodoni Moda', 'Big Shoulders Display',
    'Unbounded', 'Space Grotesk', 'Syne',
  ],
  body: [
    'Inter', 'DM Sans', 'Plus Jakarta Sans', 'Outfit',
    'Manrope', 'General Sans', 'Satoshi', 'Cabinet Grotesk',
  ],
};

/** Inject fonts into an iframe's document */
export function injectFontsIntoFrame(
  iframe: HTMLIFrameElement,
  headingFont: string,
  bodyFont: string,
  weights = '100..900'
): void {
  const doc = iframe.contentDocument;
  if (!doc) return;

  // Remove old font links
  doc.querySelectorAll('link[data-font]').forEach(l => l.remove());

  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.setAttribute('data-font', 'true');
  link.href = `${GOOGLE_FONTS_API}${encodeURIComponent(headingFont)}:wght@${weights}&family=${encodeURIComponent(bodyFont)}:wght@300;400;500&display=swap`;
  doc.head.appendChild(link);

  // Update CSS variables in preview
  const style = doc.getElementById('font-vars') || doc.createElement('style');
  style.id = 'font-vars';
  style.textContent = `
    :root {
      --font-heading: '${headingFont}', sans-serif;
      --font-body: '${bodyFont}', sans-serif;
    }
  `;
  doc.head.appendChild(style);
}

/** Build a Google Fonts URL for given font families */
export function buildFontUrl(headingFont: string, bodyFont: string): string {
  return `${GOOGLE_FONTS_API}${encodeURIComponent(headingFont)}:wght@100..900&family=${encodeURIComponent(bodyFont)}:wght@300;400;500&display=swap`;
}
