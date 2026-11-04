/* WEBSLAB_SECTIONS_V1_20261102
   제작사례 레일 이전/다음, 검증 지표 카운트업, 하단 AI 위젯 안내문 폭 맞춤. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 제작사례 레일 ──
  var rail = document.querySelector('.ws-cases__rail');
  if (rail) {
    var btns = document.querySelectorAll('.ws-cases__btn');

    function step() {
      var card = rail.querySelector('.ws-case');
      return card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    }

    function syncButtons() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      btns.forEach(function (b) {
        var dir = Number(b.getAttribute('data-dir'));
        b.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
      });
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        rail.scrollBy({ left: step() * Number(b.getAttribute('data-dir')), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
    rail.addEventListener('scroll', syncButtons, { passive: true });
    window.addEventListener('resize', syncButtons);
    syncButtons();
  }

  // ── 검증 지표 카운트업 — 화면에 들어올 때 한 번 ──
  var numbers = document.querySelector('.ws-numbers');
  if (numbers && !reduceMotion && 'IntersectionObserver' in window) {
    var counters = numbers.querySelectorAll('.ws-number__count');
    var run = function () {
      numbers.classList.add('is-in');
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var start = null;
        var dur = 1400;
        function tick(ts) {
          if (start === null) start = ts;
          var t = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - t, 4); // 지수형 ease-out
          el.textContent = (target * eased).toFixed(decimals);
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(tick);
      });
    };
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      run();
    }, { threshold: 0.4 });
    io.observe(numbers.querySelector('.ws-numbers__grid') || numbers);
  }

  // ── 하단 AI 위젯 — 입력칸이 좁으면 안내문을 짧게 ──
  var field = document.querySelector('.wsai-v8__field');
  if (field && 'ResizeObserver' in window) {
    var full = field.getAttribute('placeholder') || '';
    var short = '무엇이든 물어보세요';
    new ResizeObserver(function (entries) {
      var w = entries[0].contentRect.width;
      field.setAttribute('placeholder', w < 170 ? short : full);
    }).observe(field);
  }
})();

/* v1.2 — 검증 지표: 링 게이지 채우기 + 별처럼 이어지는 입자 캔버스 */
(function () {
  'use strict';

  var numbers = document.querySelector('.ws-numbers');
  if (!numbers) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 링 — .is-in 이 붙는 순간(카운트업 시작) 값만큼 채운다. 움직임 최소화면 즉시.
  function fillRings() {
    numbers.querySelectorAll('.ws-number').forEach(function (tile) {
      var ring = tile.querySelector('.ws-ring__fill');
      if (ring) ring.style.setProperty('--pct', (parseFloat(tile.getAttribute('data-pct')) || 0) / 100);
    });
  }
  if (reduceMotion || numbers.classList.contains('is-in')) {
    fillRings();
  } else {
    new MutationObserver(function (m, obs) {
      if (numbers.classList.contains('is-in')) { fillRings(); obs.disconnect(); }
    }).observe(numbers, { attributes: true, attributeFilter: ['class'] });
  }

  // 입자 캔버스 — 보일 때만 그린다
  var canvas = numbers.querySelector('.ws-numbers__stars');
  if (!canvas || reduceMotion || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, pts = [], raf = null, visible = false;
  var COUNT = 70, LINK = 120;

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(COUNT * Math.min(1.4, Math.max(.5, W / 1100)));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.4 + .6, a: Math.random() * Math.PI * 2 });
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < LINK * LINK) {
          ctx.strokeStyle = 'rgba(143,192,255,' + (0.22 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var tw = 0.55 + 0.45 * Math.sin(t / 900 + p.a); // 반짝임
      ctx.fillStyle = 'rgba(200,222,255,' + (0.9 * tw).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = visible ? requestAnimationFrame(frame) : null;
  }

  function start() { if (!raf) raf = requestAnimationFrame(frame); }

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0.05 }).observe(canvas);
  } else { visible = true; start(); }
})();
