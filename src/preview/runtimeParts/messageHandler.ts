/** Vanilla JS string: postMessage bridge handler + init bootstrap */
export const MESSAGE_HANDLER_JS = `
window.addEventListener('message', function(e) {
  var msg = e.data;
  if (!msg || !msg.type) return;

  switch (msg.type) {
    case 'SECTION_UPDATE':
      updateSectionDOM(msg.sectionId, msg.data);
      break;

    case 'REORDER_SECTIONS':
      var store = window.__STORE__;
      var map = {};
      store.sections.forEach(function(s) { map[s.id] = s; });
      store.sections = msg.order.map(function(id) { return map[id]; }).filter(Boolean);
      renderAllSections(store);
      store.sections.forEach(function(s) {
        if (s.visible && !window.__reducedMotion) registerAnimation(s.id, s.animation);
      });
      break;

    case 'SECTION_VISIBILITY':
      var vs = window.__STORE__.sections.find(function(s) { return s.id === msg.sectionId; });
      if (vs) {
        vs.visible = msg.visible;
        renderAllSections(window.__STORE__);
      }
      break;

    case 'SECTION_LAYOUT':
      var ls = window.__STORE__.sections.find(function(s) { return s.id === msg.sectionId; });
      if (ls) {
        ls.layout = msg.layout;
        if (!ls.layoutConfigs) ls.layoutConfigs = {};
        // Merge incoming config snapshot for this variant (non-destructive)
        ls.layoutConfigs[msg.layout] = Object.assign({}, ls.layoutConfigs[msg.layout] || {}, msg.config);
        ls.config = ls.layoutConfigs[msg.layout];
        var lEl = document.getElementById(msg.sectionId);
        if (lEl) lEl.replaceWith(renderSection(ls, window.__STORE__));
        if (!window.__reducedMotion) registerAnimation(msg.sectionId, ls.animation);
      }
      break;

    case 'SECTION_STYLES':
      var stsSection = window.__STORE__.sections.find(function(s) { return s.id === msg.sectionId; });
      if (stsSection) {
        stsSection.styles = Object.assign({}, stsSection.styles || {}, msg.styles);
        var stsEl = document.getElementById(msg.sectionId);
        if (stsEl) stsEl.replaceWith(renderSection(stsSection, window.__STORE__));
      }
      break;

    case 'SECTION_BACKGROUND':
      var bgSection = window.__STORE__.sections.find(function(s) { return s.id === msg.sectionId; });
      if (bgSection) {
        bgSection.background = Object.assign({}, bgSection.background || {}, msg.background);
        var bgEl = document.getElementById(msg.sectionId);
        if (bgEl) bgEl.replaceWith(renderSection(bgSection, window.__STORE__));
      }
      break;

    case 'THEME_CHANGE':
      window.__STORE__.theme = msg.theme;
      applyTheme(msg.theme);
      updateWebGLPalette(msg.theme.colors);
      break;

    case 'FONT_CHANGE':
      window.__STORE__.typography.headingFont = msg.heading;
      window.__STORE__.typography.bodyFont = msg.body;
      // Remove old injected font link
      var old = document.querySelectorAll('link[data-injected-font]');
      old.forEach(function(l) { l.remove(); });
      var lk = document.createElement('link');
      lk.rel = 'stylesheet';
      lk.setAttribute('data-injected-font', 'true');
      lk.href = 'https://fonts.googleapis.com/css2?family=' +
        encodeURIComponent(msg.heading) + ':wght@100..900&family=' +
        encodeURIComponent(msg.body) + ':wght@300;400;500&display=swap';
      document.head.appendChild(lk);
      // Update CSS vars
      var fvStyle = document.getElementById('font-vars') || document.createElement('style');
      fvStyle.id = 'font-vars';
      fvStyle.textContent = ':root{' +
        '--font-heading:"' + msg.heading + '",sans-serif;' +
        '--font-body:"' + msg.body + '",sans-serif;' +
        (msg.headingWeight ? '--heading-weight:' + msg.headingWeight + ';' : '') +
      '}';
      if (!fvStyle.parentNode) document.head.appendChild(fvStyle);
      break;

    case 'ANIMATION_SEEK':
      seekAnimation(msg.sectionId, msg.progress);
      break;

    case 'ANIMATION_UPDATE':
      updateAnimation(msg.sectionId, msg.animation);
      break;

    case 'LENIS_CONFIG':
      if (window.__lenis) {
        if (msg.config.lerp !== undefined) window.__lenis.options.lerp = msg.config.lerp;
        if (msg.config.smoothWheel !== undefined) window.__lenis.options.smoothWheel = msg.config.smoothWheel;
        if (msg.config.wheelMultiplier !== undefined) window.__lenis.options.wheelMultiplier = msg.config.wheelMultiplier;
      }
      break;

    case 'WEBGL_CONFIG':
      window.__STORE__.webgl = Object.assign(window.__STORE__.webgl || {}, msg.config);
      if (window.__webglUniforms) {
        if (msg.config.opacity !== undefined)
          window.__webglUniforms.uOpacity.value = msg.config.opacity;
        if (msg.config.uniforms) {
          if (msg.config.uniforms.uDistortion !== undefined)
            window.__webglUniforms.uDistortion.value = msg.config.uniforms.uDistortion;
        }
      }
      // Show/hide canvas
      var wCanvas = document.getElementById('webgl-canvas');
      if (wCanvas && msg.config.enabled !== undefined) {
        wCanvas.style.display = msg.config.enabled ? 'block' : 'none';
      }
      break;

    case 'CURSOR_CONFIG':
      var cfg = msg.config;
      // Merge into live config object — RAF loop reads this directly
      if (window.__cursorConfig) {
        Object.assign(window.__cursorConfig, cfg);
      }
      // Handle enable/disable toggle
      if (cfg.enabled === true && !window.__cursorRaf) {
        // Re-init cursor with current merged config
        initCursor(window.__STORE__.cursor);
      } else if (cfg.enabled === false && window.__cursorRaf) {
        destroyCursor();
      }
      // For size/blendMode changes, reapply styles immediately
      if (window.__cursorApplyStyles && cfg.enabled !== false) {
        window.__cursorApplyStyles();
        // Also reapply outer size in case it was overridden by hover state
        var outerEl = document.getElementById('cursor-outer');
        if (outerEl && cfg.outerSize !== undefined) {
          outerEl.style.width  = cfg.outerSize + 'px';
          outerEl.style.height = cfg.outerSize + 'px';
        }
      }
      break;

    case 'VIEWPORT_RESIZE':
      // Trigger resize events so WebGL + ScrollTrigger recalculate
      ScrollTrigger.refresh(true);
      window.dispatchEvent(new Event('resize'));
      break;

    case 'FULL_REFRESH':
      window.__STORE__ = msg.state;
      renderAllSections(msg.state);
      applyTheme(msg.state.theme);
      updateNav(msg.state);
      if (!window.__reducedMotion) {
        msg.state.sections.forEach(function(s) {
          if (s.visible) registerAnimation(s.id, s.animation);
        });
      }
      break;
  }
});

// ── Nav updater (called on FULL_REFRESH so meta changes reflect) ──────────
function updateNav(state) {
  var logo = document.querySelector('#site-nav-preview .nav-logo');
  if (logo) logo.textContent = (state.meta && state.meta.name) || 'Portfolio';

  var linksEl = document.querySelector('#site-nav-preview .nav-links');
  if (linksEl) {
    linksEl.innerHTML = state.sections
      .filter(function(s) { return s.visible && s.type !== 'custom'; })
      .map(function(s) {
        return '<a href="#' + s.id + '" style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;transition:color 0.2s;">' + s.type + '</a>';
      }).join('');
  }
}

// ── Bootstrap ────────────────────────────────────────────────────────────
(function init() {
  window.__reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);
  var store = window.__STORE__;

  renderAllSections(store);
  initLenis(store.animation.lenis);
  if (store.webgl && store.webgl.enabled) initWebGL(store);
  if (store.cursor && store.cursor.enabled) initCursor(store.cursor);
  initInPlaceEditing();

  if (!window.__reducedMotion) {
    store.sections.forEach(function(s) {
      if (s.visible) registerAnimation(s.id, s.animation);
    });
  } else {
    // Reduced motion: instantly reveal all animated elements
    store.sections.forEach(function(s) {
      var el = document.getElementById(s.id);
      if (el) {
        el.querySelectorAll('[data-animate]').forEach(function(a) {
          a.style.opacity   = '1';
          a.style.transform = 'none';
          a.style.filter    = 'none';
          a.style.clipPath  = 'none';
        });
      }
    });
  }

  // ── Scroll progress bar ───────────────────────────────────────────────
  var progressBar = document.getElementById('scroll-progress');
  if (progressBar && !window.__reducedMotion) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
      },
    });
  } else if (progressBar) {
    progressBar.style.display = 'none';
  }

  // ── Nav scroll highlight ──────────────────────────────────────────────
  var nav = document.getElementById('site-nav-preview');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
})();
`;
