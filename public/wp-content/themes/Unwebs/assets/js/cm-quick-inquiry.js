/**
 * 언웹스 간편문의 — 슬라이드 위젯 동작
 *
 * 제출은 기존 uw_inquiry_submit 엔드포인트 재사용(저장·관리자목록·메일·SMS 동일 파이프라인).
 * 성공 시 사이트 전역 전환 함수(uwGadsConversion / uwNaverCnvInquiry) 호출 → 다른 문의폼과 동일 집계.
 * 스팸 방어: fresh nonce + 서명 토큰(최소 작성시간) + JS 실행 증명 + 허니팟.
 */
(function () {
  'use strict';

  var W    = window.UW_QI || {};
  var root = document.getElementById('uwQi');
  if (!root) return;

  var tab    = document.getElementById('uwQiTab');
  var closeB = document.getElementById('uwQiClose');
  var form   = document.getElementById('uwQiForm');
  var msg    = document.getElementById('uwQiMsg');
  var viewB  = document.getElementById('uwQiView');
  var modal  = document.getElementById('uwQiModal');
  var mClose = document.getElementById('uwQiModalClose');
  var jsField    = form.querySelector('input[name="uw_js"]');
  var nonceField = form.querySelector('input[name="nonce"]');
  var tokenField = form.querySelector('input[name="uw_token"]');

  // JS 실행 증명 (스크립트 미실행 봇 차단)
  if (jsField) jsField.value = '1';

  /* ---- 보안 토큰/nonce 준비 (캐시 안전: 페이지 HTML이 아닌 admin-ajax에서 발급) ---- */
  var prepped = false, prepping = false;
  function prep() {
    if (prepped || prepping || !W.ajax) return;
    prepping = true;
    var body = new URLSearchParams();
    body.append('action', 'uw_qi_prep');
    fetch(W.ajax, { method: 'POST', body: body, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success && res.data) {
          if (nonceField) nonceField.value = res.data.nonce || '';
          if (tokenField) tokenField.value = res.data.token || '';
          prepped = true;
        }
      })
      .catch(function () {})
      .finally(function () { prepping = false; });
  }

  /* ---- 슬라이드 열기/닫기 ---- */
  function open() {
    root.classList.add('is-open');
    tab.setAttribute('aria-expanded', 'true');
    root.setAttribute('aria-hidden', 'false');
    prep();
  }
  function shut() {
    root.classList.remove('is-open');
    tab.setAttribute('aria-expanded', 'false');
    root.setAttribute('aria-hidden', 'true');
  }
  function toggle() { root.classList.contains('is-open') ? shut() : open(); }

  tab.addEventListener('click', toggle);
  if (closeB) closeB.addEventListener('click', shut);
  // 필드에 처음 손대는 순간에도 백업으로 prep
  form.addEventListener('focusin', prep, { once: true });

  /* ---- 최초 로드 5초 뒤 자동 슬라이드인 (세션당 1회 · PC 한정 · 사용자 조작 전에만) ---- */
  var userActed = false;
  function markActed() { userActed = true; }
  tab.addEventListener('click', markActed);
  if (closeB) closeB.addEventListener('click', markActed);
  form.addEventListener('focusin', markActed, { once: true });
  try {
    var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile && sessionStorage.getItem('uw_qi_autoopened') !== '1') {
      setTimeout(function () {
        try { sessionStorage.setItem('uw_qi_autoopened', '1'); } catch (e) {}
        if (!userActed && !root.classList.contains('is-open')) open();
      }, 5000);
    }
  } catch (e) {}

  /* ---- 개인정보 처리방침 모달 ---- */
  function openModal()  { modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  if (viewB)  viewB.addEventListener('click', openModal);
  if (mClose) mClose.addEventListener('click', closeModal);
  if (modal)  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal && modal.classList.contains('is-open')) { closeModal(); return; }
    if (root.classList.contains('is-open')) shut();
  });

  /* ---- 광고 전환 추적 (사이트 전역 함수 재사용 — 완료페이지와 동일 액션) ---- */
  function fireConversion() {
    try { if (typeof window.uwGadsConversion === 'function') window.uwGadsConversion(); } catch (e) {}
    try { if (typeof window.uwNaverCnvInquiry === 'function') window.uwNaverCnvInquiry(); } catch (e) {}
    // GA4 리드 전환 (gtag 직접 — 완료페이지와 동일 generate_lead 이벤트)
    try { if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { 'send_to': 'G-RJPDW9XWX9', 'form_location': 'floating' }); } catch (e) {}
  }

  /* ---- 메시지 ---- */
  function ok(t)  { msg.textContent = t; msg.className = 'uw-qi__msg is-ok'; }
  function err(t) { msg.textContent = t; msg.className = 'uw-qi__msg is-err'; }

  var sending = false;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    msg.textContent = '';
    msg.className = 'uw-qi__msg';

    var name  = (form.field_name  && form.field_name.value  || '').trim();
    var phone = (form.field_phone && form.field_phone.value || '').trim();
    var agree = form.privacy_agree && form.privacy_agree.checked;

    if (!name)                                { err('이름을 입력해주세요.'); if (form.field_name) form.field_name.focus(); return; }
    if (phone.replace(/\D/g, '').length < 9)  { err('연락처를 확인해주세요.'); if (form.field_phone) form.field_phone.focus(); return; }
    if (!agree)                               { err('개인정보 수집·이용에 동의해주세요.'); return; }

    var submit = function () {
      var data = new FormData(form);
      data.append('action', 'uw_inquiry_submit'); // 기존 문의 파이프라인 재사용
      data.append('form_id', W.form_id || '');

      var btn = form.querySelector('.uw-qi__submit');
      sending = true;
      btn.disabled = true;
      btn.textContent = '접수 중...';

      fetch(W.ajax, { method: 'POST', body: data, credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            ok('접수되었습니다. 빠르게 연락드리겠습니다.');
            fireConversion();
            form.reset();
            if (jsField) jsField.value = '1';
            if (form.field_inquiry_type) form.field_inquiry_type.value = (W.type_default || '홈페이지 제작');
            if (form.privacy_agree) form.privacy_agree.checked = true;
            prepped = false; prep();       // 다음 제출용 새 토큰 준비
            setTimeout(shut, 1900);
          } else {
            err((res && res.data) ? (typeof res.data === 'string' ? res.data : (res.data.message || '접수에 실패했습니다.')) : '접수에 실패했습니다.');
            prepped = false; prep();       // 실패 시 토큰/nonce 재발급
          }
        })
        .catch(function () { err('네트워크 오류입니다. 잠시 후 다시 시도해주세요.'); })
        .finally(function () { sending = false; btn.disabled = false; btn.textContent = '무료상담신청'; });
    };

    // 토큰이 아직 없으면 먼저 발급 후 제출
    if (!prepped) {
      prep();
      var waited = 0;
      var iv = setInterval(function () {
        waited += 120;
        if (prepped || waited >= 2400) { clearInterval(iv); submit(); }
      }, 120);
    } else {
      submit();
    }
  });
})();
