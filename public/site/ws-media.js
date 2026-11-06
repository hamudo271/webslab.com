/* 운영 레이어 — 화면에 보이는 것만 움직인다.
   [1] 섹션 게이트: data-ws-live 섹션(site-html.ts가 붙인다)은 화면에 보일 때만 .ws-on — ws-site.css가 그 밖에서는
       CSS 애니메이션을 전부 멈춘다. 작은 점 하나라도 무한 애니메이션이 돌면 브라우저가 화면 전체를 120Hz로 계속
       다시 그리고(헤더·AI 입력창의 backdrop blur 포함), 그게 모든 페이지에서 렉으로 느껴졌다.
   [2] 자동 재생 영상은 화면에 보일 때만 받아서 재생한다.
   HTML의 autoplay는 preload 값과 상관없이 첫 화면부터 영상을 내려받는다(서비스·프로그램 페이지 3개 ≈ 1MB).
   그래서 운영 변환(src/lib/site-html.ts)이 autoplay를 data-ws-autoplay + preload="none"으로 바꾸고, 재생은 여기서 맡는다.
   - 화면 밖으로 나가면 멈추고, 다시 들어오면 이어서 재생
   - 방문자가 직접 멈춘 영상(테마의 재생/정지 버튼)은 다시 들어와도 자동으로 틀지 않는다
   - 움직임 줄이기 설정이면 포스터만 보여준다 */
(function () {
  'use strict';
  var live = document.querySelectorAll('[data-ws-live]');
  if (live.length && 'IntersectionObserver' in window) {
    var lo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('ws-on', e.isIntersecting); });
    }, { rootMargin: '40px 0px' });
    Array.prototype.forEach.call(live, function (el) { lo.observe(el); });
  } else Array.prototype.forEach.call(live, function (el) { el.classList.add('ws-on'); });
}());

(function () {
  'use strict';
  var videos = document.querySelectorAll('video[data-ws-autoplay]');
  if (!videos.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function play(v) {
    if (v.dataset.wsUserPaused) return;
    v.preload = 'auto';
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function pause(v) {
    if (v.paused) return;
    v.dataset.wsAutoPausing = '1';
    v.pause();
  }

  Array.prototype.forEach.call(videos, function (v) {
    v.addEventListener('pause', function () {
      if (v.dataset.wsAutoPausing) delete v.dataset.wsAutoPausing;
      else v.dataset.wsUserPaused = '1';
    });
    v.addEventListener('play', function () { delete v.dataset.wsUserPaused; });
  });

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(videos, play);
    return;
  }
  // 실제로 화면에 1/4쯤 들어왔을 때만 받는다 — 미리 당겨 받으면(rootMargin) 첫 화면 바로 아래 영상(≈300KB)이
  // 첫 화면과 같이 내려와 느린 회선에서 LCP를 밀었다(2026-11-06 서비스 페이지 Lighthouse)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { (e.isIntersecting ? play : pause)(e.target); });
  }, { rootMargin: '0px', threshold: 0.25 });
  Array.prototype.forEach.call(videos, function (v) { io.observe(v); });
})();
