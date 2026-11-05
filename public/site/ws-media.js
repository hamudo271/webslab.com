/* 운영 레이어 — 자동 재생 영상은 화면에 보일 때만 받아서 재생한다.
   HTML의 autoplay는 preload 값과 상관없이 첫 화면부터 영상을 내려받는다(서비스·프로그램 페이지 3개 ≈ 1MB).
   그래서 운영 변환(src/lib/site-html.ts)이 autoplay를 data-ws-autoplay + preload="none"으로 바꾸고, 재생은 여기서 맡는다.
   - 화면 밖으로 나가면 멈추고, 다시 들어오면 이어서 재생
   - 방문자가 직접 멈춘 영상(테마의 재생/정지 버튼)은 다시 들어와도 자동으로 틀지 않는다
   - 움직임 줄이기 설정이면 포스터만 보여준다 */
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
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { (e.isIntersecting ? play : pause)(e.target); });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  Array.prototype.forEach.call(videos, function (v) { io.observe(v); });
})();
