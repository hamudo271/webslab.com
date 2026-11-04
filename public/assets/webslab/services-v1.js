/* WEBSLAB_SERVICES_V1_20261102
   관리자 화면 영상은 화면에 보일 때만 재생하고, 움직임 최소화 설정이면 포스터만 보여준다. */
(function () {
  'use strict';

  var video = document.querySelector('.ws-tile__video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }

  if (!('IntersectionObserver' in window)) {
    video.preload = 'auto';
    video.play().catch(function () {});
    return;
  }

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      video.preload = 'auto';
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  }, { threshold: 0.25 }).observe(video);
})();
