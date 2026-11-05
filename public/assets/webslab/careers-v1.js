/* WEBSLAB_CAREERS_V1_20261105 — 채용(/careers/)
   나타나기([data-reveal]), 히어로 팀 보드 연출, 모집 분야 카드 → 지원 분야 미리 선택, 첨부파일 목록(추가·삭제·끌어놓기),
   지원서 요약 카드(채운 필수 항목 링 · 지원 분야 · 보낼 자료) — 서비스 페이지 '준비자료'(prepare-v1)와 같은 방식.
   제출은 운영 레이어(public/site/ws-forms.js)가 #crForm을 /api/contact로 보낸다. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-cr');
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

  /* ── 히어로 — 한 프로젝트를 기획 → 디자인 → 구현 → 개발 순서로 이어 맡는다 ── */
  var board = $('.cr-board');
  if (board) {
    var rows = $$('.mx-board__list li', board), bar = $('.mx-board__bar', board), count = $('.mx-board__count b', board);
    var done = function (i) {
      var li = rows[i], em = li.querySelector('em');
      li.classList.remove('is-now'); li.classList.add('is-done'); em.textContent = em.getAttribute('data-done');
      bar.style.setProperty('--p', (i + 1) / rows.length); count.textContent = String(i + 1);
    };
    var now = function (i) { if (rows[i]) { rows[i].classList.add('is-now'); rows[i].querySelector('em').textContent = '진행 중'; } };
    if (reduce) rows.forEach(function (_, i) { done(i); });
    else {
      var i = 0; now(0);
      (function step() { setTimeout(function () { done(i); i++; if (i < rows.length) { now(i); step(); } }, i ? 1100 : 1000); }());
    }
  }

  var form = document.getElementById('crForm');
  if (!form) return;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, REQ = ['position', 'name', 'contact'], RING = 289;
  var ring = $('.ws-prep__ring .v', form), ringN = $('.ws-prep__ring b', form), verdict = $('.ws-prep__card-v', form);
  var sumPos = $('[data-sum="position"]', form), sumFiles = $('[data-sum="files"]', form);

  /* ── 모집 분야 카드의 '이 분야로 지원' → 지원서의 분야를 미리 고른다 ── */
  var pick = function (role) {
    var r = form.querySelector('input[name="position"][value="' + String(role).replace(/"/g, '') + '"]');
    if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
  };
  $$('[data-role]').forEach(function (a) {
    a.addEventListener('click', function () { pick(a.getAttribute('data-role')); });
  });
  var q = new URLSearchParams(location.search).get('position');
  if (q) pick(q);

  /* ── 오류 표시는 고치는 즉시 지운다 (검사·표시는 ws-forms.js가 제출할 때) ── */
  form.addEventListener('input', function (e) {
    var el = e.target;
    if (el.getAttribute('aria-invalid') !== 'true' || el.value.trim() === '') return;
    el.setAttribute('aria-invalid', 'false');
    var msg = document.getElementById(el.getAttribute('aria-describedby') || '');
    if (msg) msg.hidden = true;
  });
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'position') return;
    var c = $('.cr-choices', form), m = document.getElementById('crPosErr');
    if (c) c.classList.remove('is-invalid');
    if (m) m.hidden = true;
  });

  /* ── 첨부파일 — 여러 번 골라도 쌓이고, 목록에서 지울 수 있다 (서버와 같은 제한) ── */
  var input = $('.cr-file', form), list = $('.cr-files', form), drop = $('.cr-drop', form), err = document.getElementById('crFileErr');
  var MAX = 3, MAX_BYTES = 10 * 1024 * 1024, MAX_TOTAL = 25 * 1024 * 1024;
  var EXT = ['pdf', 'doc', 'docx', 'hwp', 'hwpx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'zip', 'rar', '7z', 'ai', 'psd'];
  var files = [];
  var canSet = (function () { try { return typeof DataTransfer === 'function' && !!new DataTransfer().items; } catch (e) { return false; } }());
  var size = function (b) { return b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + 'KB' : (b / 1024 / 1024).toFixed(1) + 'MB'; };
  var say = function (msg) { err.textContent = msg || ''; err.hidden = !msg; };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var sync = function () {
    if (canSet) {
      var dt = new DataTransfer();
      files.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
    }
    list.innerHTML = files.map(function (f, i) {
      return '<li><span>' + esc(f.name) + '</span><small>' + size(f.size) + '</small>' +
        '<button type="button" data-remove="' + i + '" aria-label="' + esc(f.name) + ' 빼기"><svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></li>';
    }).join('');
    summarize();
  };
  var add = function (picked) {
    say('');
    var msg = '';
    Array.prototype.forEach.call(picked, function (f) {
      var ext = f.name.indexOf('.') > -1 ? f.name.split('.').pop().toLowerCase() : '';
      var total = files.reduce(function (s, x) { return s + x.size; }, 0);
      if (EXT.indexOf(ext) < 0) msg = '보낼 수 없는 파일 형식이에요: ' + f.name;
      else if (f.size > MAX_BYTES) msg = '파일당 10MB까지 보낼 수 있어요: ' + f.name;
      else if (files.length >= MAX) msg = '파일은 최대 ' + MAX + '개까지 보낼 수 있어요.';
      else if (total + f.size > MAX_TOTAL) msg = '첨부파일은 합계 25MB까지 보낼 수 있어요.';
      else files.push(f);
    });
    if (!canSet) files = Array.prototype.slice.call(input.files || []);
    sync();
    say(msg);
  };
  input.addEventListener('change', function () { add(input.files || []); });
  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b || !canSet) return;
    files.splice(+b.getAttribute('data-remove'), 1);
    sync(); say('');
  });
  if (canSet && drop) {
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('is-over'); }); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); if (e.dataTransfer) add(e.dataTransfer.files); });
  }
  // 접수 후 초기화(ws-forms.js가 form.reset()을 부른다)
  form.addEventListener('reset', function () { files = []; setTimeout(function () { sync(); say(''); }, 0); });

  /* ── 요약 카드 — 항목을 채우면 왼쪽 카드가 '완료'로 바뀌고, 오른쪽 링·요약이 따라온다 ── */
  function summarize() {
    var el = form.elements, pos = form.querySelector('input[name="position"]:checked');
    var fileCount = canSet ? files.length : (input.files ? input.files.length : 0);
    var done = {
      position: !!pos,
      name: el.name.value.trim() !== '',
      contact: el.phone.value.replace(/\D/g, '').length >= 9 && EMAIL.test(el.email.value.trim()),
      file: fileCount > 0,
      link: el.portfolioUrl.value.trim() !== '',
      message: el.message.value.trim() !== ''
    };
    Object.keys(done).forEach(function (k) {
      var it = form.querySelector('.cr-item[data-key="' + k + '"]');
      if (!it) return;
      it.classList.toggle('is-done', done[k]);
      var badge = it.querySelector('.cr-badge');
      if (badge) {
        if (!badge.hasAttribute('data-label')) badge.setAttribute('data-label', badge.textContent);
        badge.textContent = done[k] ? '완료' : badge.getAttribute('data-label');
      }
    });
    var n = REQ.filter(function (k) { return done[k]; }).length;
    ringN.textContent = String(n);
    ring.style.strokeDashoffset = (RING * (1 - n / REQ.length)).toFixed(1);
    verdict.textContent = n === 0 ? '필수 세 가지만 채우면 보낼 수 있어요'
      : n < REQ.length ? (REQ.length - n) + '개만 더 채우면 보낼 수 있어요'
      : el.privacy_agree.checked ? '보낼 준비가 됐어요' : '동의에 체크하면 보낼 수 있어요';
    sumPos.textContent = pos ? pos.value.replace('·', ' · ') : '아직 안 골랐어요';
    sumPos.classList.toggle('is-empty', !pos);
    var parts = [];
    if (fileCount) parts.push('파일 ' + fileCount + '개');
    if (done.link) parts.push('링크');
    sumFiles.textContent = parts.length ? parts.join(' · ') : '없음';
    sumFiles.classList.toggle('is-empty', !parts.length);
  }
  form.addEventListener('input', summarize);
  form.addEventListener('change', summarize);
  summarize();
}());
