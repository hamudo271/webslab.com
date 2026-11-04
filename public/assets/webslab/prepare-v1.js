/* WEBSLAB_PREPARE_V1_20261104 — 홈페이지 준비자료(ws-prep)
   '있어요/없어요'를 고르면 맞는 답이 펼쳐지고, 오른쪽 카드에 답한 개수와 '직접 준비 / 웹스랩이 맡음'이 모인다.
   '준비 목록 복사'는 고른 결과를 글로 정리해 클립보드에 넣는다. 아무것도 저장하지 않는다. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-prep');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(root.querySelectorAll('.ws-prep__item'));
  var ring = root.querySelector('.ws-prep__ring .v'), ringN = root.querySelector('.ws-prep__ring b');
  var verdict = root.querySelector('.ws-prep__card-v');
  var sumYes = root.querySelector('[data-sum="yes"]'), sumNo = root.querySelector('[data-sum="no"]');
  var copyBtn = root.querySelector('[data-copy]');
  var C = 289;

  var reveal = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    reveal.forEach(function (el) { io.observe(el); });
  } else reveal.forEach(function (el) { el.classList.add('is-in'); });

  function state(it) { var c = it.querySelector('input:checked'); return c ? c.value : null; }
  function update() {
    var yes = 0, no = 0;
    items.forEach(function (it) {
      var v = state(it);
      it.classList.toggle('is-yes', v === 'yes');
      it.classList.toggle('is-no', v === 'no');
      Array.prototype.forEach.call(it.querySelectorAll('.ws-prep__ans'), function (a) { a.classList.toggle('is-open', a.getAttribute('data-when') === v); });
      if (v === 'yes') yes++; else if (v === 'no') no++;
    });
    var n = yes + no;
    ringN.textContent = String(n);
    ring.style.strokeDashoffset = (C * (1 - n / items.length)).toFixed(1);
    sumYes.textContent = String(yes); sumNo.textContent = String(no);
    if (n === 0) verdict.textContent = '있는 것만 골라 보세요';
    else if (n < items.length) verdict.textContent = items.length - n + '개 더 고르면 정리가 끝나요';
    else if (no === 0) verdict.textContent = '준비가 다 되셨네요. 바로 시작할 수 있어요';
    else if (yes === 0) verdict.textContent = '아무것도 없어도 괜찮아요. 웹스랩이 다 채워요';
    else verdict.textContent = yes + '개만 보내 주세요. 나머지 ' + no + '개는 웹스랩이 맡아요';
  }
  root.addEventListener('change', function (e) { if (e.target.matches('.ws-prep__seg input')) update(); });
  update();

  copyBtn.addEventListener('click', function () {
    var lines = ['[홈페이지 준비자료 체크]'];
    items.forEach(function (it) {
      var name = it.querySelector('h3').textContent, v = state(it);
      lines.push('- ' + name + ': ' + (v === 'yes' ? '있어요 (직접 준비)' : v === 'no' ? '없어요 (웹스랩이 맡음)' : '아직 안 골랐어요'));
    });
    lines.push('', 'webslab.co.kr/service/#materials');
    var label = copyBtn.textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(lines.join('\n')).then(function () {
      copyBtn.textContent = '복사했어요'; setTimeout(function () { copyBtn.textContent = label; }, 1800);
    }, function () {});
  });
}());
