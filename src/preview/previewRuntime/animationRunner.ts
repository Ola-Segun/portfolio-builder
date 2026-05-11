// GSAP animation runner — creates and controls timelines per section

import type { SectionAnimation } from '../../types/portfolio';

type Timeline = any; // GSAP timeline type

class AnimationRunner {
  private timelines = new Map<string, Timeline>();

  /** Register a new section animation */
  register(sectionId: string, config: SectionAnimation): void {
    const el = document.getElementById(sectionId);
    if (!el) {
      console.warn(`Section ${sectionId} not found for animation registration`);
      return;
    }

    // Kill existing timeline for this section (if any)
    this.kill(sectionId);

    // Build new timeline
    const tl = this.buildTimeline(el, config);

    // Create ScrollTrigger if scrubbing is enabled
    if (config.scrollTrigger.scrub) {
      // @ts-ignore - ScrollTrigger is a global from CDN
      ScrollTrigger.create({
        trigger: el,
        start: config.scrollTrigger.start,
        end: config.scrollTrigger.end,
        scrub: config.scrollTrigger.scrub,
        pin: config.scrollTrigger.pin,
        animation: tl,
      });
    } else {
      // Non-scrub: play once
      tl.play();
    }

    this.timelines.set(sectionId, tl);
  }

  private buildTimeline(el: Element, config: SectionAnimation): Timeline {
    const { duration, stagger, delay, ease, preset } = config;
    // @ts-ignore - gsap is a global from CDN
    const tl = gsap.timeline({ paused: !config.scrollTrigger.scrub });

    // Apply animation preset
    switch (preset) {
      case 'char-rise':
        this.applyCharRise(tl, el, { duration, stagger, ease });
        break;
      case 'clip-reveal':
        this.applyClipReveal(tl, el, { duration, ease });
        break;
      case 'fade-up':
        this.applyFadeUp(tl, el, { duration, stagger, delay, ease });
        break;
      case 'scale-in':
        this.applyScaleIn(tl, el, { duration, ease });
        break;
      case 'wipe-right':
        this.applyWipeRight(tl, el, { duration, ease });
        break;
      case 'none':
        // No animation
        break;
    }

    return tl;
  }

  // --- Preset implementations ---

  private applyCharRise(
    tl: Timeline,
    el: Element,
    opts: { duration: number; stagger: number; ease?: string }
  ): void {
    const heading = el.querySelector('[data-animate="heading"]');
    if (!heading) return;

    const text = heading.textContent || '';
    heading.innerHTML = text.split('').map(char =>
      char === ' '
        ? '<span style="display:inline-block">&nbsp;</span>'
        : `<span style="display:inline-block;will-change:transform,filter">${char}</span>`
    ).join('');

    const chars = heading.querySelectorAll('span');
    // @ts-ignore
    gsap.set(chars, { willChange: 'transform,filter' });

    tl.fromTo(chars,
      { y: 60, filter: 'blur(8px)', opacity: 0 },
      {
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: opts.duration,
        stagger: 0.03,
        ease: opts.ease || 'power3.out',
        onComplete: () => {
          // @ts-ignore
          gsap.set(chars, { willChange: 'auto' });
        },
      }
    );
  }

  private applyClipReveal(
    tl: Timeline,
    el: Element,
    opts: { duration: number; ease?: string }
  ): void {
    const targets = el.querySelectorAll('[data-animate]');
    tl.fromTo(targets,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: opts.duration,
        stagger: 0.1,
        ease: opts.ease || 'power4.inOut',
      }
    );
  }

  private applyFadeUp(
    tl: Timeline,
    el: Element,
    opts: { duration: number; stagger: number; delay: number; ease?: string }
  ): void {
    const targets = el.querySelectorAll('[data-animate]');
    tl.fromTo(targets,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration,
        stagger: opts.stagger,
        delay: opts.delay,
        ease: opts.ease || 'power3.out',
      }
    );
  }

  private applyScaleIn(
    tl: Timeline,
    el: Element,
    opts: { duration: number; ease?: string }
  ): void {
    const targets = el.querySelectorAll('[data-animate]');
    tl.fromTo(targets,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: opts.duration,
        stagger: 0.1,
        ease: opts.ease || 'back.out(1.7)',
      }
    );
  }

  private applyWipeRight(
    tl: Timeline,
    el: Element,
    opts: { duration: number; ease?: string }
  ): void {
    const targets = el.querySelectorAll('[data-animate]');
    tl.fromTo(targets,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: opts.duration,
        stagger: 0.08,
        ease: opts.ease || 'power2.out',
      }
    );
  }

  // --- Control methods ---

  /** Seek timeline to a specific progress (0–1) */
  seek(sectionId: string, progress: number): void {
    const tl = this.timelines.get(sectionId);
    if (tl) {
      tl.progress(progress);
    }
  }

  /** Update animation config for a section — kill + rebuild */
  update(sectionId: string, config: SectionAnimation): void {
    const existing = this.timelines.get(sectionId);
    if (existing) {
      existing.kill();
      // Also kill associated ScrollTrigger
      // @ts-ignore
      ScrollTrigger.getAll()
        .filter((t: any) => t.vars.animation === existing)
        .forEach((t: any) => t.kill());
    }
    // Re-register with new config
    const el = document.getElementById(sectionId);
    if (el) {
      this.register(sectionId, config);
    }
  }

  /** Kill timeline for a section */
  kill(sectionId: string): void {
    const tl = this.timelines.get(sectionId);
    if (tl) {
      tl.kill();
      this.timelines.delete(sectionId);
    }
  }
}

export const animationRunner = new AnimationRunner();

