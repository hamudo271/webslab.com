/* WEBSLAB_HEADER_NAV_V1_20261104 — 헤더 메뉴의 미끄러지는 알약
   올린(또는 초점을 준) 메뉴 위로 회색 알약을 옮긴다. 위치는 clip-path로만 바꿔 레이아웃을 다시 계산하지 않는다.
   메뉴 밖으로 나가면 사라지고, 다시 들어올 때는 그 자리에서 바로 나타난다. */
(function () {
  'use strict';
  var list = document.querySelector('.ws-header-developed-v4 .cm-gnb-list');
  if (!list) return;
  var hl = document.createElement('span');
  hl.className = 'ws-gnb-hl';
  hl.setAttribute('aria-hidden', 'true');
  list.insertBefore(hl, list.firstChild);

  function moveTo(link, jump) {
    var lr = list.getBoundingClientRect(), r = link.getBoundingClientRect();
    hl.classList.toggle('is-jump', !!jump);
    hl.style.setProperty('--l', (r.left - lr.left) + 'px');
    hl.style.setProperty('--r', (lr.right - r.right) + 'px');
    hl.style.setProperty('--t', (r.top - lr.top) + 'px');
    hl.style.setProperty('--b', (lr.bottom - r.bottom) + 'px');
    if (jump) { hl.getBoundingClientRect(); hl.classList.remove('is-jump'); }
    hl.classList.add('is-on');
  }
  Array.prototype.forEach.call(list.querySelectorAll('.cm-gnb-item'), function (item) {
    var link = item.querySelector('.cm-gnb-link');
    item.addEventListener('pointerenter', function () { moveTo(link, !hl.classList.contains('is-on')); });
    link.addEventListener('focus', function () { moveTo(link, !hl.classList.contains('is-on')); });
  });
  list.addEventListener('pointerleave', function () { hl.classList.remove('is-on'); });
  list.addEventListener('focusout', function (e) { if (!list.contains(e.relatedTarget)) hl.classList.remove('is-on'); });
}());
