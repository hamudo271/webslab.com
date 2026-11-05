#!/usr/bin/env node
// 리뉴얼본(정적 HTML 작업 폴더) → 레포 동기화.
//
//   node scripts/sync-renewal.mjs [작업폴더]   (기본: ./웹스랩 리뉴얼본)
//
// - 페이지: <폴더>/**/index.html → src/site/pages/<이름>.html
//   ('/' → home, '/about' → about, '/portfolio/roland-korea' → portfolio--roland-korea)
//   서빙 시 src/lib/site-html.ts가 운영용으로 변환한다(검색 차단 해제, 분석·인증 태그, 폼 연결 등).
// - 에셋: assets/ · wp-content/ · wp-includes/ → public/ 아래 같은 경로 (기존 것은 지우고 새로 복사)
// - 작업용 폴더(_backup, .impeccable, .claude)와 미리보기 전용 파일(robots.txt, _headers)은 제외
// - 어느 페이지·CSS·JS도 참조하지 않는 에셋과 EXCLUDE 목록은 public에 남기지 않는다(URL로도 노출 X)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(decodeURIComponent(new URL(import.meta.url).pathname)), '..');
const SRC = path.resolve(ROOT, process.argv[2] ?? '웹스랩 리뉴얼본');
const PAGES_OUT = path.join(ROOT, 'src/site/pages');
const ASSET_DIRS = ['assets', 'wp-content', 'wp-includes'];
const SKIP = new Set(['_backup', '.impeccable', '.claude', 'node_modules', '.DS_Store']);
// 테마 원본에 딸려 온 언웹스 자체 자료(OG 이미지·제작사례 이미지) — 웹스랩 작업물이 아니라 공개하지 않는다.
// 페이지 쪽 참조는 src/lib/site-html.ts가 걷어낸다.
const EXCLUDE = [
  'wp-content/uploads/2026/04/ogimage.png',
  'wp-content/themes/Unwebs/assets/images/main/projects',
];

if (!fs.existsSync(path.join(SRC, 'index.html'))) {
  console.error(`[sync] ${SRC} 에 index.html이 없습니다.`);
  process.exit(1);
}

function pageFiles(dir, rel = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name) || ASSET_DIRS.includes(ent.name)) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...pageFiles(abs, rel ? `${rel}/${ent.name}` : ent.name));
    else if (ent.name === 'index.html') out.push({ abs, route: `/${rel}` });
  }
  return out;
}

const pageName = (route) => (route === '/' ? 'home' : route.slice(1).replaceAll('/', '--'));

fs.rmSync(PAGES_OUT, { recursive: true, force: true });
fs.mkdirSync(PAGES_OUT, { recursive: true });
const pages = pageFiles(SRC).sort((a, b) => a.route.localeCompare(b.route));
for (const p of pages) {
  fs.copyFileSync(p.abs, path.join(PAGES_OUT, `${pageName(p.route)}.html`));
}
console.log(`[sync] 페이지 ${pages.length}개 → src/site/pages`);
for (const p of pages) console.log(`        ${p.route.padEnd(32)} ${pageName(p.route)}.html`);

for (const dir of ASSET_DIRS) {
  const from = path.join(SRC, dir);
  const to = path.join(ROOT, 'public', dir);
  fs.rmSync(to, { recursive: true, force: true });
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, to, {
    recursive: true,
    filter: (src) => !SKIP.has(path.basename(src)),
  });
}
for (const rel of EXCLUDE) fs.rmSync(path.join(ROOT, 'public', rel), { recursive: true, force: true });

