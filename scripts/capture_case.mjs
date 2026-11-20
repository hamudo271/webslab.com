// 제작 사례용 화면 캡처 — 헤드리스 크롬(Playwright가 받아 둔 chrome-headless-shell)을 CDP로 직접 조종한다.
// 사용: node scripts/capture_case.mjs <slug> <url> [scroll]
//   결과: ./shots/<slug>-{pc,mo,full}.png  (scroll을 주면 full 대신 tile-NN-<y>.png — 스크롤 연출 사이트용)
//   다음: python3 scripts/build_case_images.py <slug> <도메인>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const [slug, url] = process.argv.slice(2);
if (!slug || !url) { console.error('사용: node scripts/capture_case.mjs <slug> <url> [scroll]'); process.exit(1); }
fs.mkdirSync('shots', { recursive: true });
// 크롬 위치: CHROME_HEADLESS_SHELL 환경변수 또는 Playwright 캐시의 최신 chrome-headless-shell
const cache = process.env.HOME + '/Library/Caches/ms-playwright';
const found = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().pop() : null;
const BIN = process.env.CHROME_HEADLESS_SHELL || (found && `${cache}/${found}/chrome-headless-shell-mac-arm64/chrome-headless-shell`);
if (!BIN || !fs.existsSync(BIN)) { console.error('chrome-headless-shell을 찾지 못했습니다. npx playwright install chromium-headless-shell 후 다시 실행하세요.'); process.exit(1); }
const PORT = 9300 + Math.floor(Math.random() * 500);
const extra = /Google Chrome|Chromium$/.test(BIN) ? ['--headless=new'] : [];
const proc = spawn(BIN, [...extra, '--autoplay-policy=no-user-gesture-required', '--mute-audio', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', '--no-first-run', `--user-data-dir=/tmp/cap-${PORT}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
async function connect() {
  for (let i = 0; i < 50; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = list.find((t) => t.type === 'page'); if (page) return page.webSocketDebuggerUrl; } catch {}
    await sleep(200);
  }
  throw new Error('no devtools');
}
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
async function shot({ name, width, height, mobile, maxHeight }) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: !!mobile });
  if (mobile) {
    await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  } else {
    await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
    await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  }
  await send('Page.navigate', { url });
  await sleep(6000);
  const ev = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }).then((r) => r.result.value);
  // 화면 높이(vh)는 실제 기기처럼 두고, 그 아래까지 이어서 찍는다(100vh 히어로가 늘어나지 않게)
  await ev(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));const max=${maxHeight};for(let y=0;y<Math.min(document.documentElement.scrollHeight,max);y+=300){window.scrollTo(0,y);await s(220);}window.scrollTo(0,0);await s(1800);})()`);
  const pageH = await ev('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');
  const clipH = Math.min(pageH, maxHeight);
  const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height: clipH, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(`shots/${slug}-${name}.png`, Buffer.from(data, 'base64'));
  console.log(slug, name, width, clipH);
}
// 스크롤 연출이 있는 사이트용: 실제로 스크롤하며 화면 단위로 찍는다(이어 붙이기는 파이썬에서)
async function tiles({ width, height, maxHeight, positions }) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: false });
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Page.navigate', { url });
  await sleep(7000);
  const ev = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }).then((r) => r.result.value);
  // 영상: 조작 막대는 숨기고, 장면 전환 중간(겹친 화면)이 찍히지 않게 같은 시점(1.5초)에 멈춰 둔다
  const freeze = `(()=>{if(!document.getElementById('__cap')){const st=document.createElement('style');st.id='__cap';st.textContent='video::-webkit-media-controls{display:none!important}';document.head.appendChild(st);}document.querySelectorAll('video').forEach(v=>{v.muted=true;v.removeAttribute('controls');v.autoplay=false;try{v.pause();if(Math.abs(v.currentTime-1.5)>0.05)v.currentTime=1.5;}catch(e){}});})()`;
  await ev(freeze);
  const pageH = await ev('Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)');
  let n = 0;
  // 찍을 위치: 기본은 화면 높이 간격. 섹션 경계에 맞추려면 위치를 직접 준다(argv[6] = 0,2700,5960 …)
  const ys = positions ?? Array.from({ length: Math.ceil(Math.min(pageH - height + 1, maxHeight) / height) }, (_, i) => i * height);
  for (const y of ys) {
    // 사람이 내리듯 조금씩 내려가 등장 효과·영상을 깨우고, 멈춘 뒤 충분히 기다린다
    await ev(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));const from=window.scrollY;for(let i=1;i<=18;i++){window.scrollTo(0,from+(${y}-from)*i/18);await s(80);}await s(2600);})()`);
    // 둘째 화면부터는 떠 있는 요소(헤더·빠른 메뉴·상담 버튼)를 숨긴다 — 화면을 덮는 고정 배경은 남긴다
    if (y > 0) await ev(`document.querySelectorAll('body *').forEach(e=>{const p=getComputedStyle(e).position;const r=e.getBoundingClientRect();if(p==='fixed'&&r.width*r.height<innerWidth*innerHeight*0.35)e.style.visibility='hidden'})`);
    await ev(freeze);
    await sleep(500);
    const real = await ev('Math.round(window.scrollY)');
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`shots/${slug}-tile-${String(n).padStart(2, '0')}-${real}.png`, Buffer.from(data, 'base64'));
    n++;
  }
  console.log(slug, 'tiles', n, 'pageH', pageH);
}
try {
  ws = new WebSocket(await connect());
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } };
  await send('Page.enable');
  const mode = process.argv[4];
  if (mode === 'tiles') {
    // 긴 화면만 다시: 화면 단위로 끝까지(최대 argv[5]px) 찍어 두고, 쓸 화면은 build_case_images.py에서 고른다
    await tiles({ width: 1440, height: 900, maxHeight: Number(process.argv[5] || 9000), positions: process.argv[6] ? process.argv[6].split(',').map(Number) : null });
  } else if (mode === 'scroll') {
    await shot({ name: 'pc', width: 1440, height: 1530, maxHeight: 1530 });
    await shot({ name: 'mo', width: 390, height: 1435, mobile: true, maxHeight: 1435 });
    await tiles({ width: 1440, height: 900, maxHeight: 5400 });
  } else {
    await shot({ name: 'pc', width: 1440, height: 900, maxHeight: 1530 });
    await shot({ name: 'mo', width: 390, height: 844, mobile: true, maxHeight: 1435 });
    await shot({ name: 'full', width: 1440, height: 900, maxHeight: 5200 });
  }
} finally { proc.kill(); }
