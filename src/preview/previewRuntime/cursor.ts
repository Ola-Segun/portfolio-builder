// Custom cursor implementation

import type { CursorConfig } from '../../types/portfolio';

export function initCursor(config: CursorConfig): void {
  // Bail on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const inner = document.createElement('div');
  inner.id = 'cursor-inner';
  inner.style.cssText = `
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
    width: ${config.innerSize}px; height: ${config.innerSize}px;
    border-radius: 50%; background: currentColor;
    transform: translate(-50%, -50%);
    mix-blend-mode: ${config.blendMode};
  `;

  const outer = document.createElement('div');
  outer.id = 'cursor-outer';
  outer.style.cssText = `
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
    width: ${config.outerSize}px; height: ${config.outerSize}px;
    border-radius: 50%; border: 1.5px solid currentColor;
    transform: translate(-50%, -50%);
    mix-blend-mode: ${config.blendMode};
    transition: width 0.2s ease, height 0.2s ease, border-radius 0.2s ease;
  `;

  document.body.appendChild(inner);
  document.body.appendChild(outer);
  document.body.style.cursor = 'none';

  let mouseX = 0,
    mouseY = 0;
  let outerX = 0,
    outerY = 0;

  // Instant inner follow
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top = mouseY + 'px';
  });

  // Lerp-based outer follow
  const lerpFactor = config.lerpOuter;
  const tick = () => {
    outerX += (mouseX - outerX) * lerpFactor;
    outerY += (mouseY - outerY) * lerpFactor;
    outer.style.left = outerX + 'px';
    outer.style.top = outerY + 'px';
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Context-aware cursor morphing
  const interactiveElements = document.querySelectorAll('a, button');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outer.style.width = `${config.outerSize * 1.75}px`;
      outer.style.height = `${config.outerSize * 1.75}px`;
    });
    el.addEventListener('mouseleave', () => {
      outer.style.width = `${config.outerSize}px`;
      outer.style.height = `${config.outerSize}px`;
    });
  });

  const textElements = document.querySelectorAll('p, h1, h2, h3, span');
  textElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outer.style.width = `${config.outerSize * 2.5}px`;
      outer.style.height = `${config.innerSize}px`;
      outer.style.borderRadius = '2px';
    });
    el.addEventListener('mouseleave', () => {
      outer.style.width = `${config.outerSize}px`;
      outer.style.height = `${config.outerSize}px`;
      outer.style.borderRadius = '50%';
    });
  });
}
