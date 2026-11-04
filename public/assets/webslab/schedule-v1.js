/* WEBSLAB_SCHEDULE_V1_20261104 — 제작 일정(ws-sched)
   판이 화면을 지나가는 동안 --day를 0 → 28로 올린다(스크롤 위치가 목표, 실제 값은 부드럽게 따라간다).
   '처음부터 재생'은 스크롤과 상관없이 7초 동안 1일차부터 28일차까지 돌려 본다.
   막대에 올리거나 초점을 주면 그 기간을 세로 띠로 보여준다. */
(function () {
  'use strict';
  var root = document.querySelector('.ws-sched');
  if (!root) return;
  var board = root.querySelector('.ws-sched__board');
  var DAYS = 28;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bars = Array.prototype.slice.call(board.querySelectorAll('.ws-sched__bar')).map(function (el) {
    var cs = el.getAttribute('style');
    return { el: el, s: +/--s:(\d+)/.exec(cs)[1], e: +/--e:(\d+)/.exec(cs)[1], name: el.getAttribute('data-name'),
             lane: el.closest('.ws-sched__lane').getAttribute('data-lane'), main: !el.classList.contains('ws-sched__bar--sub') };
  });
  var days = Array.prototype.slice.call(board.querySelectorAll('.ws-sched__days li'));
  var miles = Array.prototype.slice.call(board.querySelectorAll('.ws-sched__miles li')).map(function (el) {
    return { el: el, x: +/--x:(\d+)/.exec(el.getAttribute('style'))[1] };
  });
  var axis = board.querySelector('.ws-sched__axis');
  var liveWeek = root.querySelector('.ws-sched__live-week');
  var liveDay = root.querySelector('.ws-sched__live-day b');
  var liveNow = root.querySelector('.ws-sched__live-now');
  var liveBar = root.querySelector('.ws-sched__live-bar');
  var focusLabel = board.querySelector('.ws-sched__focus span');
  var playBtn = root.querySelector('.ws-sched__play');

  var current = reduce ? DAYS : 0, target = current, raf = 0, lastShown = -1;

  function render(day) {
    board.style.setProperty('--day', day.toFixed(3));
    liveBar.style.setProperty('--day', day.toFixed(3));
    board.classList.toggle('is-start', day < .05);
    var shown = Math.min(DAYS, Math.max(1, Math.ceil(day)));
    if (shown === lastShown && day > 0 && day < DAYS) { return; }
    lastShown = shown;
    liveDay.textContent = String(shown);
    liveWeek.textContent = Math.ceil(shown / 7) + '주차';
    days.forEach(function (li, i) {
      li.classList.toggle('is-past', i + 1 < shown);
      li.classList.toggle('is-today', i + 1 === shown && day > 0);
    });
    miles.forEach(function (m) { m.el.classList.toggle('is-passed', day >= m.x && (m.x > 0 || day > 0)); });
    var now = [];
    bars.forEach(function (b) {
      var done = day >= b.e, active = day > b.s - 1 && !done;
      b.el.classList.toggle('is-done', done);
      b.el.classList.toggle('is-now', active);
      if (active && !b.main && b.lane !== 'pm') now.push(b);
    });
    if (day <= 0) liveNow.innerHTML = '<em>킥오프</em> · 일정 수립';
    else if (day >= DAYS) liveNow.innerHTML = '<em>오픈</em> · 모든 단계 완료';
    else if (now.length) liveNow.innerHTML = now.map(function (b) {
      var lane = board.querySelector('[data-lane="' + b.lane + '"] .ws-sched__label strong').textContent;
      return '<em>' + lane + '</em> · ' + b.name;
    }).join('  ');
  }

  function loop() {
    var d = target - current;
    current = Math.abs(d) < .01 ? target : current + d * .16;
    render(current);
    raf = current === target ? 0 : requestAnimationFrame(loop);
  }
  function go(t) { target = t; if (!raf) raf = requestAnimationFrame(loop); }

  /* 스크롤 — 판 위쪽이 화면 85% 지점에 닿을 때 0일, 17% 지점(헤더·탭 아래)에 닿을 때 28일 */
  var playing = false, holdY = null;
  function measure() { board.style.setProperty('--axis', (axis.offsetTop + axis.offsetHeight - board.clientTop) + 'px'); }
  measure();
  window.addEventListener('resize', measure);
  function fromScroll() {
    if (playing) return;
    if (holdY !== null) { if (Math.abs(window.scrollY - holdY) < 60) return; holdY = null; }
    var vh = window.innerHeight, top = board.getBoundingClientRect().top;
    var p = (vh * .85 - top) / (vh * .68);
    go(Math.max(0, Math.min(1, p)) * DAYS);
  }
  if (reduce) render(DAYS);
  else {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; fromScroll(); });
    }, { passive: true });
    window.addEventListener('resize', fromScroll);
    render(0); fromScroll();
  }

  /* 처음부터 재생 */
  playBtn.addEventListener('click', function () {
    if (reduce) return;
    playing = true; root.classList.add('is-playing');
    cancelAnimationFrame(raf); raf = 0;
    var t0 = performance.now(), dur = 7000;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur);
      current = target = k * DAYS; render(current);
      if (k < 1) requestAnimationFrame(step);
      else { playing = false; holdY = window.scrollY; root.classList.remove('is-playing'); }
    }(t0));
  });

  /* 올리기 — 기간 띠 · 날짜 칸 · 단계 이름을 함께 밝히고, 막대 위에 이름과 기간을 띄운다 */
  var overlay = board.querySelector('.ws-sched__overlay');
  var tip = board.querySelector('.ws-sched__tip');
  function span(b) { return (b.s === b.e ? b.s + '일차' : b.s + '–' + b.e + '일차') + ' · ' + (b.e - b.s + 1) + '일'; }
  function hot(b) {
    board.style.setProperty('--fs', b.s); board.style.setProperty('--fe', b.e);
    focusLabel.textContent = span(b);
    bars.forEach(function (x) { x.el.classList.toggle('is-hot', x === b); });
    days.forEach(function (li, i) { li.classList.toggle('is-range', i + 1 >= b.s && i + 1 <= b.e); });
    Array.prototype.forEach.call(board.querySelectorAll('.ws-sched__lane'), function (l) { l.classList.toggle('is-hot', l.getAttribute('data-lane') === b.lane); });
    tip.querySelector('b').textContent = b.name;
    tip.querySelector('span').textContent = span(b);
    var o = overlay.getBoundingClientRect(), r = b.el.getBoundingClientRect();
    var x = Math.max(90, Math.min(o.width - 90, r.left - o.left + r.width / 2));
    tip.style.left = x + 'px'; tip.style.top = (r.top - o.top - 10) + 'px';
    tip.style.setProperty('--tc', getComputedStyle(b.el).getPropertyValue('--c1'));
    board.classList.add('is-focus');
  }
  function cool() {
    board.classList.remove('is-focus');
    bars.forEach(function (x) { x.el.classList.remove('is-hot'); });
    days.forEach(function (li) { li.classList.remove('is-range'); });
    Array.prototype.forEach.call(board.querySelectorAll('.ws-sched__lane.is-hot'), function (l) { l.classList.remove('is-hot'); });
  }
  bars.forEach(function (b) {
    b.el.addEventListener('pointerenter', function () { hot(b); });
    b.el.addEventListener('pointerleave', cool);
    b.el.addEventListener('focus', function () { hot(b); });
    b.el.addEventListener('blur', cool);
    b.el.addEventListener('click', function () { openDlg(b.lane, b); });
    b.el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDlg(b.lane, b); }
    });
  });

  /* 상세 일정표 — 막대를 누르면 그 단계의 기간·세부 작업 표·역할을 한 장에 보여준다.
     역할 문구는 같은 페이지 '제작 절차' 섹션에 적힌 내용을 그대로 쓴다. */
  var INFO = {
    pm: { kicker: '전체 기간', desc: '킥오프에서 페이지와 기능을 함께 확정하고 단계별 일정을 세운 뒤, 오픈까지 일정과 진행 상황을 관리합니다.',
      client: ['희망 예산 · 오픈 일정 공유', '진행 중 피드백 회신'],
      us: ['단계별 일정 및 체크리스트 제안', '오픈 일자가 정해져 있으면 일정을 역산해 안내'] },
    plan: { kicker: '1단계', desc: '1:1 맞춤 컨설팅으로 제작 목적을 정리하고, 원하는 컨셉과 방향, 콘텐츠 등의 기획을 정의합니다.',
      client: ['제작 목적 · 타겟 · 사이트맵 정리', '참고 레퍼런스 사이트 2~3개', '희망 예산 · 오픈 일정 공유'],
      us: ['사이트맵 · 페이지 구조 설계', '단계별 일정 및 체크리스트 제안'] },
    design: { kicker: '2단계', desc: '기획안을 토대로 메인과 주요 서브 페이지 시안을 작업합니다. PC·모바일 뷰를 함께 설계하고, 2회 수정이 기본 포함됩니다.',
      client: ['로고 원본 · 브랜드 컬러 · 폰트 가이드', '페이지별 텍스트 원고 확정', '매장·제품·시설 사진 등 이미지 자료'],
      us: ['메인 · 서브 시안 제작', 'PC · 모바일 반응형 뷰 동시 설계', '시안 뷰어 링크 공유 및 수정 반영'] },
    publish: { kicker: '3단계', desc: '확정된 시안을 바탕으로 PC·태블릿·모바일 반응형으로 구현합니다. 작업 중에는 임시 URL로 진행 상황을 실시간 확인할 수 있습니다.',
      client: ['디자인 최종 컨펌', '플러그인 · 커스텀 기능 요구 최종 확정', '진행 중 피드백 회신'],
      us: ['커스텀 테마 퍼블리싱', '커스텀 기능 · 게시판 · 폼 개발', 'PC / 태블릿 / 모바일 3단 검수'] },
    open: { kicker: '4단계', desc: '브라우저 호환·속도·SEO 내부 QA를 거친 뒤 호스팅·도메인·SSL·메일 운영 환경까지 직접 세팅해 납품합니다.',
      client: ['최종 검수 및 수정사항 확정', '도메인 · 호스팅 계정 정보 공유', '오픈 일정 확정'],
      us: ['크로스 브라우저 · 속도 · SEO QA', '호스팅 · 도메인 · SSL · SMTP 세팅', '관리자 사용 매뉴얼 전달', '정기 유지보수 연계 안내'] }
  };
  var ORDER = ['pm', 'plan', 'design', 'publish', 'open'];
  var CHK = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 8.4 2.6 2.6L12 5.6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARR = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function laneOf(key) {
    var lane = board.querySelector('[data-lane="' + key + '"]');
    var mine = bars.filter(function (b) { return b.lane === key; });
    var main = mine.filter(function (b) { return b.main; })[0];
    var subs = mine.filter(function (b) { return !b.main; });
    return { key: key, name: lane.querySelector('.ws-sched__label strong').textContent, s: main ? main.s : 1, e: main ? main.e : DAYS, subs: subs,
             c1: getComputedStyle(lane).getPropertyValue('--c1').trim(), c2: getComputedStyle(lane).getPropertyValue('--c2').trim() };
  }

  var dlg = document.createElement('dialog');
  dlg.className = 'ws-sched-dlg';
  dlg.setAttribute('aria-labelledby', 'wsSchedDlgTitle');
  document.body.appendChild(dlg);
  var curKey = null, lastFocus = null;

  function renderDlg(key, focusBar) {
    curKey = key;
    var L = laneOf(key), I = INFO[key], n = L.e - L.s + 1, share = Math.round(n / DAYS * 100);
    var idx = ORDER.indexOf(key), prev = ORDER[idx - 1], next = ORDER[idx + 1];
    var R = 46, C = 2 * Math.PI * R;
    var weeks = '';
    for (var w = 1; w <= 4; w++) weeks += '<li><b>' + w + '주차</b><span>' + ((w - 1) * 7 + 1) + '–' + (w * 7) + '일</span></li>';
    var segs = L.subs.map(function (b, i) {
      return '<li class="' + (focusBar === b ? 'is-hot' : '') + '" style="--s:' + b.s + ';--e:' + b.e + ';--o:' + (1 - i * .18) + '"><b>' + (b.e - b.s + 1) + '일</b></li>';
    }).join('');
    var rows = L.subs.map(function (b, i) {
      var d = b.e - b.s + 1, pct = Math.round(d / n * 100);
      return '<tr class="' + (focusBar === b ? 'is-hot' : '') + '"><th scope="row"><span class="ws-sched-dlg__no" style="--o:' + (1 - i * .18) + '">' + (i + 1) + '</span>' + esc(b.name) + '</th>' +
        '<td class="is-num">' + (b.s === b.e ? b.s + '일차' : b.s + '–' + b.e + '일차') + '</td>' +
        '<td class="is-num"><b>' + d + '</b>일</td>' +
        '<td><span class="ws-sched-dlg__meter" style="--p:' + (d / n) + '"><i></i></span><em>' + pct + '%</em></td></tr>';
    }).join('');
    var li = function (arr) { return arr.map(function (t) { return '<li><span>' + CHK + '</span>' + esc(t) + '</li>'; }).join(''); };
    dlg.style.setProperty('--c1', L.c1); dlg.style.setProperty('--c2', L.c2);
    dlg.innerHTML =
      '<div class="ws-sched-dlg__sheet">' +
        '<header class="ws-sched-dlg__head">' +
          '<div><p class="ws-sched-dlg__kicker"><i></i>' + I.kicker + '</p>' +
          '<h3 id="wsSchedDlgTitle">' + esc(L.name) + '</h3>' +
          '<ul class="ws-sched-dlg__meta"><li><b>' + (key === 'pm' ? '1–28일차' : L.s + '–' + L.e + '일차') + '</b></li><li>' + n + '일</li><li>세부 작업 ' + L.subs.length + '개</li></ul></div>' +
          '<button type="button" class="ws-sched-dlg__close" aria-label="상세 일정 닫기"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' +
        '</header>' +
        '<div class="ws-sched-dlg__body">' +
          '<p class="ws-sched-dlg__desc">' + esc(I.desc) + '</p>' +
          '<div class="ws-sched-dlg__viz">' +
            '<figure class="ws-sched-dlg__ring" aria-label="전체 28일 중 ' + n + '일, ' + share + '%">' +
              '<svg viewBox="0 0 108 108" aria-hidden="true"><circle cx="54" cy="54" r="' + R + '" class="t"/><circle cx="54" cy="54" r="' + R + '" class="v" style="stroke-dasharray:' + C.toFixed(1) + ';--off:' + (C * (1 - n / DAYS)).toFixed(1) + ';--full:' + C.toFixed(1) + '"/></svg>' +
              '<figcaption><b>' + share + '<small>%</small></b><span>28일 중 ' + n + '일</span></figcaption>' +
            '</figure>' +
            '<div class="ws-sched-dlg__strip" aria-hidden="true">' +
              '<ol class="ws-sched-dlg__weeks">' + weeks + '</ol>' +
              '<div class="ws-sched-dlg__rail"><i class="ws-sched-dlg__range" style="--s:' + L.s + ';--e:' + L.e + '"></i><ol class="ws-sched-dlg__segs">' + segs + '</ol></div>' +
              '<p class="ws-sched-dlg__ends"><span style="--x:' + (L.s - 1) + '">' + L.s + '일차 시작</span><span style="--x:' + L.e + '">' + L.e + '일차 완료</span></p>' +
            '</div>' +
          '</div>' +
          '<table class="ws-sched-dlg__table"><caption class="ws-sched-dlg__cap">세부 작업 일정</caption>' +
            '<thead><tr><th scope="col">세부 작업</th><th scope="col">기간</th><th scope="col">일수</th><th scope="col">단계 안 비중</th></tr></thead><tbody>' + rows + '</tbody></table>' +
          '<div class="ws-sched-dlg__roles">' +
            '<section><h4><span>고객</span>준비해 주실 것</h4><ul>' + li(I.client) + '</ul></section>' +
            '<section class="is-us"><h4><span>웹스랩</span>웹스랩이 하는 일</h4><ul>' + li(I.us) + '</ul></section>' +
          '</div>' +
        '</div>' +
        '<footer class="ws-sched-dlg__foot">' +
          (prev ? '<button type="button" class="ws-sched-dlg__nav" data-go="' + prev + '"><span class="is-flip">' + ARR + '</span><small>이전</small>' + esc(laneOf(prev).name) + '</button>' : '<span></span>') +
          (next ? '<button type="button" class="ws-sched-dlg__nav is-next" data-go="' + next + '"><small>다음</small>' + esc(laneOf(next).name) + '<span>' + ARR + '</span></button>' : '<a class="ws-sched-dlg__nav is-next is-cta" href="/contact/">이 일정으로 상담받기<span>' + ARR + '</span></a>') +
        '</footer>' +
      '</div>';
    dlg.querySelector('.ws-sched-dlg__close').addEventListener('click', closeDlg);
    Array.prototype.forEach.call(dlg.querySelectorAll('[data-go]'), function (btn) {
      btn.addEventListener('click', function () { renderDlg(btn.getAttribute('data-go')); dlg.querySelector('.ws-sched-dlg__sheet').focus(); });
    });
    dlg.querySelector('.ws-sched-dlg__sheet').setAttribute('tabindex', '-1');
    requestAnimationFrame(function () { dlg.classList.add('is-drawn'); });
    dlg.classList.remove('is-drawn');
  }
  function openDlg(key, focusBar) {
    lastFocus = document.activeElement;
    renderDlg(key, focusBar);
    cool();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('ws-sched-lock');
    dlg.querySelector('.ws-sched-dlg__close').focus();
  }
  function closeDlg() {
    dlg.classList.add('is-closing');
    setTimeout(function () {
      dlg.classList.remove('is-closing');
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    }, reduce ? 0 : 180);
  }
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('ws-sched-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeDlg(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('a, button') && (e.key === 'Enter' || e.key === ' ')) return;
    var i = ORDER.indexOf(curKey);
    if (e.key === 'ArrowRight' && ORDER[i + 1]) { e.preventDefault(); renderDlg(ORDER[i + 1]); dlg.querySelector('.ws-sched-dlg__sheet').focus(); }
    if (e.key === 'ArrowLeft' && ORDER[i - 1]) { e.preventDefault(); renderDlg(ORDER[i - 1]); dlg.querySelector('.ws-sched-dlg__sheet').focus(); }
  });
}());
