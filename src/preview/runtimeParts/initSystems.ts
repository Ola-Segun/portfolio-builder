/** Vanilla JS string: Lenis, WebGL (Three.js), and cursor init for the preview iframe */
export const INIT_SYSTEMS_JS = `
function initLenis(config) {
  if (typeof Lenis === 'undefined') return;
  var lenis = new Lenis({
    lerp: config.lerp || 0.08,
    smoothWheel: config.smoothWheel !== false,
    wheelMultiplier: config.wheelMultiplier || 1,
  });
  gsap.ticker.add(function(time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop: function(value) {
      if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
      return lenis.actualScroll;
    },
    getBoundingClientRect: function() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });
  window.__lenis = lenis;
}

function initWebGL(store) {
  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 1;
  var uniforms = {
    uTime: { value: 0 },
    uScrollVelocity: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uAccent: { value: new THREE.Color(store.theme.colors.accent) },
    uBackground: { value: new THREE.Color(store.theme.colors.background) },
    uDistortion: { value: (store.webgl.uniforms && store.webgl.uniforms.uDistortion) || 0.3 },
    uOpacity: { value: store.webgl.opacity || 0.8 },
  };
  var vertShader = "uniform float uTime;uniform float uScrollVelocity;uniform vec2 uMouse;uniform float uDistortion;varying vec2 vUv;void main(){vUv=uv;vec3 pos=position;float dist=distance(uv,uMouse);float inf=smoothstep(0.8,0.0,dist);pos.z+=inf*uDistortion*0.4;pos.z+=sin(uv.x*6.0+uTime*0.8)*uScrollVelocity*0.08;pos.z+=cos(uv.y*4.0+uTime*0.6)*uScrollVelocity*0.05;pos.z+=sin(uv.x*3.0+uTime*0.4)*0.03;pos.z+=cos(uv.y*5.0+uTime*0.3)*0.02;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}";
  var fragShader = "uniform vec3 uAccent;uniform vec3 uBackground;uniform float uOpacity;uniform float uTime;varying vec2 vUv;void main(){float t=smoothstep(0.0,1.0,vUv.y+sin(uTime*0.3)*0.1);vec3 col=mix(uBackground,uAccent,t*0.15);float vig=smoothstep(0.0,0.5,distance(vUv,vec2(0.5)));col=mix(col,uBackground,vig*0.6);gl_FragColor=vec4(col,uOpacity*(1.0-vig*0.4));}";
  var mat = new THREE.ShaderMaterial({ vertexShader: vertShader, fragmentShader: fragShader, uniforms: uniforms, transparent: true, depthWrite: false });
  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5, 128, 128), mat);
  scene.add(mesh);
  window.addEventListener('mousemove', function(e) {
    uniforms.uMouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  });
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { cancelAnimationFrame(window.__webglRaf); } else { tick(performance.now()); }
  });
  function tick(time) { uniforms.uTime.value = time * 0.001; renderer.render(scene, camera); window.__webglRaf = requestAnimationFrame(tick); }
  window.__webglUniforms = uniforms;
  tick(performance.now());
}

/* ── Cursor system ───────────────────────────────────────────────────────
   Fixes vs original:
   1. Uses window.__cursorConfig (live object) instead of stale closure vars
      → lerp/size changes apply instantly without restart
   2. Event delegation on document for hover scale
      → works for dynamically added sections/links
   3. destroyCursor() for clean enable/disable toggle
   4. Pointer-coarse guard (mobile skip)
──────────────────────────────────────────────────────────────────────── */
function initCursor(config) {
  // Skip on touch/mobile devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Store config live so RAF loop reads current values
  window.__cursorConfig = Object.assign({ innerSize:8, outerSize:24, lerpOuter:0.15, blendMode:'difference' }, config);

  var inner = document.getElementById('cursor-inner');
  var outer = document.getElementById('cursor-outer');
  if (!inner || !outer) return;

  // Apply base styles
  function applyStyles() {
    var cfg = window.__cursorConfig;
    var blendVal = 'mix-blend-mode:' + cfg.blendMode + ';';
    inner.style.cssText = [
      'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;',
      'border-radius:50%;background:currentColor;will-change:transform;',
      'width:' + cfg.innerSize + 'px;height:' + cfg.innerSize + 'px;',
      'transform:translate(-50%,-50%);', blendVal,
    ].join('');
    outer.style.cssText = [
      'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;',
      'border-radius:50%;border:1.5px solid currentColor;will-change:transform;',
      'width:' + cfg.outerSize + 'px;height:' + cfg.outerSize + 'px;',
      'transform:translate(-50%,-50%);',
      'transition:width 0.18s ease,height 0.18s ease,opacity 0.15s ease;',
      blendVal,
    ].join('');
  }
  applyStyles();

  document.body.style.cursor = 'none';

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var ox = mx, oy = my;
  var isHovering = false;

  // Immediate: inner dot tracks exactly
  window.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    inner.style.left = mx + 'px';
    inner.style.top  = my + 'px';
  }, { passive: true });

  // Event delegation for hover → no querySelectorAll needed
  document.addEventListener('mouseover', function(e) {
    var el = e.target;
    if (el && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('a,button'))) {
      isHovering = true;
      var cfg = window.__cursorConfig;
      outer.style.width  = (cfg.outerSize * 1.8) + 'px';
      outer.style.height = (cfg.outerSize * 1.8) + 'px';
    }
  });
  document.addEventListener('mouseout', function(e) {
    var rel = e.relatedTarget;
    if (!rel || (rel.tagName !== 'A' && rel.tagName !== 'BUTTON' && !rel.closest('a,button'))) {
      isHovering = false;
      var cfg = window.__cursorConfig;
      outer.style.width  = cfg.outerSize + 'px';
      outer.style.height = cfg.outerSize + 'px';
    }
  });

  // Show/hide on window enter/leave
  document.addEventListener('mouseleave', function() { outer.style.opacity = '0'; inner.style.opacity = '0'; });
  document.addEventListener('mouseenter', function() { outer.style.opacity = '1'; inner.style.opacity = '1'; });

  // RAF loop: reads window.__cursorConfig.lerpOuter live — no stale closure
  function loop() {
    var lf = window.__cursorConfig ? window.__cursorConfig.lerpOuter : 0.15;
    ox += (mx - ox) * lf;
    oy += (my - oy) * lf;
    outer.style.left = ox + 'px';
    outer.style.top  = oy + 'px';
    window.__cursorRaf = requestAnimationFrame(loop);
  }
  loop();

  // Expose so CURSOR_CONFIG bridge message can update live
  window.__cursorApplyStyles = applyStyles;
}

function destroyCursor() {
  if (window.__cursorRaf) {
    cancelAnimationFrame(window.__cursorRaf);
    window.__cursorRaf = null;
  }
  document.body.style.cursor = '';
  var inner = document.getElementById('cursor-inner');
  var outer = document.getElementById('cursor-outer');
  if (inner) inner.style.cssText = '';
  if (outer) outer.style.cssText = '';
}

function applyTheme(theme) {
  var r = document.documentElement;
  var c = theme.components || {};
  var btn     = c.button  || {};
  var card    = c.card    || {};
  var tag     = c.tag     || {};
  var heading = c.heading || {};
  var divider = c.divider || {};
  var input   = c.input   || {};
  var surf    = c.surface || {};

  // ── Color tokens ──────────────────────────────────────────────────────────
  r.style.setProperty('--bg',           theme.colors.background);
  r.style.setProperty('--surface',      theme.colors.surface);
  r.style.setProperty('--text',         theme.colors.text);
  r.style.setProperty('--text-muted',   theme.colors.textMuted);
  r.style.setProperty('--accent',       theme.colors.accent);
  r.style.setProperty('--accent-muted', theme.colors.accentMuted);
  r.style.setProperty('--border',       theme.colors.border);
  document.body.style.background = theme.colors.background;
  document.body.style.color = theme.colors.text;

  // ── Button tokens ─────────────────────────────────────────────────────────
  r.style.setProperty('--btn-radius',         btn.radius         || '4px');
  r.style.setProperty('--btn-letter-spacing', btn.letterSpacing  || '0.04em');
  r.style.setProperty('--btn-text-transform', btn.textTransform  || 'none');
  r.style.setProperty('--btn-padding',        btn.padding        || '0.85rem 1.75rem');
  r.style.setProperty('--btn-font-size',      btn.fontSize       || '0.875rem');
  r.style.setProperty('--btn-font-weight',    String(btn.fontWeight || 500));
  r.style.setProperty('--btn-shadow',         btn.shadow         || 'none');

  // ── Card tokens ───────────────────────────────────────────────────────────
  r.style.setProperty('--card-radius',          card.radius         || '8px');
  r.style.setProperty('--card-shadow',          card.shadow         || '0 2px 12px rgba(0,0,0,0.08)');
  r.style.setProperty('--card-border',          card.border         || '1px solid var(--border)');
  r.style.setProperty('--card-bg',              card.background     || 'var(--surface)');
  r.style.setProperty('--card-hover-transform', card.hoverTransform || 'translateY(-3px)');
  r.style.setProperty('--card-hover-shadow',    card.hoverShadow    || '0 8px 32px rgba(0,0,0,0.12)');
  r.style.setProperty('--card-padding',         card.padding        || '1.5rem');

  // ── Tag tokens ────────────────────────────────────────────────────────────
  r.style.setProperty('--tag-radius',         tag.radius        || '4px');
  r.style.setProperty('--tag-padding',        tag.padding       || '0.25rem 0.6rem');
  r.style.setProperty('--tag-font-size',      tag.fontSize      || '0.7rem');
  r.style.setProperty('--tag-letter-spacing', tag.letterSpacing || '0.04em');
  r.style.setProperty('--tag-text-transform', tag.textTransform || 'none');
  r.style.setProperty('--tag-border',         tag.border        || 'none');
  r.style.setProperty('--tag-bg',             tag.background    || 'var(--accent-muted)');
  r.style.setProperty('--tag-color',          tag.color         || 'var(--accent)');

  // ── Heading tokens ────────────────────────────────────────────────────────
  r.style.setProperty('--heading-letter-spacing', heading.letterSpacing || '-0.03em');
  r.style.setProperty('--heading-line-height',    heading.lineHeight    || '1.05');
  r.style.setProperty('--heading-text-transform', heading.textTransform || 'none');
  r.style.setProperty('--heading-font-style',     heading.fontStyle     || 'normal');

  // ── Divider tokens ────────────────────────────────────────────────────────
  r.style.setProperty('--divider-style',     divider.style     || 'solid');
  r.style.setProperty('--divider-opacity',   divider.opacity   || '0.2');
  r.style.setProperty('--divider-thickness', divider.thickness || '1px');

  // ── Input tokens ──────────────────────────────────────────────────────────
  r.style.setProperty('--input-radius',       input.radius      || '6px');
  r.style.setProperty('--input-border',       input.border      || '1px solid var(--border)');
  r.style.setProperty('--input-bg',           input.background  || 'var(--surface)');
  r.style.setProperty('--input-focus-border', input.focusBorder || '1px solid var(--accent)');
  r.style.setProperty('--input-padding',      input.padding     || '0.75rem 1rem');

  // ── Surface tokens ────────────────────────────────────────────────────────
  r.style.setProperty('--surface-backdrop', surf.backdropFilter || 'blur(12px)');

  // ── Image tokens ──────────────────────────────────────────────────────────
  var img = c.image || {};
  r.style.setProperty('--img-radius',          img.radius         || '0px');
  r.style.setProperty('--img-object-fit',      img.objectFit      || 'cover');
  r.style.setProperty('--img-aspect-ratio',    img.aspectRatio    || 'auto');
  r.style.setProperty('--img-border',          img.border         || 'none');
  r.style.setProperty('--img-shadow',          img.shadow         || 'none');
  r.style.setProperty('--img-filter',          img.filter         || 'none');
  r.style.setProperty('--img-hover-filter',    img.hoverFilter    || 'none');
  r.style.setProperty('--img-hover-transform', img.hoverTransform || 'scale(1.02)');
  r.style.setProperty('--img-transition',      img.transition     || '0.4s ease');

  // ── Button variant CSS block (swapped when variant changes) ──────────────
  var variantStyle = document.getElementById('btn-variant-css');
  if (!variantStyle) {
    variantStyle = document.createElement('style');
    variantStyle.id = 'btn-variant-css';
    document.head.appendChild(variantStyle);
  }
  var variant = btn.variant || 'fill';
  var dark = theme.darkMode;
  var onAccent = dark ? '#000' : '#fff';
  var shadow = btn.shadow || 'none';
  var variantCSS = '';
  if (variant === 'fill') {
    variantCSS = '.btn,.btn-primary{background:var(--accent);color:' + onAccent + ';border:2px solid var(--accent);}' +
      '.btn:hover,.btn-primary:hover{opacity:.88;box-shadow:' + shadow + ';transform:translateY(-1px);}' +
      '.btn:active{transform:translateY(0);opacity:1;}';
  } else if (variant === 'outline') {
    variantCSS = '.btn,.btn-primary{background:transparent;color:var(--accent);border:1.5px solid var(--accent);}' +
      '.btn:hover,.btn-primary:hover{background:var(--accent);color:' + onAccent + ';box-shadow:' + shadow + ';transform:translateY(-1px);}' +
      '.btn:active{transform:translateY(0);}';
  } else if (variant === 'ghost') {
    variantCSS = '.btn,.btn-primary{background:transparent;color:var(--text);border:1px solid var(--border);}' +
      '.btn:hover,.btn-primary:hover{background:var(--surface);border-color:var(--text-muted);transform:translateY(-1px);}' +
      '.btn:active{transform:translateY(0);}';
  } else if (variant === 'pill') {
    variantCSS = '.btn,.btn-primary{background:var(--accent);color:' + onAccent + ';border:none;border-radius:999px;}' +
      '.btn:hover,.btn-primary:hover{opacity:.88;box-shadow:' + shadow + ';transform:translateY(-2px) scale(1.02);}' +
      '.btn:active{transform:translateY(0) scale(1);}';
  } else {
    variantCSS = '.btn,.btn-primary{background:var(--accent);color:' + onAccent + ';border:2px solid var(--accent);}' +
      '.btn:hover,.btn-primary:hover{opacity:.85;box-shadow:' + shadow + ';}';
  }
  variantStyle.textContent = variantCSS;

  // ── Theme style body class ────────────────────────────────────────────────
  document.body.className = (document.body.className || '').replace(/\btheme-style-\S+/g, '').trim();
  if (theme.style) document.body.classList.add('theme-style-' + theme.style);
}

function updateWebGLPalette(colors) {
  if (!window.__webglUniforms) return;
  window.__webglUniforms.uAccent.value.set(colors.accent);
  window.__webglUniforms.uBackground.value.set(colors.background);
}
`;