// CSS 묶기 — 페이지마다 head의 로컬 스타일시트(테마 + 리뉴얼 레이어 20~30개)를 순서대로 하나로 합친다.
// 파일마다 따로 요청해 첫 화면을 막던 것(Lighthouse 렌더 차단 8초+)을 요청 하나로. 파일 이름은 내용 해시라
// 내용이 바뀌면 자동으로 새로 받는다(정적 파일은 30일 캐시). CSS 안의 상대 url()은 원래 파일 기준 절대 경로로 바꾼다.
// 원본 작업 폴더는 건드리지 않고, 복사본(src/site/pages)의 link만 바꾼다.
const BUNDLE_DIR = path.join(ROOT, 'public/assets/bundle');
fs.mkdirSync(BUNDLE_DIR, { recursive: true });
const LOCAL_CSS = /<link\b(?=[^>]*\brel=["']stylesheet["'])(?![^>]*\bmedia=["']print["'])[^>]*\bhref=["'](\/(?!\/)[^"']+\.css(?:\?[^"']*)?)["'][^>]*>\s*/g;
function absolutizeCss(css, cssPath) {
  const dir = path.posix.dirname(cssPath);
  return css
    .replace(/@charset[^;]+;/gi, '')
    .replace(/url\(\s*(['"]?)(?!data:|https?:|\/|#)([^'")]+)\1\s*\)/g, (_m, q, rel) => `url(${q}${path.posix.normalize(path.posix.join(dir, rel))}${q})`);
}
// 모든 페이지가 같은 순서로 앞에 두는 테마 CSS는 '공통 묶음' 하나로(한 번 받으면 다른 페이지에서 캐시),
// 그 뒤의 페이지별 CSS는 '페이지 묶음'으로. 순서는 원래 link 순서 그대로다.
const sheets = fs.readdirSync(PAGES_OUT).flatMap((file) => {
  const abs = path.join(PAGES_OUT, file);
  const page = fs.readFileSync(abs, 'utf8');
  const headEnd = page.indexOf('</head>');
  if (headEnd < 0) return [];
  const head = page.slice(0, headEnd);
  // <noscript> 안의 링크는 대체용이라 그대로 둔다
  const noscript = [...head.matchAll(/<noscript>[\s\S]*?<\/noscript>/g)].map((m) => [m.index, m.index + m[0].length]);
  const links = [...head.matchAll(LOCAL_CSS)].filter((m) => !noscript.some(([a, b]) => m.index >= a && m.index < b));
  return links.length ? [{ file, abs, page, headEnd, head, links, hrefs: links.map((m) => m[1].split('?')[0]) }] : [];
});
let common = sheets.length ? sheets[0].hrefs.length : 0;
for (const sh of sheets) {
  let i = 0;
  while (i < common && i < sh.hrefs.length && sh.hrefs[i] === sheets[0].hrefs[i]) i++;
  common = i;
}
let bundles = 0;
function bundle(hrefs, label) {
  const css = hrefs
    .map((href) => {
      const src = path.join(SRC, href);
      if (!fs.existsSync(src)) throw new Error(`[sync] ${label}: CSS 원본이 없습니다 ${href}`);
      return `/* ${href} */\n` + absolutizeCss(fs.readFileSync(src, 'utf8'), href);
    })
    .join('\n');
  const name = `${crypto.createHash('md5').update(css).digest('hex').slice(0, 12)}.css`;
  const out = path.join(BUNDLE_DIR, name);
  if (!fs.existsSync(out)) { fs.writeFileSync(out, css); bundles++; }
  return `<link rel="stylesheet" href="/assets/bundle/${name}">\n`;
}
const coreTag = common > 1 ? bundle(sheets[0].hrefs.slice(0, common), 'core') : '';
for (const sh of sheets) {
  const core = coreTag ? common : 0;
  const rest = sh.hrefs.slice(core);
  const tags = coreTag + (rest.length ? bundle(rest, sh.file) : '');
  let next = sh.head, first = true;
  for (const m of sh.links) { next = next.replace(m[0], first ? tags : ''); first = false; }
  fs.writeFileSync(sh.abs, next + sh.page.slice(sh.headEnd));
}
console.log(`[sync] CSS 묶음 ${bundles}개 → public/assets/bundle`);

// 참조 검사: 페이지 HTML + 에셋 CSS/JS 전체에서 경로(또는 CSS 상대경로 꼬리)가 한 번도 안 나오면 제거
const assetFiles = ASSET_DIRS.flatMap((d) => walk(path.join(ROOT, 'public', d)));
const haystack = [
  ...fs.readdirSync(PAGES_OUT).map((f) => path.join(PAGES_OUT, f)),
  ...assetFiles.filter((f) => /\.(css|js)$/.test(f)),
]
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');
let pruned = 0;
for (const abs of assetFiles) {
  const rel = '/' + path.relative(path.join(ROOT, 'public'), abs).split(path.sep).join('/');
  const tail = rel.match(/\/assets\/(.*)$/)?.[1];
  const keys = [rel, tail, rel.split('/').slice(-2).join('/')].filter(Boolean);
  if (!keys.some((k) => haystack.includes(k))) {
    fs.rmSync(abs);
    pruned++;
  }
}
for (const dir of ASSET_DIRS) removeEmptyDirs(path.join(ROOT, 'public', dir));
const kept = ASSET_DIRS.flatMap((d) => walk(path.join(ROOT, 'public', d))).length;
console.log(`[sync] 에셋 ${kept}개 → public/{${ASSET_DIRS.join(',')}} (미참조·제외 ${pruned}개 정리)`);

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) removeEmptyDirs(path.join(dir, ent.name));
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((ent) => {
    const abs = path.join(dir, ent.name);
    return ent.isDirectory() ? walk(abs) : [abs];
  });
}
