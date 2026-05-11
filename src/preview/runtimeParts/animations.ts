/** Vanilla JS string: GSAP animation runner for the preview iframe */
export const ANIMATIONS_JS = `
var _timelines = {};

function registerAnimation(sectionId, config) {
  // Respect prefers-reduced-motion — skip animation entirely
  if (window.__reducedMotion) return;

  var el = document.getElementById(sectionId);
  if (!el || config.preset === 'none') return;

  // Kill existing timeline for this section before rebuilding
  if (_timelines[sectionId]) { _timelines[sectionId].kill(); }

  var tl = buildTimeline(el, config);
  if (!tl) return;

  if (config.scrollTrigger && config.scrollTrigger.scrub) {
    ScrollTrigger.create({
      trigger: el,
      start: config.scrollTrigger.start || 'top 80%',
      end: config.scrollTrigger.end || 'bottom 20%',
      scrub: config.scrollTrigger.scrub,
      pin: config.scrollTrigger.pin,
      animation: tl,
    });
  } else {
    ScrollTrigger.create({
      trigger: el,
      start: (config.scrollTrigger && config.scrollTrigger.start) || 'top 80%',
      onEnter: function() { tl.play(); },
      once: true,
    });
  }
  _timelines[sectionId] = tl;
}

function buildTimeline(el, config) {
  var tl = gsap.timeline({ paused: true });
  var dur = config.duration || 0.8;
  var stg = config.stagger || 0.1;
  var ease = config.ease || 'power3.out';
  var hasTargets = false;

  switch (config.preset) {
    case 'char-rise':
      var heading = el.querySelector('[data-animate="heading"]');
      if (heading) {
        hasTargets = true;
        var text = heading.textContent || '';
        heading.innerHTML = text.split('').map(function(ch) {
          return ch === ' '
            ? '<span style="display:inline-block">&nbsp;</span>'
            : '<span style="display:inline-block;will-change:transform,filter">' + ch + '</span>';
        }).join('');
        var chars = heading.querySelectorAll('span');
        tl.fromTo(chars,
          { y: 60, filter: 'blur(8px)', opacity: 0 },
          { y: 0, filter: 'blur(0px)', opacity: 1, duration: dur, stagger: 0.03, ease: ease,
            onComplete: function() { gsap.set(chars, { willChange: 'auto' }); }
          }
        );
        // Also animate remaining [data-animate] elements after heading
        var rest = el.querySelectorAll('[data-animate]:not([data-animate="heading"])');
        if (rest.length) tl.fromTo(rest, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: dur * 0.7, stagger: stg, ease: ease }, '-=0.4');
      }
      break;

    case 'clip-reveal':
      var ctargets = el.querySelectorAll('[data-animate]');
      if (ctargets.length) {
        hasTargets = true;
        tl.fromTo(ctargets,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, stagger: 0.12, ease: 'power4.inOut' }
        );
      }
      break;

    case 'fade-up':
      var ftargets = el.querySelectorAll('[data-animate]');
      if (ftargets.length) {
        hasTargets = true;
        tl.fromTo(ftargets,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: dur, stagger: stg, delay: config.delay || 0, ease: ease }
        );
      }
      break;

    case 'scale-in':
      var stargets = el.querySelectorAll('[data-animate]');
      if (stargets.length) {
        hasTargets = true;
        tl.fromTo(stargets,
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, duration: dur, stagger: 0.1, ease: 'back.out(1.7)' }
        );
      }
      break;

    case 'wipe-right':
      var wtargets = el.querySelectorAll('[data-animate]');
      if (wtargets.length) {
        hasTargets = true;
        tl.fromTo(wtargets,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: dur, stagger: 0.08, ease: 'power2.out' }
        );
      }
      break;
  }

  return hasTargets ? tl : null;
}

function seekAnimation(sectionId, progress) {
  if (_timelines[sectionId]) _timelines[sectionId].progress(progress).pause();
}

function updateAnimation(sectionId, config) {
  // Kill old timeline + its ScrollTrigger
  if (_timelines[sectionId]) {
    var old = _timelines[sectionId];
    ScrollTrigger.getAll().forEach(function(t) {
      if (t.vars && t.vars.animation === old) t.kill();
    });
    old.kill();
    delete _timelines[sectionId];
  }
  registerAnimation(sectionId, config);
}
`;
