/* WEBSLAB_HEADER_TOSS_V2_20261102 */
(function () {
  'use strict';

  var header = document.getElementById('cmHeader');
  if (!header) return;

  document.documentElement.classList.add('ws-header-js');

  var setElevated = function () {
    header.classList.toggle('ws-header-elevated', window.scrollY > 12);
  };

  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var links = document.querySelectorAll('.cm-gnb-link, .cm-mobile-nav-link, .cm-mobile-nav-sub-link');
  links.forEach(function (link) {
    var url;
    try {
      url = new URL(link.href, window.location.origin);
    } catch (_) {
      return;
    }
    var linkPath = url.pathname.replace(/\/+$/, '') || '/';
    var directMatch = linkPath === path;
    var portfolioMatch = path.indexOf('/portfolio/') === 0 && linkPath === '/portfolio';
    var programMatch = path === '/program' && linkPath === '/service' && /홈페이지 제작/.test(link.textContent || '');
    if (!directMatch && !portfolioMatch && !programMatch) return;
    link.setAttribute('aria-current', 'page');
    var item = link.closest('.cm-gnb-item, .cm-mobile-nav-item');
    if (item) item.classList.add('is-current');
  });

  // 상단 메뉴 링크가 하나도 맞지 않으면 하위 메뉴(예: 고객지원 > 자주묻는질문)로 부모 메뉴를 표시
  if (!document.querySelector('.cm-gnb-item.is-current')) {
    document.querySelectorAll('.cm-gnb-sub-link').forEach(function (link) {
      var url; try { url = new URL(link.href, window.location.origin); } catch (_) { return; }
      if ((url.pathname.replace(/\/+$/, '') || '/') !== path) return;
      link.setAttribute('aria-current', 'page');
      var item = link.closest('.cm-gnb-item'); if (item) item.classList.add('is-current');
    });
  }

  setElevated();
  window.addEventListener('scroll', setElevated, { passive: true });
})();
