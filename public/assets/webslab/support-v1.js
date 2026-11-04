/* WEBSLAB_SUPPORT_V1_20261104 — 고객지원
   공지사항: window.WS_NOTICES(notices.js)로 목록·검색·페이지 번호·본문(?no=번호)을 그린다.
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

  /* ── 공지사항 ── */
  var notice = document.getElementById('wsNotice');
  if (notice) {
    var all = (window.WS_NOTICES || []).slice();
    var pinned = all.filter(function (n) { return n.pinned; }).sort(function (a, b) { return b.no - a.no; });
    var rest = all.filter(function (n) { return !n.pinned; }).sort(function (a, b) { return b.no - a.no; });
    var ordered = pinned.concat(rest);
    var PER = 10, page = 1;
    var list = notice.querySelector('.ws-notice-list');
    var count = notice.querySelector('.ws-sup__count');
    var empty = notice.querySelector('.ws-sup__empty');
    var pager = notice.querySelector('.ws-sup__pager');
    var input = notice.querySelector('.ws-sup__search input');
    var clear = notice.querySelector('.ws-sup__clear');
    var listView = notice.querySelector('.ws-sup__listview');
    var post = notice.querySelector('.ws-post');
    var baseTitle = document.title;
    var today = new Date();
    function isNew(d) { var t = new Date(d + 'T00:00:00'); return (today - t) / 864e5 <= 14; }
    function dot(d) { return d.replace(/-/g, '.'); }
    function href(n) { return '?no=' + n.no; }

    function renderList() {
      var q = norm(input.value);
      var hits = q ? ordered.filter(function (n) { return norm(n.title + ' ' + n.body.join(' ')).indexOf(q) !== -1; }) : ordered;
      var pages = Math.max(1, Math.ceil(hits.length / PER)); if (page > pages) page = pages;
      count.innerHTML = q ? '검색 결과 <strong>' + hits.length + '</strong>건' : '전체 <strong>' + hits.length + '</strong>건';
      list.replaceChildren();
      hits.slice((page - 1) * PER, page * PER).forEach(function (n) {
        var li = el('li'), a = el('a', 'ws-notice-row' + (n.pinned ? ' is-pinned' : ''));
        a.href = href(n);
        a.appendChild(n.pinned ? el('span', 'ws-notice-row__pin', '공지') : el('span', 'ws-notice-row__no', String(n.no)));
        var t = el('strong', 'ws-notice-row__title'), s = el('span'); highlight(s, n.title, q); t.appendChild(s);
        if (isNew(n.date)) { var nw = el('i', 'ws-notice-row__new', 'N'); nw.setAttribute('aria-label', '새 글'); t.appendChild(nw); }
        a.appendChild(t);
        var time = el('time', 'ws-notice-row__date', dot(n.date)); time.dateTime = n.date; a.appendChild(time);
        a.insertAdjacentHTML('beforeend', ICON.chev.replace('aria-hidden="true"', 'class="ws-notice-row__chev" aria-hidden="true"'));
        li.appendChild(a); list.appendChild(li);
      });
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
    function renderPost(no) {
      var i = ordered.findIndex(function (n) { return n.no === no; });
      if (i === -1) return false;
      var n = ordered[i];
      // 이전·다음은 번호 순서(고정 여부와 상관없이)
      var byNo = all.slice().sort(function (a, b) { return b.no - a.no; });
      var j = byNo.findIndex(function (x) { return x.no === no; });
      var newer = byNo[j - 1], older = byNo[j + 1];
      post.querySelector('.ws-post__pin').hidden = !n.pinned;
      post.querySelector('.ws-post__title').textContent = n.title;
      var t = post.querySelector('.ws-post__date'); t.textContent = dot(n.date); t.dateTime = n.date;
      post.querySelector('.ws-post__body').innerHTML = n.body.map(function (p) { return '<p>' + p + '</p>'; }).join('');
      var nav = post.querySelector('.ws-post__nav'); nav.replaceChildren();
      [['다음 글', newer], ['이전 글', older]].forEach(function (pair) {
        if (!pair[1]) return; var li = el('li'), a = el('a'); a.href = href(pair[1]);
        a.appendChild(el('small', '', pair[0])); a.appendChild(el('span', '', pair[1].title));
        var tm = el('time', '', dot(pair[1].date)); tm.dateTime = pair[1].date; a.appendChild(tm);
        li.appendChild(a); nav.appendChild(li);
      });
      nav.hidden = !nav.children.length;
      document.title = n.title + ' | 공지사항 | 웹스랩';
      return true;
    }
    function route() {
      var no = parseInt(new URLSearchParams(location.search).get('no'), 10);
      var showPost = !isNaN(no) && renderPost(no);
      post.hidden = !showPost; listView.hidden = showPost;
      if (!showPost) { document.title = baseTitle; renderList(); }
    }
    // 같은 페이지 안에서 목록↔본문을 오갈 때 새로고침 없이
    notice.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="?no="], a.ws-post__back');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      history.pushState(null, '', a.getAttribute('href') === '?' ? location.pathname : a.getAttribute('href'));
      route(); window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      var focusTarget = post.hidden ? list : post.querySelector('.ws-post__title'); if (focusTarget) { focusTarget.setAttribute('tabindex', '-1'); focusTarget.focus({ preventScroll: true }); }
    });
    window.addEventListener('popstate', route);
    bindSearch(input, clear, function () { page = 1; renderList(); });
    notice.querySelector('.ws-sup__empty .ws-sup__btn').addEventListener('click', function () { input.value = ''; clear.hidden = true; page = 1; renderList(); input.focus(); });
    route();
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
