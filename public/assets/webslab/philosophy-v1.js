/* WEBSLAB_PHILOSOPHY_V1_20261105 — 메인 '웹스랩 철학' 섹션 배경
   홀로그램 공간 속 디지털 지구를 WebGL로 그린다.
   - 지구: 실제 육지(earth-land.png — Natural Earth 1:110m, 퍼블릭 도메인)를 점으로 찍은 대륙 + 빛나는 해안선,
     옅은 경위선, 반대편 대륙이 비치는 홀로그램 투명감, 둘레 대기 빛. 천천히 자전하고 포인터 쪽으로 살짝 돈다.
     서울 자리에는 작은 신호가 퍼진다.
   - 공간: 지구 뒤로 흐릿한 HUD 패널들과 받침대 고리 빛(웹스랩 파랑·하늘빛).
   - 절반 해상도 + 픽셀 상한, 화면 밖·숨은 탭에서 멈춤, 움직임 줄이기: 한 장면만, WebGL 없으면 CSS 빛 */
(function () {
  'use strict';
  var root = document.querySelector('.ws-philo');
  if (!root) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── 나타나기 — 섹션이 보이면 글자가 순서대로 ── */
  if ('IntersectionObserver' in window && !reduce.matches) {
    root.classList.add('has-reveal');
    var ro = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { root.classList.add('is-in'); ro.disconnect(); }
    }, { threshold: .25 });
    ro.observe(root);
  }

  var canvas = root.querySelector('.ws-philo__bg');
  if (!canvas || !window.WebGLRenderingContext) return;
  var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return;

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    /* 점 배치는 큰 정수 인덱스를 다뤄 highp가 필요하다 — 없는 기기는 위도 줄 방식으로 대체 */
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#define SF 1',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 r;uniform vec2 c;uniform float R;uniform float t;uniform vec2 m;uniform sampler2D land;',
    'const float PI=3.14159265;',
    /* 구면 피보나치 점 — 구 전체에 점 N개를 완전히 고르게 깔고, 한 방향에서 가장 가까운 점까지 거리를 O(1)로 구한다
       (Keinert 외, "Spherical Fibonacci Mapping", 2015). 위도 줄 방식과 달리 극지방에 동심원 무늬가 생기지 않는다 */
    '#ifdef SF',
    'const float PHI=1.61803399;',
    'float mf(float a,float b){return a*b-floor(a*b);}',
    'float sfDist(vec3 p,float n){',
    ' float phi=min(atan(p.y,p.x),PI),ct=p.z;',
    ' float k=max(2.,floor(log(n*PI*sqrt(5.)*(1.-ct*ct))/log(PHI*PHI)));',
    ' float Fk=pow(PHI,k)/sqrt(5.);vec2 F=vec2(floor(Fk+.5),floor(Fk*PHI+.5));',
    ' vec2 ka=2.*F/n;vec2 kb=2.*PI*(fract((F+1.)*PHI)-(PHI-1.));',
    ' mat2 iB=mat2(ka.y,-ka.x,kb.y,-kb.x)/(ka.y*kb.x-ka.x*kb.y);',
    ' vec2 cc=floor(iB*vec2(phi,ct-(1.-1./n)));float d=8.;',
    ' for(int s=0;s<4;s++){vec2 o=vec2(mod(float(s),2.),floor(float(s)/2.));',
    '  float i=clamp(dot(F,o+cc),0.,n-1.);float ph=2.*PI*mf(i,PHI-1.);float c2=1.-(2.*i+1.)/n;float s2=sqrt(max(1.-c2*c2,0.));',
    '  vec3 q=vec3(cos(ph)*s2,sin(ph)*s2,c2);d=min(d,dot(q-p,q-p));}',
    ' return sqrt(d);}',
    '#endif',
    'float h2(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float box(vec2 p,vec2 b,float rd){vec2 q=abs(p)-b+rd;return length(max(q,0.))+min(max(q.x,q.y),0.)-rd;}',
    /* 흐릿한 HUD 패널 한 장: 테두리 빛 + 옅은 면 + 안쪽 줄 */
    'float panel(vec2 p,vec2 o,vec2 s,float seed){vec2 q=p-o;float d=box(q,s,.05);',
    ' float edge=exp(-abs(d)*38.)*.55,fill=smoothstep(.02,-.02,d)*.07;',
    ' float rows=smoothstep(.02,-.02,d)*smoothstep(.35,.0,abs(fract(q.y/s.y*3.2+seed)-.5))*step(h2(vec2(floor(q.y/s.y*3.2+seed),seed)),.7)*.06;',
    ' return edge+fill+rows;}',
    'vec3 tilt(vec3 v,float a){float c1=cos(a),s1=sin(a);return vec3(v.x,c1*v.y-s1*v.z,s1*v.y+c1*v.z);}',
    'vec2 lonlat(vec3 n,float spin){return vec2(fract((atan(n.x,n.z)+spin)/(2.*PI)+.5),.5-asin(clamp(n.y,-1.,1.))/PI);}',
    'void main(){',
    ' vec2 fc=gl_FragCoord.xy;vec2 uv=fc/r;',
    ' vec2 p=(fc-c)/R;',                                             /* 지구 반지름 = 1 */
    ' vec3 col=mix(vec3(.01,.016,.04),vec3(.018,.035,.08),smoothstep(-1.6,1.4,p.y));',
    /* 뒤 벽의 가로 빛띠 — 홀로그램 공간 */
    ' col+=vec3(.05,.12,.3)*exp(-pow((p.y-.95)*3.,2.))*.25+vec3(.04,.1,.26)*exp(-pow((p.y+1.)*4.,2.))*.25;',
    /* HUD 패널 — 지구 양옆 뒤에 흐릿하게 */
    ' float hud=panel(p,vec2(-1.95,.55),vec2(.5,.34),.3)+panel(p,vec2(-2.15,-.42),vec2(.42,.3),1.7)+panel(p,vec2(-1.35,1.25),vec2(.36,.2),2.9)',
    '  +panel(p,vec2(1.95,.62),vec2(.46,.32),4.1)+panel(p,vec2(2.2,-.35),vec2(.5,.36),5.3)+panel(p,vec2(1.4,-1.18),vec2(.34,.2),6.6);',
    ' if(r.x>r.y)hud*=mix(.25,1.,smoothstep(.3,.56,uv.x));',            /* 넓은 화면: 글자 쪽 패널은 더 흐리게 */
    ' col+=vec3(.42,.72,1.)*hud*.55;',
    /* 받침대 — 지구 아래 타원 고리 */
    ' float fy=-1.22;vec2 e=vec2(p.x/1.15,(p.y-fy)/.17);float er=length(e);',
    ' col+=vec3(.32,.6,1.)*(exp(-abs(er-1.)*16.)*.5+exp(-abs(er-.7)*24.)*.25)*smoothstep(2.,.0,abs(p.x));',
    ' col+=vec3(.15,.35,.9)*exp(-er*2.)*.22;',
    ' float rr=length(p);',
    ' float spin=t*.07+m.x*.35,ta=.42+m.y*.12;',
    ' if(rr<1.){',
    '  float z=sqrt(1.-rr*rr);',
    '  vec3 n=tilt(vec3(p,z),ta),nb=tilt(vec3(p,-z),ta);',
    '  vec2 tu=lonlat(n,spin),tb=lonlat(nb,spin);',
    '  float L=texture2D(land,tu).r,Lb=texture2D(land,tb).r;',
    '  float coast=pow(clamp(4.*L*(1.-L),0.,1.),.7);',             /* 해안선 — 마스크 가장자리 */
    /* 점 대륙 — 구면 피보나치(highp) 또는 위도 줄 방식(대체) */
    '#ifdef SF',
    '  float lo=(tu.x-.5)*2.*PI,la=(.5-tu.y)*PI;',                     /* 지구에 붙은 방향(자전과 함께 돈다) */
    '  vec3 ef=vec3(cos(la)*sin(lo),cos(la)*cos(lo),sin(la));',
    '  float dotv=smoothstep(.0105,.0045,sfDist(ef,24000.));',          /* 점 2만 4천 개 ≈ 1.3도 간격 — 화면 해상도에서 줄무늬 없이 또렷하게 */
    '#else',
    '  float rowf=tu.y*180.,row=floor(rowf);float latc=(.5-(row+.5)/180.)*PI;',
    '  float nd=max(floor(360.*cos(latc)),1.);',
    '  vec2 cell=vec2(fract(tu.x*nd)-.5,fract(rowf)-.5);float dotv=smoothstep(.45,.05,length(cell));',
    '#endif',
    '  vec2 gr=abs(fract(vec2(tu.x*24.,tu.y*12.)+.5)-.5);float grid=max(exp(-gr.x*90.),exp(-gr.y*90.));',
    '  float fres=pow(1.-z,2.2);',
    '  vec3 ocean=vec3(.02,.075,.22)*(.55+.9*fres);',
    '  float lit=.6+.55*max(dot(vec3(p,z),normalize(vec3(-.55,.45,.7))),0.);',
    '  vec3 land_=vec3(.36,.72,1.)*(smoothstep(.5,.9,L)*dotv*1.25+L*.16)+vec3(.7,.9,1.)*coast*.95;',
    '  col=mix(col,ocean,.92)+land_*lit*(.75+.55*fres)+vec3(.25,.5,1.)*grid*.1*(1.-L)+vec3(.25,.5,1.)*Lb*.07;',
    '  col+=vec3(.3,.6,1.)*fres*.35;',
    /* 서울(37.57N, 126.98E) 신호 */
    '  float slat=37.57/180.*PI,slon=126.98/180.*PI-spin;',
    '  vec3 sp=vec3(cos(slat)*sin(slon),sin(slat),cos(slat)*cos(slon));',
    '  float c1=cos(-ta),s1=sin(-ta);sp=vec3(sp.x,c1*sp.y-s1*sp.z,s1*sp.y+c1*sp.z);',
    '  if(sp.z>0.){float ds=length(p-sp.xy);float pulse=fract(t*.45);',
    '   col+=vec3(.75,.92,1.)*(exp(-ds*90.)*1.1+exp(-abs(ds-pulse*.16)*120.)*(1.-pulse)*.7)*smoothstep(0.,.3,sp.z);}',
    ' }',
    /* 대기 빛 */
    ' col+=vec3(.25,.55,1.)*exp(-abs(rr-1.)*22.)*.55+vec3(.1,.32,.95)*exp(-max(rr-1.,0.)*3.2)*.3*step(1.,rr);',
    /* 떠다니는 먼지 입자 */
    ' vec2 q=fc/3.;float sh=h2(floor(q));',
    ' col+=vec3(.6,.78,1.)*step(.997,sh)*smoothstep(.45,0.,length(fract(q)-.5))*(.4+.4*sin(t*(.6+sh*2.)+sh*30.));',
    ' col=1.-exp(-col*1.3);',
    ' col*=1.-.3*pow(length(uv-vec2(.6,.5))*1.1,2.);',
    ' col+=(h2(fc+t)-.5)/255.;',
    ' gl_FragColor=vec4(col,1.);',
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
  ['r', 'c', 'R', 't', 'm', 'land'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

  /* 육지 마스크 — 받기 전에는 바다만 그린다 */
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([0]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(U.land, 0);
  var img = new Image();
  img.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
    if (!raf) draw(performance.now());
  };
  img.src = '/assets/webslab/earth-land.png?v=20261105-1';

  var w = 0, h = 0;
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var k = Math.min(window.devicePixelRatio || 1, 2) * .55;
    var nw = Math.max(1, Math.round(rect.width * k)), nh = Math.max(1, Math.round(rect.height * k));
    var cap = Math.sqrt(700000 / (nw * nh));
    if (cap < 1) { nw = Math.round(nw * cap); nh = Math.round(nh * cap); }
    if (nw === w && nh === h) return;
    w = nw; h = nh; canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.r, w, h);
    // 넓은 화면: 지구는 오른쪽 가운데 · 좁은 화면: 아래 가운데
    if (rect.width > 768) { gl.uniform2f(U.c, w * .72, h * .5); gl.uniform1f(U.R, Math.min(h * .34, w * .2)); }
    else { gl.uniform2f(U.c, w * .5, h * .2); gl.uniform1f(U.R, w * .4); }
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
    gl.uniform1f(U.t, (now - start) / 1000 + 20);
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
