/* WEBSLAB_PHILOSOPHY_V1_20261105 — 메인 '웹스랩 철학' 섹션
   일렁이는 입자 그물 구체를 WebGL로 그린다: 표면이 노이즈로 부풀었다 꺼지고, 점으로 된 그물 위로 접힌 결이 밝게 흐른다.
   색은 웹스랩 파랑 → 하늘빛, 결의 꼭대기에 보라와 아주 약한 주황(예전 무지개 오브와 같은 계열).
   아래에는 받침대 고리 빛과 바닥 반사. 포인터 쪽으로 구체가 살짝 돈다.
   - 절반 해상도 + 픽셀 상한, 화면 밖·숨은 탭에서 멈춤, 움직임 줄이기: 한 장면만
   - WebGL이 없으면 CSS 빛(.ws-philo:not(.is-gl) .ws-philo__stage::before)이 대신한다 */
(function () {
  'use strict';
  var root = document.querySelector('.ws-philo');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── 나타나기 ── */
  var reveal = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    root.classList.add('has-reveal');
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(function (el) { ro.observe(el); });
  }

  var canvas = root.querySelector('.ws-philo__orb');
  if (!canvas || !window.WebGLRenderingContext) return;
  // 투명 캔버스 — 섹션 배경(CSS) 위에 빛만 더한다(캔버스 경계가 네모로 드러나지 않게)
  var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return;

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    'precision mediump float;',
    'uniform vec2 r;uniform vec2 c;uniform float R0;uniform float t;uniform vec2 m;',
    'float h(vec3 p){p=fract(p*.3183+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
    'float n(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
    ' return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),',
    '  mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}',
    'float fb(vec3 p){return .55*n(p)+.3*n(p*2.07+3.1)+.15*n(p*4.2+7.7);}',
    'float h2(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'vec3 rot(vec3 P,float ay,float ax){float c1=cos(ay),s1=sin(ay);P=vec3(c1*P.x+s1*P.z,P.y,-s1*P.x+c1*P.z);',
    ' float c2=cos(ax),s2=sin(ax);return vec3(P.x,c2*P.y-s2*P.z,s2*P.y+c2*P.z);}',
    /* 구 위 한 점의 빛: 점 그물 + 접힌 결 + 색 */
    'vec3 surf(vec3 P,float T,float front){',
    ' float w=fb(P*2.1+vec3(T*.7,0.,T*.4));',
    ' float th=atan(P.z,P.x),ph=acos(clamp(P.y,-1.,1.));',
    ' vec2 g=vec2(th*19.1,ph*19.1);',                               /* 점 그물(경위도 격자) */
    ' float dotv=smoothstep(.36,.0,length(fract(g)-.5));',
    ' float a=P.y*4.6+w*6.2;float fold=exp(-abs(sin(a*1.5708))*7.5);',  /* 접힌 결 */
    ' float b=P.x*3.2-P.y*2.+fb(P*3.3+vec3(0.,T*.5,2.))*5.;float fold2=exp(-abs(sin(b*1.5708))*12.)*.6;',
    ' float k=clamp(fold+fold2,0.,1.4);',
    ' vec3 deep=vec3(.07,.2,.86),cyan=vec3(.42,.84,1.),violet=vec3(.52,.36,1.),warm=vec3(1.,.52,.32);',
    ' vec3 col=mix(deep,cyan,clamp(k,0.,1.));',
    ' col=mix(col,violet,smoothstep(.54,.78,w)*.7);',
    ' col+=warm*smoothstep(.7,.88,w)*fold*.8;',
    ' float d=dotv*(.32+1.25*k)+k*.32;',
    ' return col*d*front;}',
    'void main(){',
    ' vec2 fc=gl_FragCoord.xy;vec2 uv=fc/r;',
    ' vec2 p=(fc-c)/R0;',                                          /* 구 반지름 = 1 */
    ' float T=t*.22;',
    ' float ay=T*.9+m.x*.5,ax=.35+m.y*.25;',
    /* 공간: 짙은 남색, 구 둘레 빛 */
    ' vec3 col=vec3(.03,.08,.24)*exp(-dot(p*vec2(.32,.5),p*vec2(.32,.5)));',
    ' float rr=length(p);',
    /* 일렁이는 반지름 — 보는 방향의 노이즈로 둘레가 부풀었다 꺼진다 */
    ' vec3 dir=rot(vec3(p/max(rr,1e-3),0.),ay,ax);',
    ' float Rw=1.+.16*(fb(dir*1.5+vec3(0.,T*1.1,0.))-.5)*2.;',
    ' if(rr<Rw){',
    '  vec2 q=p/Rw;float z=sqrt(max(1.-dot(q,q),0.));',
    '  vec3 F=rot(vec3(q,z),ay,ax),B=rot(vec3(q,-z),ay,ax);',
    '  float fres=pow(1.-z,2.);',
    '  col+=surf(F,T,1.)*(.75+1.3*fres)*1.25;',
    '  col+=surf(B,T,1.)*vec3(.55,.5,1.)*.28;',                   /* 뒤쪽 그물은 옅게 */
    '  col+=vec3(.05,.16,.6)*(.25+fres*.9);',
    ' }',
    ' float edge=abs(rr-Rw);',
    ' col+=vec3(.35,.6,1.)*exp(-edge*30.)*.55;',                    /* 둘레 빛 */
    ' col+=vec3(.12,.3,1.)*exp(-max(rr-Rw,0.)*3.)*.32*step(Rw,rr);',
    /* 받침대 — 구 아래 타원 고리와 바닥 반사 */
    ' float fy=-1.5;',
    ' vec2 e=vec2(p.x/1.2,(p.y-fy)/.2);float er=length(e);',
    ' col+=vec3(.3,.58,1.)*(exp(-abs(er-1.)*16.)*.75+exp(-abs(er-.66)*26.)*.35)*smoothstep(2.2,.0,abs(p.x));',
    ' col+=vec3(.2,.42,1.)*exp(-er*2.2)*.35;',
    ' if(p.y<fy){vec2 pr=vec2(p.x,2.*fy-p.y);col+=vec3(.12,.3,.9)*exp(-length(pr*vec2(1.,1.6))*1.6)*.28*smoothstep(fy-1.6,fy,p.y);}',
    /* 떠다니는 작은 입자 */
    ' vec2 g=fc/3.;vec2 ci=floor(g);float sh=h2(ci);',
    ' float sp=step(.996,sh)*smoothstep(.45,0.,length(fract(g)-.5))*(.5+.5*sin(t*(.8+sh*2.)+sh*30.));',
    ' col+=vec3(.6,.78,1.)*sp*.6*exp(-rr*.35);',
    ' col=1.-exp(-col*1.35);',
    ' col*=smoothstep(.0,.2,uv.x)*smoothstep(1.,.8,uv.x)*smoothstep(.0,.1,uv.y)*smoothstep(1.,.9,uv.y);',  /* 가장자리로 갈수록 사라지게 */
    ' col+=(h2(fc+t)-.5)/255.;',
    ' float al=clamp(max(col.r,max(col.g,col.b))*1.15,0.,1.);',
    ' gl_FragColor=vec4(col,al);',
    '}'
  ].join('\n');

  function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
  var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var U = {};
  ['r', 'c', 'R0', 't', 'm'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

  var w = 0, h = 0;
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var k = Math.min(window.devicePixelRatio || 1, 2) * .55;
    var nw = Math.max(1, Math.round(rect.width * k)), nh = Math.max(1, Math.round(rect.height * k));
    var cap = Math.sqrt(650000 / (nw * nh));
    if (cap < 1) { nw = Math.round(nw * cap); nh = Math.round(nh * cap); }
    if (nw === w && nh === h) return;
    w = nw; h = nh; canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.r, w, h);
    // 구 중심·크기: 넓은 무대는 가운데 조금 위, 좁은 화면은 캔버스 가운데
    var wide = rect.width > 1024;
    var R0 = Math.min(w, h) * (wide ? .24 : .27);
    gl.uniform2f(U.c, w * .5, h * (wide ? .58 : .56));
    gl.uniform1f(U.R0, R0);
  }

  var mx = 0, my = 0, tx = 0, ty = 0;
  root.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    tx = ((e.clientX - rect.left) / rect.width - .5) * 2;
    ty = ((e.clientY - rect.top) / rect.height - .5) * 2;
  }, { passive: true });
  root.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

  var start = performance.now(), raf = 0, visible = false, shown = false;
  function draw(now) {
    resize();
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    gl.uniform2f(U.m, mx, my);
    gl.uniform1f(U.t, (now - start) / 1000 + 12);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!shown) { shown = true; root.classList.add('is-gl'); }
  }
  function loop(now) {
    draw(now);
    raf = visible && !document.hidden && !reduce.matches ? requestAnimationFrame(loop) : 0;
  }
  function kick() {
    if (reduce.matches) { draw(start + 4000); return; }
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick(); }, { rootMargin: '120px' }).observe(canvas);
  } else { visible = true; kick(); }
  document.addEventListener('visibilitychange', kick);
  if (reduce.addEventListener) reduce.addEventListener('change', kick);
  window.addEventListener('resize', function () { if (!raf) { w = 0; draw(performance.now()); } }, { passive: true });
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); root.classList.remove('is-gl'); cancelAnimationFrame(raf); raf = 0; });
}());
