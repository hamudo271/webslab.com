/* WEBSLAB_SUPPORT_V1_20261123 — 고객지원
   공지사항: 서버가 그려 보낸 목록(/notice)에 검색·쪽 나누기·새 글 표시를 붙인다. 본문은 /notice/번호.
   자주묻는질문: 분류 버튼·검색·펼침. 주소 #faq-3 이면 그 질문을 열어 둔다. */
(function () {
  'use strict';
  var ICON = {
    chev: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    left: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function norm(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function highlight(node, text, q) {
    node.textContent = '';
    if (!q) { node.textContent = text; return; }
    var lower = text.toLowerCase(), i = 0, at;
    while ((at = lower.indexOf(q, i)) !== -1) {
      node.appendChild(document.createTextNode(text.slice(i, at)));
      node.appendChild(el('mark', '', text.slice(at, at + q.length)));
      i = at + q.length;
    }
    node.appendChild(document.createTextNode(text.slice(i)));
  }
  function bindSearch(input, clear, onChange) {
    var t;
    input.addEventListener('input', function () { clear.hidden = !input.value; clearTimeout(t); t = setTimeout(onChange, 120); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape' && input.value) { input.value = ''; clear.hidden = true; onChange(); } });
    clear.addEventListener('click', function () { input.value = ''; clear.hidden = true; onChange(); input.focus(); });
  }

  /* ── 공지사항 ── 목록과 본문은 서버가 그려서 보낸다(src/data/notices.ts). 여기서는 검색·쪽 나누기·새 글 표시만 맡는다. */
  var notice = document.getElementById('wsNotice');
  // 예전 주소(/notice/?no=3)로 들어오면 글 주소(/notice/3)로 옮긴다
  var oldNo = notice ? parseInt(new URLSearchParams(location.search).get('no'), 10) : NaN;
  if (oldNo > 0) location.replace('/notice/' + oldNo);
  var list = notice && notice.querySelector('.ws-notice-list');
  if (list) {
    var rows = Array.prototype.slice.call(list.children);
    var PER = 10, page = 1;
    var count = notice.querySelector('.ws-sup__count');
    var empty = notice.querySelector('.ws-sup__empty');
    var pager = notice.querySelector('.ws-sup__pager');
    var input = notice.querySelector('.ws-sup__search input');
    var clear = notice.querySelector('.ws-sup__clear');
    var today = new Date();
    rows.forEach(function (li) {
      var title = li.querySelector('.ws-notice-row__title'), span = title.querySelector('span'), time = li.querySelector('time');
      li._span = span; li._title = span.textContent;
      li._hay = li.getAttribute('data-search') || li._title.toLowerCase();
      // 올린 지 14일이 안 된 글에 'N'
      if (time && (today - new Date(time.dateTime + 'T00:00:00')) / 864e5 <= 14) {
        var nw = el('i', 'ws-notice-row__new', 'N'); nw.setAttribute('aria-label', '새 글'); title.appendChild(nw);
      }
    });

    function renderList() {
      var q = norm(input.value);
      var hits = q ? rows.filter(function (li) { return li._hay.indexOf(q) !== -1; }) : rows;
      var pages = Math.max(1, Math.ceil(hits.length / PER)); if (page > pages) page = pages;
      count.innerHTML = (q ? '검색 결과 <strong>' : '전체 <strong>') + hits.length + '</strong>건';
      rows.forEach(function (li) { li.hidden = true; });
      hits.slice((page - 1) * PER, page * PER).forEach(function (li) { li.hidden = false; highlight(li._span, li._title, q); });
      empty.hidden = hits.length > 0; list.hidden = hits.length === 0;
      renderPager(pages);
    }
    function renderPager(pages) {
      pager.replaceChildren(); pager.hidden = pages <= 1; if (pages <= 1) return;
      function btn(label, to, opts) {
        var b = el('button'); b.type = 'button'; if (opts && opts.html) { b.innerHTML = label; b.setAttribute('aria-label', opts.aria); } else b.textContent = label;
        if (to === page && !(opts && opts.html)) b.setAttribute('aria-current', 'page');
        b.disabled = to < 1 || to > pages || (opts && opts.html && to === page);
        b.addEventListener('click', function () { page = to; renderList(); notice.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        pager.appendChild(b);
      }
      btn(ICON.left, page - 1, { html: true, aria: '이전 페이지' });
      for (var i = 1; i <= pages; i++) btn(String(i), i);
      btn(ICON.chev, page + 1, { html: true, aria: '다음 페이지' });
    }
    bindSearch(input, clear, function () { page = 1; renderList(); });
    notice.querySelector('.ws-sup__empty .ws-sup__btn').addEventListener('click', function () { input.value = ''; clear.hidden = true; page = 1; renderList(); input.focus(); });
    renderList();
  }

  /* ── 자주묻는질문 ── */
  var faq = document.getElementById('wsFaq');
  if (faq) {
    var items = Array.prototype.slice.call(faq.querySelectorAll('.ws-faq-item'));
    var cats = Array.prototype.slice.call(faq.querySelectorAll('.ws-faq-cats button'));
    var fInput = faq.querySelector('.ws-sup__search input');
    var fClear = faq.querySelector('.ws-sup__clear');
    var fCount = faq.querySelector('.ws-sup__count');
    var fEmpty = faq.querySelector('.ws-sup__empty');
    var current = 'all';
    items.forEach(function (it) {
      var q = it.querySelector('.ws-faq-q'), text = q.querySelector('.ws-faq-q__text');
      it._q = text.getAttribute('data-text') || text.textContent; text.setAttribute('data-text', it._q);
      it._hay = norm(it._q + ' ' + it.querySelector('.ws-faq-a__body').textContent);
      q.addEventListener('click', function () { toggle(it, !it.classList.contains('is-open')); });
    });
    function toggle(it, open) {
      it.classList.toggle('is-open', open);
      it.querySelector('.ws-faq-q').setAttribute('aria-expanded', open ? 'true' : 'false');
      it.querySelector('.ws-faq-a').setAttribute('aria-hidden', open ? 'false' : 'true');
      it.querySelector('.ws-faq-a').inert = !open;
      if (open && it.id) history.replaceState(null, '', '#' + it.id);
    }
    function apply() {
      var q = norm(fInput.value), shown = 0;
      items.forEach(function (it) {
        var ok = (current === 'all' || it.getAttribute('data-cat') === current) && (!q || it._hay.indexOf(q) !== -1);
        it.hidden = !ok; if (ok) shown++;
        highlight(it.querySelector('.ws-faq-q__text'), it._q, q);
      });
      fCount.innerHTML = (q ? '검색 결과 <strong>' : '질문 <strong>') + shown + '</strong>개';
      fEmpty.hidden = shown > 0;
    }
    cats.forEach(function (b) {
      b.addEventListener('click', function () {
        current = b.getAttribute('data-cat');
        cats.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        apply();
      });
    });
    bindSearch(fInput, fClear, apply);
    faq.querySelector('.ws-sup__empty .ws-sup__btn').addEventListener('click', function () { fInput.value = ''; fClear.hidden = true; current = 'all'; cats.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === 'all' ? 'true' : 'false'); }); apply(); });
    var askAi = faq.querySelector('[data-ask-ai]');
    if (askAi) askAi.addEventListener('click', function (e) {
      var sheet = document.querySelector('.wsai-v8__sheet'); if (!sheet) return;
      e.preventDefault(); e.stopPropagation(); sheet.click();
    });
    var target = location.hash && document.getElementById(location.hash.slice(1));
    if (target && target.classList.contains('ws-faq-item')) { toggle(target, true); setTimeout(function () { target.scrollIntoView({ block: 'center' }); }, 50); }
    apply();
  }
}());
