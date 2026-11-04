/* WEBSLAB_HERO_V1_20261102
   메인 히어로 — 브라우저 탭으로 제작사례를 전환한다.
   자동 전환은 탭 진행바의 animationend 로 넘어가므로, CSS 로 멈추면(hover·화면 밖·일시정지) 타이머도 함께 멈춘다. */
(function () {
  'use strict';

  var hero = document.getElementById('wsHero');
  if (!hero) return;

  var CASES = [
    { name: '코스모스악기 · Roland Korea 브랜드 사이트', meta: '브랜드 · 신규 제작 · 반응형 홈페이지', href: '/portfolio/roland-korea/', domain: 'rolandkorea.com', tint: '#ff5a1f' },
    { name: '공간의 분위기를 담은 별하 스터디카페', meta: '브랜드 · 공간 경험 · 반응형 홈페이지', href: '/portfolio/byeolha-studycafe/', domain: 'project12.co.kr', tint: '#2fbf8f' },
    { name: '콘텐츠가 중심이 되는 유니버랩 미디어', meta: '미디어 · 브랜드 사이트 · 반응형 홈페이지', href: '/portfolio/univerlab-media/', domain: 'univerlabmedia.co.kr', tint: '#5b4ff5' },
    { name: '정보 구조를 새로 세운 대한잠수협회', meta: '협회 · 공식 사이트 · 반응형 홈페이지', href: '/portfolio/blue-ocean-guardians/', domain: 'blueoceanguardians.org', tint: '#1683c6' }
  ];

  var tabs = Array.prototype.slice.call(hero.querySelectorAll('.ws-browser__tab'));
  var panel = hero.querySelector('.ws-browser__screen');
  var pcShots = hero.querySelectorAll('.ws-browser__screen .ws-shot');
  var moShots = hero.querySelectorAll('.ws-phone__screen .ws-shot');
  var bgs = hero.querySelectorAll('.ws-hero__bg-img');
  var domain = hero.querySelector('.ws-browser__domain');
  var phoneUrl = hero.querySelector('.ws-phone__url b');
  var caseName = hero.querySelector('.ws-hero__case-name');
  var caseMeta = hero.querySelector('.ws-hero__case-meta');
  var caseLink = hero.querySelector('.ws-hero__case-link');
  var stage = hero.querySelector('.ws-hero__stage');
  var pauseBtn = hero.querySelector('.ws-browser__pause');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;

  function loadDeferred() {
    hero.querySelectorAll('.ws-shot[data-src]').forEach(function (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
    hero.querySelectorAll('.ws-hero__bg-img[data-bg]').forEach(function (bg) {
      bg.style.backgroundImage = "url('" + bg.getAttribute('data-bg') + "')";
      bg.removeAttribute('data-bg');
    });
  }

  function restart(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // reflow — 애니메이션 처음부터 다시
    el.classList.add(cls);
  }

  function select(index, focusTab) {
    var data = CASES[index];
    if (!data) return;
    loadDeferred();
    current = index;

    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      var bar = tab.querySelector('.ws-browser__tab-progress');
      if (on && bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    });
    if (focusTab) tabs[index].focus();
    panel.setAttribute('aria-labelledby', tabs[index].id);

    [pcShots, moShots].forEach(function (list) {
      Array.prototype.forEach.call(list, function (img, i) {
        img.classList.toggle('is-active', i === index);
        img.classList.remove('is-scrolling');
        if (i === index) restart(img, 'is-scrolling');
      });
    });

    Array.prototype.forEach.call(bgs, function (bg, i) {
      bg.classList.toggle('is-active', i === index);
    });

    domain.textContent = data.domain;
    if (phoneUrl) phoneUrl.textContent = data.domain;
    caseName.textContent = data.name;
    caseMeta.textContent = data.meta;
    caseLink.setAttribute('href', data.href);
    caseLink.setAttribute('aria-label', data.name + ' 사례 자세히 보기');
    hero.style.setProperty('--ws-case-tint', data.tint);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i); });

    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });

    var bar = tab.querySelector('.ws-browser__tab-progress');
    if (bar) {
      bar.addEventListener('animationend', function () {
        if (i === current) select((current + 1) % tabs.length);
      });
    }
  });

  function setPaused(paused) {
    hero.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.setAttribute('aria-label', paused ? '사례 자동 전환 재생' : '사례 자동 전환 멈춤');
    var icon = pauseBtn.querySelector('i');
    if (icon) icon.className = paused ? 'xi-play' : 'xi-pause';
  }

  if (reduceMotion) {
    // 움직임 최소화: 자동 전환·자동 스크롤 없이 탭으로만 넘긴다
    pauseBtn.hidden = true;
  } else {
    hero.classList.add('is-auto');
    pauseBtn.addEventListener('click', function () {
      setPaused(!hero.classList.contains('is-paused'));
    });

    // 마우스를 올리거나 키보드로 탐색하는 동안에는 잠시 멈춘다
    stage.addEventListener('mouseenter', function () { hero.classList.add('is-hovering'); });
    stage.addEventListener('mouseleave', function () { hero.classList.remove('is-hovering'); });
    stage.addEventListener('focusin', function () { hero.classList.add('is-hovering'); });
    stage.addEventListener('focusout', function (e) {
      if (!stage.contains(e.relatedTarget)) hero.classList.remove('is-hovering');
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }, { threshold: 0.15 }).observe(stage);
    }

    restart(pcShots[0], 'is-scrolling');
    restart(moShots[0], 'is-scrolling');
  }

  // 첫 화면 이후 나머지 사례 이미지를 미리 받아 둔다
  if (document.readyState === 'complete') setTimeout(loadDeferred, 1200);
  else window.addEventListener('load', function () { setTimeout(loadDeferred, 1200); });
})();
