/* WEBSLAB_PROCESS_V1_20261104 — 제작 절차(ws-proc), 서비스·프로그램 페이지 공용
   - 레일: 화면 기준선이 지나간 단계는 is-done, 지금 단계는 is-active.
   - 진행선: 현재 단계 점에서 다음 단계 점까지, 기준선이 다음 단계로 다가간 만큼 연속으로 차오른다(데스크톱 세로, 태블릿·모바일 가로).
   - 단계 선명도(--v): 단계 가운데가 화면 가운데에 가까울수록 1. 움직임 최소화 설정이면 항상 1. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-proc');
  if (!root) return;
  var steps = Array.prototype.slice.call(root.querySelectorAll('.ws-proc__step'));
  var points = Array.prototype.slice.call(root.querySelectorAll('.ws-proc__point'));
  var fill = root.querySelector('.ws-proc__fill');
  var track = root.querySelector('.ws-proc__track');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var horizontal = window.matchMedia('(max-width: 1024px)');
  var ticking = false;

  function centerOf(el, axis) { var r = el.getBoundingClientRect(); return axis === 'x' ? r.left + r.width / 2 : r.top + r.height / 2; }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var line = vh * (horizontal.matches ? .42 : .5); // 기준선
    var active = 0, frac = 0;
    for (var i = 0; i < steps.length; i++) {
      var r = steps[i].getBoundingClientRect();
      if (r.top <= line) active = i;
      var d = Math.abs((r.top + r.height / 2) - vh / 2) / (vh * .75);
      steps[i].style.setProperty('--v', reduce.matches ? 1 : Math.max(0, Math.min(1, 1 - d)).toFixed(3));
    }
    if (active < steps.length - 1) {
      var a = steps[active].getBoundingClientRect().top, b = steps[active + 1].getBoundingClientRect().top;
      frac = Math.max(0, Math.min(1, (line - a) / (b - a)));
    }
    var firstTop = steps[0].getBoundingClientRect().top;
    if (firstTop > line) frac = 0;
    points.forEach(function (p, i) {
      p.classList.toggle('is-active', i === active);
      p.classList.toggle('is-done', i < active);
      var a = p.querySelector('a'); if (i === active) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    // 진행선 길이: 첫 점 중심 → (현재 점 + frac × 다음 점까지)
    var axis = horizontal.matches ? 'x' : 'y';
    var nums = points.map(function (p) { return p.querySelector('.ws-proc__num'); });
    var t0 = axis === 'x' ? track.getBoundingClientRect().left : track.getBoundingClientRect().top;
    var c = centerOf(nums[active], axis);
    if (active < nums.length - 1) c += (centerOf(nums[active + 1], axis) - c) * frac;
    var start = axis === 'x' ? 0 : centerOf(nums[0], axis) - t0;
    var len = Math.max(0, c - t0 - (axis === 'x' ? 0 : 0));
    if (firstTop > line && axis === 'y') len = start;
    fill.style.setProperty('--ws-proc-fill', len.toFixed(1) + 'px');
    root.style.setProperty('--ws-proc-fill', len.toFixed(1) + 'px');
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}());
