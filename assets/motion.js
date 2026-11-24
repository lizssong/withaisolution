// 위드AI솔루션 motion layer (no dependencies). Content stays readable if this fails.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document.documentElement;

  // ---------- reveal on scroll ----------
  var rvs = [].slice.call(document.querySelectorAll('.m-rv, .m-rv-l, .m-formats'));
  if (!reduce && 'IntersectionObserver' in window && rvs.length) {
    doc.classList.add('m-on');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rvs.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rvs.forEach(function (el) { el.classList.add('in'); }); }, 6000);
  }
  // stagger children
  document.querySelectorAll('[data-stagger]').forEach(function (p) {
    var step = parseFloat(p.getAttribute('data-stagger')) || 0.08;
    [].slice.call(p.children).forEach(function (c, i) { c.style.setProperty('--d', (i % 6) * step + 's'); });
  });

  // ---------- scroll progress ----------
  var bar = document.createElement('div'); bar.className = 'm-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = doc.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---------- rotating keyword ----------
  var rot = document.querySelector('[data-words]');
  if (rot && !reduce) {
    var words = rot.getAttribute('data-words').split('|'), wi = 0, ci = words[0].length, del = false;
    (function tick() {
      var w = words[wi];
      if (!del && ci === w.length) { del = true; return setTimeout(tick, 1700); }
      if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; return setTimeout(tick, 250); }
      ci += del ? -1 : 1;
      rot.textContent = words[wi].slice(0, ci) || '\u00a0';
      setTimeout(tick, del ? 35 : 75);
    })();
  }

  // ---------- count up ----------
  var counters = document.querySelectorAll('[data-count]');
  if (!reduce && counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = parseInt(el.getAttribute('data-count'), 10), t0 = performance.now();
        (function step(t) { var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
      });
    });
    counters.forEach(function (c) { c.textContent = '0'; cio.observe(c); });
  }

  // ---------- tag highlighter (answer block) ----------
  var tags = [].slice.call(document.querySelectorAll('.m-tags span'));
  if (tags.length && !reduce) {
    var ti = 0;
    setInterval(function () { tags.forEach(function (t, i) { t.classList.toggle('on', i === ti); }); ti = (ti + 1) % tags.length; }, 1300);
  }

  // ---------- card spotlight ----------
  document.querySelectorAll('.m-card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // ---------- course filter ----------
  var fg = document.getElementById('cfilter');
  if (fg) fg.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    fg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var f = b.getAttribute('data-f'), i = 0;
    document.querySelectorAll('#courses .m-card').forEach(function (c) {
      var on = f === 'all' || c.getAttribute('data-a').split(' ').indexOf(f) > -1;
      c.classList.remove('m-pop'); c.classList.toggle('m-hide', !on);
      if (on && !reduce) { c.style.animationDelay = (i++ * 0.05) + 's'; void c.offsetWidth; c.classList.add('m-pop'); }
      c.classList.add('in');
    });
  });

  // ---------- hero: mouse parallax ----------
  var hero = document.querySelector('.m-hero');
  if (!hero) return;
  var layers = [].slice.call(hero.querySelectorAll('[data-depth]'));
  if (!reduce && layers.length && matchMedia('(pointer:fine)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    function loop() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (l) { var d = parseFloat(l.getAttribute('data-depth')); l.style.transform = 'translate3d(' + (-cx * d) + 'px,' + (-cy * d) + 'px,0) rotateY(' + (cx * d * 0.12) + 'deg) rotateX(' + (-cy * d * 0.12) + 'deg)'; });
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(loop) : 0;
    }
  }

  // ---------- hero: particle network canvas ----------
  var cv = hero.querySelector('.m-hero-canvas');
  if (!cv || reduce || !cv.getContext) return;
  var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), pts = [], mouse = { x: -999, y: -999 }, visible = true, run = 0;
  var COLORS = ['143,164,255', '196,181,253', '255,177,153', '255,255,255'];
  function size() {
    var r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, Math.max(28, W * H / 16000)));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.8 + .6, c: COLORS[i % COLORS.length] });
  }
  hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  function frame() {
    ctx.clearRect(0, 0, W, H);
    var LD = 130;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var mdx = mouse.x - p.x, mdy = mouse.y - p.y, md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 180 && md > 1) { p.vx += mdx / md * 0.012; p.vy += mdy / md * 0.012; }
      p.vx *= 0.995; p.vy *= 0.995;
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy); if (sp < 0.12) { p.vx *= 1.05; p.vy *= 1.05; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < LD * LD) { ctx.strokeStyle = 'rgba(143,164,255,' + (0.22 * (1 - Math.sqrt(d) / LD)) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      if (md < 160) { ctx.strokeStyle = 'rgba(255,177,153,' + (0.35 * (1 - md / 160)) + ')'; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(' + p.c + ',.85)'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    run = (visible && !document.hidden) ? requestAnimationFrame(frame) : 0;
  }
  function start() { if (!run && visible && !document.hidden) run = requestAnimationFrame(frame); }
  size(); start();
  var rs; addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(size, 200); });
  document.addEventListener('visibilitychange', start);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; start(); }).observe(hero);
})();
