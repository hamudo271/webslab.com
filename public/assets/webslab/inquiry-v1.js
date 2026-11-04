/* WEBSLAB_INQUIRY_V1_20261104 — 견적 문의 (메인 하단 · /contact/ 공통)
   지금이 상담 시간(평일 10~18시, 한국 시간)인지 보여준다.
   모든 칸이 필수다. 페이지의 공통 스크립트가 document에서 submit을 먼저 가로채 테마 검사가 돌지 않으므로,
   window 단계에서 먼저 받아 빈 칸을 테마와 같은 문구로 표시하고, 다 채웠을 때만 공식 문의 페이지로 보낸다. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-cx');
  if (!root) return;

  /* 상담 시간 */
  var st = root.querySelector('[data-iq-status]');
  if (st) {
    var now = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (t) { var p = now.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
    var day = get('weekday'), hour = parseInt(get('hour'), 10) % 24;
    var open = ['Sat', 'Sun'].indexOf(day) === -1 && hour >= 10 && hour < 18;
    st.classList.toggle('is-open', open);
    st.querySelector('b').textContent = open ? '지금 상담 가능해요' : '평일 10–18시 상담 · 남기시면 다음 영업일 회신';
  }

  /* 필수 칸 검사 */
  var form = root.querySelector('.uw-inquiry-form');
  if (!form) return;
  var headerH = function () { var h = document.querySelector('.cm-header'); return h ? h.getBoundingClientRect().height : 72; };
  function empty(el) {
    if (el.type === 'file') return !el.files || el.files.length === 0;
    return el.value.trim() === '';
  }
  function check() {
    var first = null;
    Array.prototype.forEach.call(form.querySelectorAll('.uw-inquiry-field'), function (g) {
      var el = g.querySelector('[required]');
      if (!el) return;
      var label = g.getAttribute('data-label') || '필수 항목';
      var msg = '';
      if (empty(el)) msg = el.type === 'file' ? "'" + label + "' 파일을 첨부해주세요." : "'" + label + "' 항목을 입력해주세요.";
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) msg = "'" + label + "' 형식이 올바르지 않습니다. (예: example@email.com)";
      g.classList.toggle('has-error', !!msg);
      var out = g.querySelector('.uw-inquiry-field-error');
      if (out) out.textContent = msg;
      if (msg && !first) first = { g: g, el: el };
    });
    return first;
  }
  window.addEventListener('submit', function (e) {
    if (e.target !== form) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var bad = check();
    if (bad) {
      window.scrollTo({ top: bad.g.getBoundingClientRect().top + window.scrollY - headerH() - 24, behavior: 'smooth' });
      var f = bad.el.type === 'file' ? bad.g.querySelector('.uw-multifile-btn') : bad.el;
      if (f) f.focus({ preventScroll: true });
      return;
    }
    location.href = 'https://webslab.co.kr/contact';
  }, true);
  // 파일을 고르면 그 칸의 오류를 지운다 (글자 칸은 테마가 지운다)
  Array.prototype.forEach.call(form.querySelectorAll('input[type="file"][required]'), function (el) {
    el.addEventListener('change', function () {
      if (empty(el)) return;
      var g = el.closest('.uw-inquiry-field'); g.classList.remove('has-error');
      var out = g.querySelector('.uw-inquiry-field-error'); if (out) out.textContent = '';
    });
  });
}());
