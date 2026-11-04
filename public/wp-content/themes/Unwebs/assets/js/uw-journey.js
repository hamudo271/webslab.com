/**
 * uw-journey.js — 방문자 경로 기록 (first-party · localStorage · 서버 요청 없음)
 *
 * 매 페이지뷰를 브라우저 localStorage('uwj')에 세션 단위로 쌓아두고, 문의 접수 시
 * uw-inquiry.js가 window.uwJourney.snapshot()을 uw_journey 필드로 함께 전송한다.
 * → 서버는 접수된 문의에만 저장(_uw_inquiry_journey) → 관리자 문의 상세 '방문자 경로 분석'.
 *
 * 세션 구분: 30분 무활동 · 외부 유입(referrer 타 도메인) · 캠페인 파라미터(utm/gclid/n_*) 진입.
 * 보관량: 최근 8세션 × 40페이지. 첫 방문 정보(fs/fl/fr/fq)는 세션이 밀려도 별도 보존.
 * 한계: 검색엔진 organic은 검색어를 referrer에 안 넘김(네이버·구글 광고 n_query/utm_term만 가능).
 *       Safari ITP는 script 저장소를 7일 무방문 시 지움 → 장기 재방문 이력은 일부 누락 가능.
 */
(function () {
  'use strict';
  var KEY = 'uwj', VER = 1, GAP = 30 * 60 * 1000, MAX_S = 8, MAX_P = 40;
  var PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'gad_source', 'gad_campaignid', 'dclid', 'fbclid', 'msclkid',
    'n_media', 'n_query', 'n_keyword', 'n_campaign', 'n_ad_group', 'n_rank', 'n_match', 'keyword', 'matchtype', 'adgroup', 'network', 'device'];

  function dec(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }
  function load() { try { var j = JSON.parse(localStorage.getItem(KEY) || 'null'); return (j && j.v === VER && j.s && j.s.length) ? j : null; } catch (e) { return null; } }
  function save(j) { try { localStorage.setItem(KEY, JSON.stringify(j)); } catch (e) { /* quota·private mode — 이번 페이지 메모리만 유지 */ } }
  function cookie(name) { var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)')); return m ? dec(m[1]) : ''; }
  function params() {
    var out = {}, sp;
    try { sp = new URLSearchParams(location.search); } catch (e) { return out; }
    PARAMS.forEach(function (k) { var v = sp.get(k); if (v) { out[k] = String(v).slice(0, 120); } });
    return out;
  }
  function hasKeys(o) { for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) { return true; } } return false; }
  function isExternal(ref) { if (!ref) { return false; } try { return new URL(ref).host !== location.host; } catch (e) { return false; } }
  function title() {
    if (location.pathname === '/') { return '홈'; }   // 홈 타이틀은 브랜드가 앞에 와서(언웹스 | 기업 홈페이지제작…) 별도 처리
    var t = document.title || '';
    var i = t.search(/\s[|\-–—]\s(홈페이지제작전문\s*[|\-–—]\s*)?언웹스\s*$/);   // 뒤쪽 브랜드 꼬리('| 홈페이지제작전문 | 언웹스')만 제거
    if (i > 0) { t = t.slice(0, i); }
    return t.trim().slice(0, 60);
  }
  function path() { return (dec(location.pathname) + (location.search ? dec(location.search) : '')).slice(0, 300); }
  function gaId() { var m = cookie('_ga').match(/^GA1\.\d\.(\d+\.\d+)$/); return m ? m[1] : ''; }
  function gclCookie() { var m = cookie('_gcl_aw').match(/^GCL\.\d+\.(.+)$/); return m ? m[1].slice(0, 120) : ''; }

  var now = Date.now(), ref = document.referrer || '', q = params();
  var j = load() || { v: VER, fs: now, fl: path(), fr: ref.slice(0, 300), fq: q, la: 0, s: [] };
  var cur = j.s[j.s.length - 1];
  if (!cur || (now - j.la > GAP) || isExternal(ref) || hasKeys(q)) {
    cur = { t: now, l: path(), r: isExternal(ref) ? ref.slice(0, 300) : '', q: q, p: [] };
    j.s.push(cur);
    if (j.s.length > MAX_S) { j.s.splice(0, j.s.length - MAX_S); }
  }
  var page = [path(), title(), now, 0];   // [경로, 제목, 시각(ms), 체류(초)]
  cur.p.push(page);
  if (cur.p.length > MAX_P) { cur.p.splice(0, cur.p.length - MAX_P); }
  j.la = now;
  save(j);

  function touch() { var t = Date.now(); page[3] = Math.round((t - now) / 1000); j.la = t; save(j); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { touch(); } });
  window.addEventListener('pagehide', touch);
  setInterval(function () { if (document.visibilityState === 'visible') { touch(); } }, 15000);   // 강제종료 대비 체류시간 보정

  window.uwJourney = {
    snapshot: function () {
      touch();
      var o = {};
      for (var k in j) { if (Object.prototype.hasOwnProperty.call(j, k)) { o[k] = j[k]; } }
      o.ga = gaId(); o.gcl = gclCookie(); o.sw = (window.screen && screen.width) || 0;
      return JSON.stringify(o);
    }
  };
})();
