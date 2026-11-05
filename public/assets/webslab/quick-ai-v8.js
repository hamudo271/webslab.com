/* WEBSLAB_AI_ASSISTANT_V8_20261103
   하단 어시스턴트 — 열고 닫기, 질문 → 답변 스트리밍, 사례 카드, 이어서 묻기, 문의 넘기기, 이전 대화(localStorage).
   답변은 공개된 제작 정보로 작성한 스크립트 응답이다. */
(function () {
  'use strict';
  var root = document.getElementById('wsAiV8');
  if (!root) return;
  var sheet = root.querySelector('.wsai-v8__sheet');
  var dialog = root.querySelector('.wsai-v8__dialog');
  var head = root.querySelector('.wsai-v8__head');
  var form = root.querySelector('.wsai-v8__form');
  var field = root.querySelector('.wsai-v8__field');
  var send = root.querySelector('.wsai-v8__send');
  var closeBtn = root.querySelector('[data-wsai-close]');
  var newButtons = root.querySelectorAll('[data-wsai-new]');
  var historyButton = root.querySelector('[data-wsai-history]');
  var historyPanel = root.querySelector('.wsai-v8__history');
  var historyClose = root.querySelector('.wsai-v8__history-close');
  var historyList = root.querySelector('.wsai-v8__history-list');
  var historyClear = root.querySelector('.wsai-v8__history-clear');
  var log = root.querySelector('.wsai-v8__log');
  var welcome = root.querySelector('.wsai-v8__welcome');
  var scroll = root.querySelector('.wsai-v8__scroll');
  var status = root.querySelector('.wsai-v8__status');
  var storageKey = 'wsAiV7History';
  var draftKey = 'wsQuickConsultDraft';
  var current = fresh();
  var streamId = 0;
  var busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var cases = [
    { title: 'Roland Korea', desc: '브랜드와 제품 경험을 연결한 반응형 공식 사이트', meta: '브랜드 · 신규 제작', href: '/portfolio/roland-korea/', image: '/assets/webslab/roland-korea.webp' },
    { title: '별하 스터디카페', desc: '공간의 분위기와 상담 전환을 함께 설계한 브랜드 사이트', meta: '브랜드 · 공간 경험', href: '/portfolio/byeolha-studycafe/', image: '/assets/webslab/byeolha-studycafe.webp' },
    { title: '유니버랩 미디어', desc: '콘텐츠 탐색이 중심이 되는 미디어 브랜드 사이트', meta: '미디어 · 브랜드', href: '/portfolio/univerlab-media/', image: '/assets/webslab/univerlab-media.webp' },
    { title: '대한잠수협회', desc: '복잡한 협회 정보를 다시 구조화한 공식 사이트', meta: '협회 · 정보 구조', href: '/portfolio/blue-ocean-guardians/', image: '/assets/webslab/blue-ocean-guardians.webp' }
  ];

  function fresh() { return { id: String(Date.now()), title: '새 대화', updated: Date.now(), turns: [] }; }
  function el(tag, className, text) { var node = document.createElement(tag); if (className) node.className = className; if (typeof text === 'string') node.textContent = text; return node; }
  function orb(size) { var o = el('span', 'wsai-v8__orb' + (size ? ' wsai-v8__orb--' + size : '')); o.setAttribute('aria-hidden', 'true'); return o; }
  function cleanText(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
  function includesAny(text, words) { return words.some(function (w) { return text.indexOf(w) !== -1; }); }
  function nowTime() { return new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }
  function historyData() { try { var v = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function saveHistory() { if (!current.turns.length) return; var all = historyData().filter(function (i) { return i.id !== current.id; }); current.updated = Date.now(); current.title = current.turns[0].question.slice(0, 40); all.unshift(current); try { localStorage.setItem(storageKey, JSON.stringify(all.slice(0, 12))); } catch (e) {} renderHistory(); }
  function removeHistory(id) { try { localStorage.setItem(storageKey, JSON.stringify(historyData().filter(function (i) { return i.id !== id; }))); } catch (e) {} renderHistory(); }
  function saveDraft(message, type) { try { sessionStorage.setItem(draftKey, JSON.stringify({ type: type || '기타', name: '', phone: '', message: message || '' })); } catch (e) {} }
  function handoff(message, type) { var clean = cleanText(message); if (!clean) return; saveDraft(clean, type); window.location.href = '/contact/?from=ai-assistant&type=' + encodeURIComponent(type || '기타') + '#inquiry'; }

  function responseFor(question, type) {
    var text = cleanText(question).toLowerCase();
    var common = [
      { label: '대표 제작 사례를 보여줘', question: '웹스랩의 대표 제작 사례를 보여줘', type: '제작 사례' },
      { label: '진행 순서는 어떻게 돼?', question: '홈페이지 제작은 어떤 순서로 진행하나요?', type: '진행 방식' }
    ];
    if (type === '제작 사례' || includesAny(text, ['사례', '포트폴리오', '레퍼런스', '실적', '작업물'])) return {
      paragraphs: [
        '웹스랩이 공개한 대표 제작 사례 4건입니다. 브랜드 사이트부터 협회 공식 사이트까지 실제 화면과 정보 구조를 직접 확인할 수 있습니다.',
        '비슷한 업종만 찾기보다, 필요한 전환 방식과 운영 구조가 닮은 사례를 함께 보는 편이 프로젝트 방향을 정하는 데 더 정확합니다.'
      ], cards: cases, followups: [{ label: '리뉴얼 사례의 공통점은?', question: '리뉴얼 프로젝트에서 웹스랩이 먼저 보는 것은 무엇인가요?', type: '리뉴얼' }, { label: '내 업종에 맞는 사례는?', question: '우리 업종에 맞는 홈페이지 사례를 어떻게 고르면 좋을까요?', type: '제작 사례' }], cta: '이 사례 기준으로 문의하기'
    };
    if (type === '리뉴얼' || includesAny(text, ['리뉴얼', '개편', '오래된', '낡은', '재구축'])) return {
      paragraphs: [
        '리뉴얼은 화면을 새로 그리는 작업보다 현재 사이트의 강점과 손실 위험을 먼저 확인하는 일에서 시작합니다. 기존 콘텐츠, 검색 노출, 문의 동선, 운영 기능을 점검한 뒤 유지할 것과 다시 설계할 것을 나눕니다.',
        '그 다음 메뉴와 페이지 구조, 모바일 사용성, CMS 운영 방식, 디자인 시스템을 한 흐름으로 정리해 새 사이트로 옮깁니다.'
      ], cards: [cases[3], cases[2]], followups: common, cta: '현재 사이트 기준으로 상담하기'
    };
    if (includesAny(text, ['견적', '가격', '비용', '예산', '얼마'])) return {
      paragraphs: [
        '홈페이지 견적은 단순 페이지 수보다 실제 제작 범위로 산정합니다. 콘텐츠 준비 상태, 맞춤 디자인 범위, CMS·예약·다국어 같은 기능, 촬영과 원고 지원, 희망 일정이 함께 영향을 줍니다.',
        '현재 사이트나 참고 링크, 필요한 메뉴와 핵심 기능을 알려주시면 불필요한 항목을 빼고 프로젝트에 맞는 범위를 먼저 정리할 수 있어요.'
      ], followups: [{ label: '견적에 필요한 정보는?', question: '정확한 견적을 받으려면 무엇을 준비해야 하나요?', type: '견적' }, { label: '제작 기간도 알려줘', question: '홈페이지 제작 기간은 어떻게 정해지나요?', type: '일정' }], cta: '견적 조건 남기고 문의하기'
    };
    if (type === '일정' || includesAny(text, ['기간', '일정', '얼마나', '언제', '납기', '오픈일'])) return {
      paragraphs: [
        '제작 기간은 확정된 화면 수보다 자료 준비 상태와 의사결정 속도, 맞춤 기능의 난이도, 검수 범위에 더 크게 좌우됩니다.',
        '웹스랩은 목표와 범위를 확인하고 계약 전 메인 시안으로 방향을 먼저 맞춘 뒤 상세 제작, 기능 구현, 검수와 오픈으로 이어갑니다. 희망 오픈일이 있다면 역산해 우선순위와 준비 일정을 함께 정리할 수 있어요.'
      ], followups: [{ label: '제작 과정 자세히 보기', question: '계약 전 시안부터 오픈까지 제작 과정을 알려줘', type: '진행 방식' }, { label: '견적 기준도 궁금해', question: '홈페이지 제작 견적은 어떻게 산정하나요?', type: '견적' }], cta: '희망 오픈일로 상담하기'
    };
    if (includesAny(text, ['cms', '관리자', '수정', '운영', '유지보수', '게시판', '업데이트'])) return {
      paragraphs: [
        '자주 바뀌는 공지, 사례, 제품, 칼럼은 담당자가 직접 관리할 수 있도록 CMS로 구성할 수 있습니다. 반면 보안·서버·맞춤 기능처럼 전문 관리가 필요한 영역은 유지보수 범위로 나누는 편이 안정적입니다.',
        '프로젝트 초기에 누가 어떤 콘텐츠를 얼마나 자주 수정하는지 정하면 관리자 화면을 과하게 만들지 않고 실제 운영에 필요한 기능만 설계할 수 있어요.'
      ], followups: [{ label: 'CMS 적용 사례 보여줘', question: 'CMS가 필요한 기업 홈페이지 사례를 보여줘', type: '제작 사례' }, { label: '유지보수 범위는?', question: '오픈 이후 유지보수는 어떤 범위로 진행하나요?', type: '유지보수' }], cta: '필요한 관리 기능 문의하기'
    };
    if (type === '진행 방식' || includesAny(text, ['과정', '절차', '진행', '순서', '시안', '계약 전'])) return {
      paragraphs: [
        '프로젝트 목표와 필요한 기능을 확인한 뒤, 계약 전에 메인 시안으로 디자인 방향을 먼저 확인합니다. 방향이 맞으면 정보 구조와 상세 화면을 확장하고, 맞춤 기능 개발과 반응형 검수, 콘텐츠 이관, 오픈 점검으로 이어집니다.',
        '기획·디자인·개발·운영이 한 팀에서 연결되기 때문에 화면과 기능 사이의 해석 손실을 줄이는 것이 웹스랩 진행 방식의 핵심입니다.'
      ], followups: [{ label: '계약 전 시안은 어떻게?', question: '계약 전 메인 시안은 어떤 자료로 제작하나요?', type: '진행 방식' }, { label: '대표 사례 보기', question: '웹스랩의 대표 제작 사례를 보여줘', type: '제작 사례' }], cta: '프로젝트 조건 이어서 문의하기'
    };
    if (includesAny(text, ['seo', '검색', '네이버', '구글', '접근성', '반응형', '모바일'])) return {
      paragraphs: [
        '검색 노출과 모바일 사용성은 오픈 직전에 덧붙이는 항목이 아니라 정보 구조와 마크업 단계부터 반영해야 합니다. 페이지별 제목과 설명, 의미 있는 헤딩 구조, 내부 링크, 이미지 대체 텍스트, 반응형 레이아웃을 함께 점검합니다.',
        '운영 이후에도 콘텐츠가 계속 추가된다면 CMS 입력 단계에서 기본 SEO 항목을 관리할 수 있게 설계하는 것이 좋습니다.'
      ], followups: [{ label: '리뉴얼할 때 SEO는?', question: '기존 사이트를 리뉴얼할 때 검색 노출을 어떻게 보존하나요?', type: '리뉴얼' }, { label: '모바일 검수 기준은?', question: '모바일 홈페이지는 어떤 기준으로 검수하나요?', type: '제작' }], cta: '검색·모바일 요구사항 문의하기'
    };
    if (type === '프로젝트 문의' || includesAny(text, ['상담', '문의', '시작', '의뢰'])) return {
      paragraphs: [
        '프로젝트 목적, 현재 사이트 유무, 필요한 메뉴와 기능, 참고 사이트, 희망 오픈일을 알려주시면 상담이 훨씬 빠르고 정확해집니다.',
        '아직 정리된 기획서가 없어도 괜찮아요. 지금 알고 있는 조건만 남기면 확인이 필요한 항목부터 함께 정리할 수 있습니다.'
      ], followups: [{ label: '견적 준비 항목 보기', question: '견적 상담 전에 준비할 내용을 알려줘', type: '견적' }, { label: '제작 사례 먼저 보기', question: '웹스랩의 대표 제작 사례를 보여줘', type: '제작 사례' }], cta: '프로젝트 문의서 작성하기'
    };
    if (type === '제작' || type === '홈페이지 제작' || includesAny(text, ['홈페이지', '웹사이트', '사이트', '제작', '기업', '브랜드'])) return {
      paragraphs: [
        '웹스랩은 기업·브랜드 홈페이지의 기획, UI/UX 디자인, 반응형 개발, CMS와 맞춤 기능, 오픈 이후 운영까지 한 팀에서 연결합니다.',
        '신규 제작이라면 브랜드와 사업 목표를 웹 구조로 옮기는 일에 집중하고, 리뉴얼이라면 기존 콘텐츠와 검색 자산을 보존하면서 사용성과 운영 방식을 다시 설계합니다.'
      ], cards: [cases[0], cases[1], cases[2]], followups: common, cta: '필요한 제작 범위 상담하기'
    };
    return {
      paragraphs: [
        '질문을 웹스랩이 공개한 제작 정보 안에서 확인했지만, 지금 문장만으로는 프로젝트 조건을 정확히 특정하기 어렵습니다.',
        '홈페이지 신규 제작인지 리뉴얼인지, 필요한 기능과 참고 사이트, 가장 중요한 목표를 조금 더 알려주시면 관련 사례와 진행 기준으로 이어서 안내할게요.'
      ], followups: [{ label: '홈페이지 제작 범위', question: '기업 홈페이지 제작 범위를 알려줘', type: '제작' }, { label: '견적 산정 기준', question: '홈페이지 제작 견적은 어떻게 산정하나요?', type: '견적' }, { label: '대표 제작 사례', question: '웹스랩의 대표 제작 사례를 보여줘', type: '제작 사례' }], cta: '이 질문으로 담당자에게 문의하기'
    };
  }

  /* ── 시트 높이: 내용만큼만, 화면 한계까지 ── */
  function sheetCap() {
    var headerH = parseFloat(getComputedStyle(document.body).getPropertyValue('--cm-header-height')) || 72;
    var mobile = window.matchMedia('(max-width: 700px)').matches;
    var room = window.innerHeight - headerH - (mobile ? 16 : (root.classList.contains('has-messages') ? 40 : 56));
    var max = mobile ? room : (root.classList.contains('has-messages') ? 760 : 640);
    return Math.max(260, Math.min(max, room));
  }
  function fitSheet() {
    if (!root.classList.contains('is-open')) { sheet.style.height = ''; return; }
    // scrollHeight는 현재 높이 아래로 내려가지 않으므로 내용 자체를 잰다 (시트가 줄어들 수 있게)
    var content = root.classList.contains('has-messages') ? log.offsetHeight + 6 : welcome.offsetHeight;
    var need = head.offsetHeight + content + 24 + form.offsetHeight + status.offsetHeight + 2;
    var h = Math.min(sheetCap(), need);
    sheet.style.height = h + 'px';
    scroll.classList.toggle('is-scrollable', scroll.scrollHeight > scroll.clientHeight + 1);
  }
  window.addEventListener('resize', fitSheet);

  /* ── 상태 ── */
  function setOpen(open, focus) {
    var was = root.classList.contains('is-open');
    root.classList.toggle('is-open', open);
    root.setAttribute('data-state', open ? 'open' : 'closed');
    if (open) {
      dialog.removeAttribute('hidden');
      requestAnimationFrame(fitSheet);
      if (focus !== false) setTimeout(function () { field.focus({ preventScroll: true }); }, 60);
    } else {
      sheet.style.height = '';
      setHistory(false);
      // 시트가 접히는 동안 내용은 남겨두고, 접힌 뒤 문서에서 뺀다
      setTimeout(function () { if (!root.classList.contains('is-open')) dialog.setAttribute('hidden', ''); }, reduce.matches ? 0 : 480);
      if (was) field.blur();
    }
  }
  function setBusy(value) { busy = value; send.disabled = value || !cleanText(field.value); field.disabled = value; root.classList.toggle('is-busy', value); }
  function setHistory(on) {
    root.classList.toggle('is-history', on);
    if (on) { historyPanel.removeAttribute('hidden'); renderHistory(); historyClose.focus(); }
    else historyPanel.setAttribute('hidden', '');
    historyButton.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) { sheet.style.height = sheetCap() + 'px'; } else if (root.classList.contains('is-open')) requestAnimationFrame(fitSheet);
  }
  function resizeField() { field.style.height = '32px'; field.style.height = Math.min(96, field.scrollHeight) + 'px'; send.disabled = busy || !cleanText(field.value); if (root.classList.contains('is-open')) fitSheet(); }
  function scrollBottom(smooth) { requestAnimationFrame(function () { fitSheet(); scroll.scrollTo({ top: scroll.scrollHeight, behavior: smooth && !reduce.matches ? 'smooth' : 'auto' }); }); }

  /* ── 렌더 ── */
  function userNode(turn) { var box = el('div', 'wsai-v8__user', turn.question); box.setAttribute('title', turn.time); return box; }
  function cardsNode(items) {
    var row = el('div', 'wsai-v8__cards');
    items.forEach(function (item) {
      var link = el('a', 'wsai-v8__card'); link.href = item.href;
      var media = el('div', 'wsai-v8__card-media'); var image = el('img'); image.src = item.image; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async'; media.appendChild(image);
      var copy = el('div', 'wsai-v8__card-copy'); copy.appendChild(el('strong', '', item.title)); copy.appendChild(el('span', '', item.desc)); copy.appendChild(el('em', '', item.meta + ' · 보기'));
      link.appendChild(media); link.appendChild(copy); row.appendChild(link);
    });
    return row;
  }
  function enrichAnswer(body, response, turn) {
    if (response.cards && response.cards.length) body.appendChild(cardsNode(response.cards));
    var suggest = el('div', 'wsai-v8__suggest');
    var chips = el('div', 'wsai-v8__suggest-chips');
    (response.followups || []).forEach(function (item) { var b = el('button', 'wsai-v8__suggest-chip', item.label); b.type = 'button'; b.addEventListener('click', function () { ask(item.question, item.type); }); chips.appendChild(b); });
    suggest.appendChild(chips);
    var inquiry = el('button', 'wsai-v8__inquiry', response.cta || '관련 프로젝트 문의하기'); inquiry.type = 'button'; inquiry.addEventListener('click', function () { handoff(turn.question, turn.type); }); suggest.appendChild(inquiry);
    body.appendChild(suggest);
  }
  function answerShell() { var answer = el('div', 'wsai-v8__answer'); answer.appendChild(orb('sm')); var body = el('div', 'wsai-v8__answer-body'); answer.appendChild(body); return { answer: answer, body: body }; }
  function renderInstant(turn) {
    var wrap = el('article', 'wsai-v8__turn'); wrap.appendChild(userNode(turn));
    var shell = answerShell(); var markdown = el('div', 'wsai-v8__markdown');
    (turn.response.paragraphs || []).forEach(function (text) { markdown.appendChild(el('p', '', text)); });
    shell.body.appendChild(markdown); enrichAnswer(shell.body, turn.response, turn); wrap.appendChild(shell.answer); log.appendChild(wrap);
  }
  function streamTurn(turn) {
    var token = ++streamId;
    var wrap = el('article', 'wsai-v8__turn'); wrap.appendChild(userNode(turn));
    var shell = answerShell();
    var thinking = el('span', 'wsai-v8__thinking', '답변 찾는 중'); thinking.setAttribute('role', 'status');
    shell.body.appendChild(thinking); wrap.appendChild(shell.answer); log.appendChild(wrap); scrollBottom(true); setBusy(true);
    var response = turn.response;
    var markdown = el('div', 'wsai-v8__markdown is-typing');
    markdown.appendChild(el('p'));
    var words = (response.paragraphs || []).map(function (p) { return p.split(/(\s+)/); });
    var pIndex = 0, wIndex = 0;
    var instant = reduce.matches;
    setTimeout(function () {
      if (token !== streamId) return;
      thinking.remove(); shell.body.prepend(markdown);
      function finish() { markdown.classList.remove('is-typing'); enrichAnswer(shell.body, response, turn); turn.answerTime = nowTime(); current.turns.push(turn); saveHistory(); setBusy(false); scrollBottom(true); field.focus({ preventScroll: true }); }
      if (instant) { markdown.replaceChildren(); (response.paragraphs || []).forEach(function (t) { markdown.appendChild(el('p', '', t)); }); finish(); return; }
      var timer = setInterval(function () {
        if (token !== streamId) { clearInterval(timer); return; }
        var list = words[pIndex] || [];
        if (wIndex < list.length) { markdown.children[pIndex].textContent += list[wIndex++]; if (wIndex % 4 === 0) scrollBottom(false); return; }
        pIndex += 1; wIndex = 0;
        if (pIndex >= words.length) { clearInterval(timer); finish(); } else markdown.appendChild(el('p'));
      }, 24);
    }, instant ? 0 : 400);
  }
  function ask(question, type) {
    var clean = cleanText(question);
    if (!clean || busy) { if (!clean) { status.textContent = '궁금한 내용을 입력해 주세요.'; setOpen(true); } return; }
    status.textContent = '';
    root.classList.add('has-messages'); setHistory(false); setOpen(true, false);
    var turn = { question: clean, type: type || '직접 질문', time: nowTime(), answerTime: nowTime(), response: responseFor(clean, type || '직접 질문') };
    field.value = ''; resizeField(); streamTurn(turn);
  }
  function newChat() { streamId += 1; busy = false; current = fresh(); log.replaceChildren(); root.classList.remove('has-messages', 'is-busy'); setHistory(false); field.disabled = false; field.value = ''; resizeField(); setOpen(true); requestAnimationFrame(fitSheet); }
  function loadConversation(item) { streamId += 1; busy = false; current = item; log.replaceChildren(); item.turns.forEach(renderInstant); root.classList.add('has-messages'); root.classList.remove('is-busy'); setHistory(false); field.disabled = false; resizeField(); setOpen(true, false); requestAnimationFrame(function () { fitSheet(); scrollBottom(false); }); }
  function renderHistory() {
    var items = historyData(); historyList.replaceChildren();
    if (!items.length) { historyList.appendChild(el('p', 'wsai-v8__history-empty', '아직 저장된 대화가 없어요.')); return; }
    items.forEach(function (item) {
      var row = el('div', 'wsai-v8__history-item');
      var open = el('button', 'wsai-v8__history-open'); open.type = 'button';
      open.appendChild(el('strong', '', item.title || '이전 대화'));
      open.appendChild(el('span', '', new Date(item.updated).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })));
      open.addEventListener('click', function () { loadConversation(item); });
      var remove = el('button', 'wsai-v8__history-remove'); remove.type = 'button'; remove.setAttribute('aria-label', '이 대화 삭제');
      remove.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
      remove.addEventListener('click', function (e) { e.stopPropagation(); removeHistory(item.id); });
      row.appendChild(open); row.appendChild(remove); historyList.appendChild(row);
    });
  }

  /* ── 이벤트 ── */
  field.addEventListener('focus', function () { if (!root.classList.contains('is-open')) setOpen(true, false); });
  field.addEventListener('input', resizeField);
  field.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); e.stopImmediatePropagation(); ask(field.value, '직접 질문'); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  }, true);
  function handleSubmit(e) { e.preventDefault(); e.stopImmediatePropagation(); ask(field.value, '직접 질문'); }
  form.addEventListener('submit', handleSubmit, true);
  send.addEventListener('click', handleSubmit, true);
  closeBtn.addEventListener('click', function () { setOpen(false); });
  Array.prototype.forEach.call(newButtons, function (b) { b.addEventListener('click', newChat); });
  historyButton.addEventListener('click', function () { setHistory(!root.classList.contains('is-history')); });
  historyClose.addEventListener('click', function () { setHistory(false); historyButton.focus(); });
  historyClear.addEventListener('click', function () { try { localStorage.removeItem(storageKey); } catch (e) {} renderHistory(); });
  root.querySelectorAll('[data-wsai-question]').forEach(function (b) { b.addEventListener('click', function () { ask(b.getAttribute('data-wsai-question') || b.textContent, b.getAttribute('data-wsai-type') || '기타'); }); });
  root.querySelector('.wsai-v8__sheet').addEventListener('click', function (e) {
    // 닫힌 알약의 빈 곳을 누르면 열린다
    if (!root.classList.contains('is-open') && !e.target.closest('button')) setOpen(true);
  });
  document.addEventListener('click', function (e) { if (root.classList.contains('is-open') && !root.contains(e.target)) setOpen(false); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false); }, true);

  /* 문의 페이지: 어시스턴트에서 넘어온 초안을 폼에 채운다 */
  if (location.pathname.replace(/\/+$/, '') === '/contact') {
    var draft = null; try { draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null'); sessionStorage.removeItem(draftKey); } catch (e) {}
    if (draft) {
      var contactForm = document.querySelector('.uw-inquiry-form');
      if (contactForm) {
        var messageField = contactForm.querySelector('[name="field_message"]'); var typeField = contactForm.querySelector('[name="field_inquiry_type"]');
        if (messageField && !messageField.value) { messageField.value = draft.message || ''; messageField.dispatchEvent(new Event('input', { bubbles: true })); }
        if (typeField && draft.type) { var matching = Array.prototype.find.call(typeField.options || [], function (o) { return o.value === draft.type || o.textContent.indexOf(draft.type) !== -1; }); if (matching) typeField.value = matching.value; }
        setTimeout(function () { var target = document.getElementById('inquiry') || contactForm; target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); if (messageField) messageField.focus({ preventScroll: true }); }, 120);
      }
    }
  }

  /* ── 굴절 유리: backdrop-filter에 SVG 변위를 쓰는 건 Chromium만 지원 ── */
  if (navigator.userAgentData && CSS.supports('backdrop-filter', 'blur(1px)')) root.classList.add('is-liquid');

  /* ── 오브 — 마스터 캔버스 하나를 그려 모든 오브(머리·환영·답변·입력창)에 복사한다 ──
     WebGL: 예전 무지개 오브(다섯 색 빛 덩어리) 안으로 빛나는 에너지 실선이 감아 돌고,
     둘레에서 가는 실과 입자가 옅게 흩날린다. 유리 광택(::after)은 CSS가 얹는다.
     WebGL이 없으면 아래 2D 빛 덩어리 오브로 그린다. 답변 중에는 회전·밝기·흩날림이 부드럽게 올라간다.
     탭 숨김·움직임 최소화에서는 멈춘다. */
  function glOrb(M) {
    var cv = document.createElement('canvas'); cv.width = cv.height = M;
    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return null;
    var VS = 'attribute vec2 a;varying vec2 v;void main(){v=a;gl_Position=vec4(a,0.,1.);}';
    var FS = [
      'precision mediump float;varying vec2 v;uniform float t;uniform float e;',
      'float h(vec3 p){p=fract(p*.3183+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
      'float n(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
      ' return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),',
      '  mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}',
      'float fb(vec3 p){return .55*n(p)+.3*n(p*2.1+3.1)+.15*n(p*4.3+7.7);}',
      'float h2(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      /* 구 위 한 점의 실선 밝기 — 물결치는 위도선 두 갈래가 엇갈린다 */
      'float strands(vec3 P,float T){',
      ' float c=cos(T),s=sin(T);P=vec3(c*P.x+s*P.z,P.y,-s*P.x+c*P.z);',
      ' float c2=cos(.45),s2=sin(.45);P=vec3(P.x,c2*P.y-s2*P.z,s2*P.y+c2*P.z);',
      ' float w=fb(P*1.7+vec3(0.,T*.35,0.));',
      ' float a=P.y*5.+w*4.6;float b=P.y*3.4-P.x*1.8+fb(P*2.3+vec3(5.,0.,T*.3))*5.;',
      ' float da=abs(sin(a*1.5708)),db=abs(sin(b*1.5708));',
      ' float la=exp(-da*11.)*.9+exp(-da*48.)*1.5,lb=(exp(-db*14.)*.7+exp(-db*60.)*1.2)*.85;',
      ' float cc=P.y*8.5+P.z*2.+fb(P*3.1+vec3(T*.4,2.,0.))*7.;float dc=abs(sin(cc*1.5708));',
      ' float lc=(exp(-dc*18.)*.45+exp(-dc*80.)*.9)*.75;',      /* 가는 잔실 — 촘촘함 */
      ' float grain=.6+.4*n(P*22.+T*2.);',
      ' return (la+lb+lc)*grain;}',
      'void main(){',
      ' vec2 p=v;float r=length(p);float R=.735;',                 /* 캔버스 136% → 구 지름 = 오브 크기 */
      ' float T=t*(.35+e*.65),T2=t*(.55+e*1.6);',
      /* ① 구 안 — 예전 무지개 오브: 다섯 색 빛 덩어리가 각자 궤도로 돌며 더해진다 */
      ' vec2 q=p/R;float rq=length(q);',
      ' vec3 c=mix(vec3(.11,.063,.31),vec3(.02,.016,.1),clamp(length(q-vec2(0.,.1)),0.,1.));',
      ' vec3 C[5];C[0]=vec3(.35,.86,1.);C[1]=vec3(.24,.43,1.);C[2]=vec3(.67,.31,1.);C[3]=vec3(1.,.24,.59);C[4]=vec3(1.,.55,.31);',
      ' vec4 B[5];B[0]=vec4(.3,.22,.53,.71);B[1]=vec4(.26,.3,.37,.47);B[2]=vec4(.32,.26,.61,.39);B[3]=vec4(.28,.32,.43,.67);B[4]=vec4(.22,.2,.77,.58);',
      ' float RR[5];RR[0]=.8;RR[1]=.92;RR[2]=.96;RR[3]=.8;RR[4]=.52;',
      ' for(int i=0;i<5;i++){float ph=float(i)*1.25;',
      '  vec2 o=vec2(sin(T2*B[i].z*2.+ph)*B[i].x,cos(T2*B[i].w*2.+ph*1.3)*B[i].y)*2.*(1.+e*.3);',
      '  float rr=RR[i]*(1.+sin(T2*1.3+ph)*.12);vec2 d=q-o;',
      '  c+=C[i]*exp(-dot(d,d)/(rr*rr*.32))*(.62+e*.2);}',
      /* ② 그 위로 에너지 실선 — 앞쪽은 밝게, 뒤쪽은 옅게, 둘레로 갈수록 진하게 */
      ' float z=sqrt(max(1.-rq*rq,0.));',
      ' float front=strands(vec3(q,z),T),back=strands(vec3(q,-z),T);',
      ' float rim=pow(1.-z,1.6);',
      ' c+=vec3(.86,.93,1.)*front*(.42+.75*rim)*.8+vec3(.8,.75,1.)*back*.16;',
      ' c+=vec3(.6,.78,1.)*rim*.22;',
      ' vec3 inner=1.-exp(-c*1.35);',
      ' float aIn=smoothstep(R+.008,R-.008,r);',
      /* ③ 구 밖 — 둘레 빛, 흩날리는 실, 입자 (오브를 크게 덮지 않게 옅게) */
      ' float ang=atan(p.y,p.x),out_=max(r-R,0.);',
      ' float ring=exp(-out_*40.)*(.35+.6*fb(vec3(ang*2.,T*.8,1.)));',
      ' float wisp=smoothstep(.5,.9,fb(vec3(ang*3.2,r*5.-T*1.6,T*.4)))*exp(-out_*(9.-e*3.));',
      ' vec2 g=vec2(ang*26.,(r-T*.12)*38.);vec2 ci=floor(g);float sh=h2(ci);',
      ' float spark=step(.94-e*.04,sh)*smoothstep(.45,0.,length(fract(g)-.5))*exp(-out_*8.);',
      ' vec3 oc=vec3(.55,.72,1.)*ring*.9+vec3(.62,.55,1.)*wisp*.9+vec3(.85,.92,1.)*spark;',
      ' float aOut=clamp(ring*.75+wisp*.7+spark,0.,1.)*smoothstep(1.,.82,r);',
      ' oc=1.-exp(-oc*1.5);',
      ' vec3 rgb=inner*aIn+oc*aOut*(1.-aIn);float al=aIn+aOut*(1.-aIn);',
      ' gl_FragColor=vec4(rgb,al);}'
    ].join('\n');
    function sh(type, src) { var x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); return gl.getShaderParameter(x, gl.COMPILE_STATUS) ? x : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uT = gl.getUniformLocation(pr, 't'), uE = gl.getUniformLocation(pr, 'e');
    gl.viewport(0, 0, M, M); gl.clearColor(0, 0, 0, 0);
    return { canvas: cv, draw: function (time, energy) { gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uT, time); gl.uniform1f(uE, energy); gl.drawArrays(gl.TRIANGLES, 0, 3); } };
  }
  function orbs() {
    var M = 160, master = document.createElement('canvas'); master.width = master.height = M;
    var webgl = glOrb(200);
    if (webgl) { master = webgl.canvas; M = 200; root.classList.add('has-gl-orb'); }
    var g = webgl ? null : master.getContext('2d'); if (!webgl && !g) return;
    var blobs = [
      { c: [90, 220, 255], r: .40, ax: .30, ay: .22, wx: .53, wy: .71, p: 0.0 },
      { c: [60, 110, 255],  r: .46, ax: .26, ay: .30, wx: .37, wy: .47, p: 1.7 },
      { c: [170, 80, 255], r: .48, ax: .32, ay: .26, wx: .61, wy: .39, p: 3.1 },
      { c: [255, 60, 150],  r: .40, ax: .28, ay: .32, wx: .43, wy: .67, p: 4.4 },
      { c: [255, 140, 80], r: .26, ax: .22, ay: .20, wx: .77, wy: .58, p: 5.6 }
    ];
    var energy = 0, t = 0, last = 0, running = false;
    function paint(dt) {
      var target = root.classList.contains('is-busy') ? 1 : 0;
      energy += (target - energy) * Math.min(1, dt * 3);
      if (webgl) { t += dt; webgl.draw(t + 7, energy); return; }
      t += dt * (0.55 + energy * 2.2);
      var R = M / 2, amp = 1 + energy * .35;
      g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, M, M);
      var base = g.createRadialGradient(R, R * 1.1, 0, R, R, R);
      base.addColorStop(0, '#1c1050'); base.addColorStop(1, '#05041a');
      g.fillStyle = base; g.fillRect(0, 0, M, M);
      g.globalCompositeOperation = 'lighter';
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var x = R + Math.sin(t * b.wx * 2 + b.p) * b.ax * M * amp;
        var y = R + Math.cos(t * b.wy * 2 + b.p * 1.3) * b.ay * M * amp;
        var rr = b.r * M * (1 + Math.sin(t * 1.3 + b.p) * .12);
        var gr = g.createRadialGradient(x, y, 0, x, y, rr);
        var a = .72 + energy * .2;
        gr.addColorStop(0, 'rgba(' + b.c + ',' + a + ')');
        gr.addColorStop(.5, 'rgba(' + b.c + ',' + (a * .28) + ')');
        gr.addColorStop(1, 'rgba(' + b.c + ',0)');
        g.fillStyle = gr; g.fillRect(0, 0, M, M);
      }
      /* 가운데 리본 — 천천히 도는 밝은 띠 */
      g.save(); g.translate(R, R); g.rotate(t * .6);
      var rib = g.createLinearGradient(-R, 0, R, 0);
      rib.addColorStop(0, 'rgba(255,255,255,0)'); rib.addColorStop(.5, 'rgba(255,255,255,' + (.12 + energy * .22) + ')'); rib.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rib; g.beginPath(); g.ellipse(0, 0, R * .95, R * .16, 0, 0, Math.PI * 2); g.fill(); g.restore();
      g.globalCompositeOperation = 'destination-in';
      g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();
    }
    function targets() {
      var list = [];
      root.querySelectorAll('.wsai-v8__orb').forEach(function (o) {
        var w = o.offsetWidth; if (!w) return;
        var cv = o.firstElementChild;
        if (!cv || cv.tagName !== 'CANVAS') { cv = document.createElement('canvas'); o.insertBefore(cv, o.firstChild); }
        // WebGL 구체는 흩날림까지 담으려고 캔버스를 오브보다 크게(136%) 그린다
        var px = Math.round(w * (webgl ? 1.36 : 1) * Math.min(2, window.devicePixelRatio || 1));
        if (cv.width !== px) { cv.width = cv.height = px; }
        list.push(cv);
      });
      return list;
    }
    function blit(list) { for (var i = 0; i < list.length; i++) { var c = list[i], x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height); x.drawImage(master, 0, 0, c.width, c.height); } }
    // 닫혀 있을 때는 입력창의 작은 오브만 보이므로 초당 20번으로 줄인다(모든 페이지에서 계속 돌아 GPU를 쓰던 부분)
    // 쉴 때(닫혀 있고 포인터도 없을 때)는 한 장면만 그리고 완전히 멈춘다 — 모든 페이지에 떠 있는 오브가 GPU를 계속 쓰지 않게
    var hovered = false;
    function want() { return hovered || root.classList.contains('is-open') || root.classList.contains('is-busy') || root.getAttribute('data-state') === 'open'; }
    function frame(now) {
      if (!running) return;
      if (!want()) { running = false; return; }
      requestAnimationFrame(frame);
      var open = root.classList.contains('is-open') || root.classList.contains('is-busy');
      if (!open && last && now - last < 33) return;
      var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
      paint(dt); blit(targets());
    }
    function start() { if (running || reduce.matches || document.hidden || !want()) return; running = true; last = 0; requestAnimationFrame(frame); }
    function stop() { running = false; }
    paint(.016); blit(targets());
    start();
    root.addEventListener('pointerenter', function () { hovered = true; start(); });
    root.addEventListener('pointerleave', function () { hovered = false; });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    reduce.addEventListener && reduce.addEventListener('change', function () { reduce.matches ? stop() : start(); });
    /* 열고 닫을 때 새로 보이는 오브를 즉시 그린다 */
    new MutationObserver(function () { if (want()) start(); else if (!running) { paint(.016); blit(targets()); } }).observe(root, { attributes: true, attributeFilter: ['class', 'data-state'], subtree: false });
  }
  // WebGL 생성·셰이더 컴파일은 첫 화면이 다 그려진 뒤 한가할 때 — 그때까지는 CSS 구슬이 보인다
  function idle(fn) { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 400); }
  if (document.readyState === 'complete') idle(orbs); else window.addEventListener('load', function () { idle(orbs); });
  renderHistory(); resizeField(); root.setAttribute('data-state', 'closed');
}());
