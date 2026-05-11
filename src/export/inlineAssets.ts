/** CDN URLs for libraries used in exported portfolios */
const CDN_URLS: Record<string, string> = {
  gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  scrolltrigger: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  lenis: 'https://unpkg.com/lenis@1.1.14/dist/lenis.min.js',
  three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  lucide: 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js',
};

/** Fetch a CDN script and return it as an inline <script> tag */
export async function fetchInlineScript(key: string): Promise<string> {
  const url = CDN_URLS[key];
  if (!url) return '';

  try {
    const response = await fetch(url);
    const code = await response.text();
    return `<script>/* ${key} */\n${code}\n</script>`;
  } catch (err) {
    console.warn(`Failed to inline ${key}, falling back to CDN`, err);
    return `<script src="${url}"></script>`;
  }
}

/** Fetch all CDN scripts for offline export */
export async function fetchAllInlineScripts(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.keys(CDN_URLS).map(async key => [key, await fetchInlineScript(key)] as const)
  );
  return Object.fromEntries(entries);
}
