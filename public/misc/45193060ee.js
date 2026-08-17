/* Future Architecture — motion, rail, timeline axis, topic strip.
   Self-initialising; rescans on DOM mutation (streamed markup). */
(function () {
  if (window.FA) return;
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(el) {
    var d = parseInt(el.getAttribute('data-delay') || '0', 10);
    if (reduce) { el.style.transition = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; return; }
    var prev = el.style.transition ? el.style.transition + ', ' : '';
    el.style.transition = prev + 'opacity 500ms ' + EASE + ' ' + d + 'ms, transform 500ms ' + EASE + ' ' + d + 'ms';
    requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  function draw(el, ms) {
    var final = el.getAttribute('data-dir') === 'y' ? 'scaleY(1)' : 'scaleX(1)';
    if (reduce) { el.style.transition = 'none'; el.style.transform = final; return; }
    var d = parseInt(el.getAttribute('data-delay') || '0', 10);
    var dur = parseInt(el.getAttribute('data-ms') || '0', 10) || ms || 600;
    el.style.transition = 'transform ' + dur + 'ms ' + (el.getAttribute('data-ease') || EASE) + ' ' + d + 'ms';
    requestAnimationFrame(function () { el.style.transform = final; });
  }

  function fill(el) {
    var to = el.hasAttribute('data-unfill') ? 'scaleY(0)' : 'scaleY(1)';
    if (reduce) { el.style.transition = 'none'; el.style.transform = to; return; }
    el.style.transition = 'transform 700ms cubic-bezier(.16,1,.3,1)';
    requestAnimationFrame(function () { el.style.transform = to; });
  }

  function count(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 900, t0 = 0;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  function grow(el) {
    var v = el.getAttribute('data-grow');
    if (reduce) { el.style.width = v + '%'; return; }
    var d = parseInt(el.getAttribute('data-delay') || '0', 10);
    el.style.transition = 'width 1000ms ' + EASE + ' ' + d + 'ms';
    requestAnimationFrame(function () { el.style.width = v + '%'; });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      io.unobserve(el);
      el.setAttribute('data-done', '1');
      if (el.hasAttribute('data-reveal')) reveal(el);
      else if (el.hasAttribute('data-fill') || el.hasAttribute('data-unfill')) fill(el);
      else if (el.hasAttribute('data-draw')) draw(el, 400);
      else if (el.hasAttribute('data-bar')) draw(el, 700);
      else if (el.hasAttribute('data-count')) count(el);
      else if (el.hasAttribute('data-grow')) grow(el);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

  function scan() {
    var sel = '[data-reveal]:not([data-done]),[data-fill]:not([data-done]),[data-unfill]:not([data-done]),[data-draw]:not([data-done]),[data-bar]:not([data-done]),[data-count]:not([data-done]),[data-grow]:not([data-done])';
    document.querySelectorAll(sel).forEach(function (el) { io.observe(el); });
    bindStrips();
  }

  /* ---- header ---- */
  var header, headerInner, lastState = null;
  function onHeader() {
    header = header || document.querySelector('[data-header]');
    if (!header) return;
    headerInner = headerInner || header.querySelector('[data-header-inner]');
    var s = window.scrollY > 12;
    if (s === lastState) return;
    lastState = s;
    var solid = header.hasAttribute('data-header-solid');
    var dark = header.hasAttribute('data-header-dark');
    var rgb = dark ? '16,18,22' : '247,246,243';
    header.style.background = (s || solid) ? 'rgba(' + rgb + ',.92)' : 'rgba(' + rgb + ',0)';
    header.style.backdropFilter = (s || solid) ? 'saturate(140%) blur(10px)' : 'none';
    header.style.webkitBackdropFilter = (s || solid) ? 'saturate(140%) blur(10px)' : 'none';
    header.style.borderBottomColor = (s || solid) ? (dark ? '#2A2E35' : '#DCDAD4') : 'transparent';
    if (headerInner) headerInner.style.paddingTop = headerInner.style.paddingBottom = s ? '16px' : '24px';
  }

  /* ---- left rail: section index (community) ---- */
  function onRail() {
    var rail = document.querySelector('[data-rail]');
    if (!rail) return;
    var show = window.scrollY > window.innerHeight * 0.55;
    rail.style.opacity = show ? '1' : '0';
    var items = rail.querySelectorAll('[data-rail-item]');
    if (!items.length) return;
    var best = null, bestTop = -1e9;
    items.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('data-target'));
      if (!t) return;
      var top = t.getBoundingClientRect().top - 140;
      if (top <= 0 && top > bestTop) { bestTop = top; best = a; }
    });
    items.forEach(function (a) {
      var on = a === best;
      a.style.color = on ? '#16181D' : '#5C5F66';
      var dot = a.querySelector('[data-rail-dot]');
      if (dot) dot.style.background = on ? '#FF4002' : 'transparent';
    });
  }

  /* ---- left rail: day axis (forum) ---- */
  function onAxis() {
    var axis = document.querySelector('[data-axis]');
    if (!axis) return;
    var show = window.scrollY > window.innerHeight * 0.55;
    axis.style.opacity = show ? '1' : '0';
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var fill = axis.querySelector('[data-axis-fill]');
    if (fill) fill.style.transform = 'scaleY(' + p.toFixed(3) + ')';
    var ticks = axis.querySelectorAll('[data-axis-tick]');
    var idx = Math.min(ticks.length - 1, Math.floor(p * ticks.length));
    ticks.forEach(function (t, i) {
      t.style.background = i <= idx ? '#FF4002' : '#5C5F66';
      t.style.width = i === idx ? '18px' : '10px';
    });
    var label = axis.querySelector('[data-axis-label]');
    if (label && ticks[idx]) label.textContent = ticks[idx].getAttribute('data-stage') || '';
  }

  /* ---- horizontal topic strip ---- */
  function bindStrips() {
    document.querySelectorAll('[data-strip]:not([data-bound])').forEach(function (strip) {
      strip.setAttribute('data-bound', '1');
      var prog = (strip.parentElement && strip.parentElement.querySelector('[data-strip-progress]')) || null;
      function update() {
        if (!prog) return;
        var max = strip.scrollWidth - strip.clientWidth;
        var p = max > 0 ? strip.scrollLeft / max : 0;
        prog.style.transform = 'scaleX(' + (0.12 + 0.88 * p).toFixed(3) + ')';
      }
      strip.addEventListener('scroll', update, { passive: true });
      strip.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        var max = strip.scrollWidth - strip.clientWidth;
        var next = strip.scrollLeft + e.deltaY;
        if (next > 0 && next < max) { e.preventDefault(); strip.scrollLeft = next; }
      }, { passive: false });
      update();
    });
  }

  /* ---- countdown ---- */
  function tickCountdown() {
    document.querySelectorAll('[data-countdown]').forEach(function (el) {
      var target = Date.parse(el.getAttribute('data-target') || '');
      if (isNaN(target)) return;
      var diff = Math.max(0, target - Date.now());
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var map = { d: d, h: h, m: m, s: s };
      el.querySelectorAll('[data-cd]').forEach(function (n) {
        var k = n.getAttribute('data-cd');
        var v = map[k];
        if (v === undefined) return;
        var t = k === 'd' ? String(v) : (v < 10 ? '0' + v : String(v));
        if (n.textContent !== t) n.textContent = t;
      });
    });
  }

  /* ---- scroll progress ---- */
  function onProgress() {
    var bars = document.querySelectorAll('[data-progress]');
    if (!bars.length) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bars.forEach(function (el) { el.style.transform = 'scaleX(' + p.toFixed(4) + ')'; });
  }

  /* ---- parallax wrappers ---- */
  function onParallax() {
    if (reduce) return;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var k = parseFloat(el.getAttribute('data-parallax')) || 0;
      el.style.transform = 'translate3d(0,' + (window.scrollY * k).toFixed(1) + 'px,0)';
    });
  }

  /* ---- kinetic type rows ---- */
  function onKinetic() {
    if (reduce) return;
    var vh = window.innerHeight;
    document.querySelectorAll('[data-scrolltext]').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var sp = parseFloat(el.getAttribute('data-speed')) || 0;
      var p = (vh - r.top) / (vh + r.height);
      p = Math.min(1, Math.max(0, p));
      el.style.transform = 'translate3d(' + ((p - 0.5) * sp).toFixed(2) + '%,0,0)';
    });
  }

  function onScroll() { onHeader(); onRail(); onAxis(); onProgress(); onParallax(); onKinetic(); }

  var raf = null;
  var mo = new MutationObserver(function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; scan(); onScroll(); });
  });

  function init() {
    scan();
    onScroll();
    mo.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    tickCountdown();
    var cdTimer = setInterval(tickCountdown, 1000);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(cdTimer); cdTimer = null; }
      else if (!cdTimer) { tickCountdown(); cdTimer = setInterval(tickCountdown, 1000); }
    });
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-page]') : null;
      if (!a || reduce || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.style.transition = 'opacity 350ms ease';
      document.body.style.opacity = '0';
      setTimeout(function () { window.location.href = a.getAttribute('href'); }, 350);
    });
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not([data-done])').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) { el.setAttribute('data-done', '1'); reveal(el); }
      });
    }, 2500);
  }

  window.FA = { scan: scan, init: init, refresh: function () { onScroll(); tickCountdown(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
