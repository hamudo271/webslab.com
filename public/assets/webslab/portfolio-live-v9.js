/* WEBSLAB_PORTFOLIO_LIVE_V9_20261102 */
(function () {
  'use strict';

  function init(root) {
    var browser = root.querySelector('.ws-live-browser');
    var frame = root.querySelector('.ws-live-frame');
    var poster = root.querySelector('.ws-live-poster');
    var note = root.querySelector('.ws-live-note');
    var url = root.getAttribute('data-site-url');
    var embeddable = root.getAttribute('data-embed-capability') === 'allowed';
    var loaded = false;
    var loadTimer = 0;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          document.body.classList.toggle('ws-live-in-view', entry.isIntersecting && entry.intersectionRatio > .12);
        });
      }, { threshold: [0, .12, .5] }).observe(root);
    }

    function setState(state, message) {
      root.setAttribute('data-state', state);
      if (message && note) note.textContent = message;
    }

    function loadSite() {
      if (!embeddable) {
        window.open(url, '_blank', 'noopener,noreferrer');
        setState('blocked', '원사이트 보안 정책에 따라 새 탭에서 열었습니다.');
        return;
      }
      if (loaded) return;
      loaded = true;
      setState('loading', '실제 운영 사이트를 불러오는 중입니다.');
      poster.hidden = true;
      frame.hidden = false;
      frame.src = url;
      loadTimer = window.setTimeout(function () {
        if (root.getAttribute('data-state') === 'loading') {
          setState('slow', '원사이트 응답이 느립니다. 잠시 기다리거나 새 탭으로 열어주세요.');
        }
      }, 12000);
    }

    function unloadSite() {
      if (!loaded) return;
      window.clearTimeout(loadTimer);
      frame.src = 'about:blank';
      frame.hidden = true;
      poster.hidden = false;
      loaded = false;
      setState('idle', '초기 외부 요청 0 · 버튼을 누를 때만 원사이트를 불러옵니다.');
    }

    poster.addEventListener('click', loadSite);
    frame.addEventListener('load', function () {
      if (!loaded || frame.src === 'about:blank') return;
      window.clearTimeout(loadTimer);
      setState('ready', '실제 운영 사이트가 연결되었습니다. 프레임 안에서 스크롤하고 클릭해보세요.');
    });

    root.addEventListener('click', function (event) {
      var control = event.target.closest('[data-live-action]');
      if (!control) return;
      var action = control.getAttribute('data-live-action');
      if (action === 'desktop' || action === 'mobile') {
        browser.classList.toggle('is-mobile', action === 'mobile');
        root.querySelectorAll('.ws-live-device').forEach(function (button) {
          button.setAttribute('aria-pressed', String(button === control));
        });
      }
      if (action === 'reload') {
        if (!loaded) { loadSite(); return; }
        setState('loading', '원사이트를 새로고침하는 중입니다.');
        frame.src = 'about:blank';
        window.setTimeout(function () { frame.src = url; }, 80);
      }
      if (action === 'unload') unloadSite();
      if (action === 'fullscreen') {
        var stage = root.querySelector('.ws-live-stage');
        if (document.fullscreenElement) document.exitFullscreen();
        else if (stage && stage.requestFullscreen) stage.requestFullscreen();
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (!loaded || document.visibilityState !== 'hidden') return;
      setState('paused', '탭이 숨겨져 원사이트 애니메이션이 브라우저 절전 모드로 전환됩니다.');
    });
    window.addEventListener('pagehide', function () {
      window.clearTimeout(loadTimer);
    }, { once: true });
  }

  document.querySelectorAll('[data-live-case]').forEach(init);
})();
