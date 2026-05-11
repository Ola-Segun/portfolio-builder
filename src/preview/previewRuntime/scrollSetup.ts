// Lenis smooth scroll setup and GSAP ticker sync

import type { LenisConfig } from '../../types/portfolio';

// Extend LenisConfig with additional runtime options
interface FullLenisConfig extends LenisConfig {
  duration?: number;
  easing?: (t: number) => number;
  direction?: string;
  gestureDirection?: string;
  smooth?: boolean;
  mouseMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
}

declare const Lenis: new (config: FullLenisConfig) => {
  on: (event: string, callback: () => void) => void;
  raf: (time: number) => void;
  scrollTo: (value: number, opts?: { immediate?: boolean }) => void;
  options: FullLenisConfig;
  actualScroll: number;
};

let lenis: InstanceType<typeof Lenis> | null = null;

export function initLenis(config: LenisConfig): void {
  lenis = new Lenis({
    lerp: config.lerp,
    smoothWheel: config.smoothWheel,
    wheelMultiplier: config.wheelMultiplier,
    // Additional sensible defaults
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP ticker
  // @ts-ignore - gsap global
  gsap.ticker.add((time: number) => {
    lenis!.raf(time * 1000);
  });

  // Disable GSAP's lag smoothing (Lenis handles its own smoothing)
  // @ts-ignore
  gsap.ticker.lagSmoothing(0);

  // Wire Lenis scroll events to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Expose for runtime message handlers (SCROLL_RESTORE, SCROLL_TO_SECTION)
  (window as any).__lenis = lenis;

  // Provide scroller proxy to ScrollTrigger
  // @ts-ignore
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value: number) {
      if (arguments.length) {
        lenis!.scrollTo(value, { immediate: true });
      }
      return lenis!.actualScroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });
}

/** Update Lenis options at runtime */
export function updateLenisConfig(config: Partial<LenisConfig>): void {
  if (!lenis) return;
  if (config.lerp !== undefined) lenis.options.lerp = config.lerp;
  if (config.smoothWheel !== undefined) lenis.options.smoothWheel = config.smoothWheel;
}
