/* WEBSLAB_MAINTENANCE_V2_20261104 — 유지보수 신청 · 비용 안내
   나타나기([data-reveal]), 히어로 점검표·대화 연출, 단계형 신청서(필수 확인 → mailto), 방식 진단, 질문 펼침. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-mx');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || root).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); };

  /* ── 나타나기 ── */
  var reveal = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    reveal.forEach(function (el) { ro.observe(el); });
  } else reveal.forEach(function (el) { el.classList.add('is-in'); });

  /* ── 히어로 연출 — 점검표가 한 줄씩 끝나고, 요청 대화가 오간다 ── */
  var board = $('.mx-board');
  if (board) {
    var rows = $$('.mx-board__list li', board), bar = $('.mx-board__bar', board), count = $('.mx-board__count b', board);
    var chat = $('.mx-chat');
    var done = function (i) {
      var li = rows[i], em = li.querySelector('em');
      li.classList.remove('is-now'); li.classList.add('is-done'); em.textContent = em.getAttribute('data-done');
      bar.style.setProperty('--p', (i + 1) / rows.length); count.textContent = String(i + 1);
    };
    var now = function (i) { if (rows[i]) { rows[i].classList.add('is-now'); rows[i].querySelector('em').textContent = '점검 중'; } };
    if (reduce) { rows.forEach(function (_, i) { done(i); }); if (chat) chat.classList.add('s1', 's3'); }
    else {
      var i = 0; now(0);
      (function step() { setTimeout(function () { done(i); i++; if (i < rows.length) { now(i); step(); } }, i ? 1100 : 1000); }());
      if (chat) {
        setTimeout(function () { chat.classList.add('s1'); }, 900);
        setTimeout(function () { chat.classList.add('s2'); }, 1700);
        setTimeout(function () { chat.classList.remove('s2'); chat.classList.add('s3'); }, 3300);
      }
    }
  }

  /* ── 단계형 신청서 ── */
  var form = document.getElementById('mxForm');
  if (form) {
    var steps = $$('.mx-step', form), cur = 0, lastText = '';
    var prev = $('[data-prev]', form), next = $('[data-next]', form), submit = $('[data-submit]', form);
    var stepNo = $('.mx-form__step b', form), stepBar = $('.mx-form__bar i', form);
    var doneBox = $('.mx-done', form), summary = $('.mx-summary', form);
    var NEED = { 1: ['url'], 3: ['name', 'reach'] };
    // 비용 안내에서 고른 방식이 있으면 미리 선택
    var pre = new URLSearchParams(location.search).get('mode');
    if (pre) { var r = form.querySelector('input[name="mode"][value="' + pre.replace(/"/g, '') + '"]'); if (r) r.checked = true; }

    var check = function (name) {
      var f = form.elements[name], ok = f.value.trim() !== '';
      f.setAttribute('aria-invalid', ok ? 'false' : 'true');
      document.getElementById(f.getAttribute('aria-describedby')).hidden = ok;
      return ok;
    };
    ['url', 'name', 'reach'].forEach(function (n) {
      form.elements[n].addEventListener('input', function () { if (this.getAttribute('aria-invalid') === 'true') check(n); });
    });
    var valid = function (k) {
      var bad = (NEED[k + 1] || []).filter(function (n) { return !check(n); });
      if (bad.length) { form.elements[bad[0]].focus(); return false; }
      return true;
    };
    var data = function () {
      var el = form.elements, mode = form.querySelector('input[name="mode"]:checked');
      var work = $$('input[name="work"]:checked', form).map(function (c) { return c.value; });
      return { url: el.url.value.trim(), mode: mode ? mode.value : '아직 모르겠어요', work: work.length ? work.join(', ') : '선택 안 함',
               msg: el.message.value.trim() || '(적지 않음)', name: el.name.value.trim(), reach: el.reach.value.trim() };
    };
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var show = function (k, focus) {
      cur = k;
      steps.forEach(function (s, i) { s.hidden = i !== k; s.classList.toggle('is-on', i === k); });
      stepNo.textContent = String(k + 1);
      stepBar.style.setProperty('--p', (k + 1) / steps.length);
      prev.hidden = k === 0; next.hidden = k === steps.length - 1; submit.hidden = k !== steps.length - 1;
      if (k === steps.length - 1) {
        var d = data();
        summary.innerHTML = '<div><span>사이트</span><b>' + esc(d.url) + '</b></div><div><span>방식</span><b>' + esc(d.mode) + '</b></div><div><span>작업</span><b>' + esc(d.work) + '</b></div>';
      }
      if (focus) { var f = steps[k].querySelector('input, textarea'); if (f) f.focus({ preventScroll: true }); }
    };
    next.addEventListener('click', function () { if (valid(cur)) show(cur + 1, true); });
    prev.addEventListener('click', function () { show(cur - 1, true); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && cur < steps.length - 1) { e.preventDefault(); next.click(); }
    });
    // 사이트 공통 스크립트가 document에서 모든 submit을 가로채므로 window 단계에서 먼저 받는다
    window.addEventListener('submit', function (e) {
      if (e.target !== form) return;
      e.preventDefault();
      if (cur !== steps.length - 1 || !valid(cur)) return;
      var d = data();
      lastText = ['사이트 주소: ' + d.url, '맡기실 방식: ' + d.mode, '필요한 작업: ' + d.work, '', '요청 내용:', d.msg, '', '이름 또는 회사명: ' + d.name, '회신받을 연락처: ' + d.reach].join('\n');
      location.href = 'mailto:contact@webslab.co.kr?subject=' + encodeURIComponent('[유지보수 신청] ' + d.name) + '&body=' + encodeURIComponent(lastText);
      doneBox.hidden = false; $('[data-copy]', form).focus();
    }, true);
    $('[data-copy]', form).addEventListener('click', function () {
      var b = this, label = b.textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(lastText).then(function () { b.textContent = '복사했어요'; setTimeout(function () { b.textContent = label; }, 1800); }, function () {});
    });
    $('[data-edit]', form).addEventListener('click', function () { doneBox.hidden = true; show(0, true); });
    show(0, false);
  }

  /* ── 방식 진단 ── */
  var quiz = $('.mx-quiz');
  if (quiz) {
    var card = $('.mx-result__card'), v = $('.mx-result__v'), why = $('.mx-result__why'), meter = $('.mx-result__meter b'), cta = $('[data-result-cta]');
    var MODES = {
      monthly: { v: '월 단위 구독', why: '자주 바뀌는 내용과 보안 점검·백업을 매달 맡기면 운영 부담이 줄어요.', m: .85 },
      single: { v: '건별 유지보수', why: '필요한 작업이 정해져 있으니, 그때그때 건별로 맡기는 편이 알맞아요.', m: .15 },
      mixed: { v: '상담 후 정해요', why: '조건이 섞여 있어요. 사이트를 먼저 살펴본 뒤 맞는 방식을 함께 정해요.', m: .5 }
    };
    var update = function () {
      var a = ['q1', 'q2', 'q3'].map(function (n) { var c = quiz.querySelector('input[name="' + n + '"]:checked'); return c ? +c.value : null; });
      if (a.some(function (x) { return x === null; })) return;
      var score = a[0] + a[1] + (a[2] ? -1 : 1);
      var key = score >= 2 ? 'monthly' : score <= 0 ? 'single' : 'mixed';
      var m = MODES[key];
      card.setAttribute('data-state', key);
      v.textContent = m.v; why.textContent = m.why;
      meter.parentNode.parentNode.style.setProperty('--m', m.m);
      meter.style.left = (m.m * 100) + '%';
      cta.setAttribute('href', '/maintenance/' + (key === 'mixed' ? '' : '?mode=' + encodeURIComponent(key === 'monthly' ? '월 단위 구독' : '건별')) + '#apply');
    };
    quiz.addEventListener('change', update);
  }

  /* ── 질문 펼침 ── */
  $$('.mx-faq .ws-faq-item').forEach(function (it) {
    var q = $('.ws-faq-q', it), a = $('.ws-faq-a', it);
    q.addEventListener('click', function () {
      var open = !it.classList.contains('is-open');
      it.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.setAttribute('aria-hidden', open ? 'false' : 'true');
      a.inert = !open;
    });
  });
}());
