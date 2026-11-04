/* WEBSLAB_COLUMN_V1_20261104 — 전문 칼럼 분류 탭
   탭을 누르면 그 분류의 줄만 남기고 번호를 다시 매긴다. 주소 #분류이름 으로 들어오면 그 탭을 연다. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-col');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.col-tabs button'));
  var rows = Array.prototype.slice.call(root.querySelectorAll('.col-row'));
  var count = root.querySelector('.col-count b');

  function show(cat, push) {
    var n = 0;
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-cat') === cat ? 'true' : 'false'); });
    rows.forEach(function (r) {
      var on = cat === 'all' || r.getAttribute('data-cat') === cat;
      r.hidden = !on;
      if (on) { n++; r.querySelector('.col-row__no').textContent = (n < 10 ? '0' : '') + n; }
    });
    count.textContent = String(n);
    if (push) history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + encodeURIComponent(cat));
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('data-cat'), true); }); });

  var start = decodeURIComponent(location.hash.slice(1));
  show(tabs.some(function (t) { return t.getAttribute('data-cat') === start; }) ? start : 'all', false);
}());
