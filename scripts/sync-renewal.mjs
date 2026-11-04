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
