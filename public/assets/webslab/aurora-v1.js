/* WEBSLAB_AURORA_V1_20261105 — 짙은 히어로·마무리 띠의 오로라를 WebGL 셰이더로 그린다.
   별이 있는 밤하늘에 오로라 커튼 두 줄기가 휘어지며 흐르고(웹스랩 하늘빛·파랑·보라), 포인터 쪽으로 빛이 조금 기운다.
   - 제목이 있는 왼쪽은 어둡게 남겨 글자 대비를 지킨다(오른쪽으로 갈수록 밝게)
   - 절반 해상도로 그리고(빛 번짐이라 차이가 없다) 화면 밖·숨은 탭에서는 멈춘다
   - 움직임 줄이기: 한 장면만 그리고 멈춘다 · WebGL이 없으면 기존 CSS 오로라(.mx-hero__bg i)가 그대로 남는다 */
(function () {
  'use strict';
  var hosts = document.querySelectorAll('.mx-hero:not(.mx-hero--light) > .mx-hero__bg, .mx-end__card > .mx-hero__bg');
  if (!hosts.length || !window.WebGLRenderingContext) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  // 밤하늘 오로라 — 별이 있는 짙은 하늘에 휘어지며 소용돌이치는 커튼 두 줄기.
  // 커튼은 아래 가장자리가 밝고 선명하며 위로 세로 빛줄기가 뻗어 사라진다. 색은 웹스랩 팔레트:
  // 가장자리 하늘빛 → 브랜드 파랑(#3182f6) → 위쪽 보라(#6b5cff).
  var FRAG = [
    'precision mediump float;',
    'uniform vec2 r;uniform float t;uniform vec2 m;uniform float side;uniform float gain;',
    'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(17.1,9.2);a*=.5;}return v;}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/r;',
    ' vec2 p=(gl_FragCoord.xy-.5*r)/r.y+m*.05;',
    ' float T=t*.07;',
    ' vec3 skyTop=vec3(.024,.039,.09),skyLow=vec3(.05,.08,.165);',
    ' vec3 sky=mix(skyLow,skyTop,smoothstep(-.45,.5,p.y));',
    ' vec3 aur=vec3(0.);',
    ' for(int i=0;i<2;i++){',
    '  float fi=float(i);',
    '  vec2 q=p+vec2(fi*2.7,0.);',
    '  vec2 w=vec2(fbm(q*1.3+vec2(T*.9,fi)),fbm(q*1.3+vec2(5.2-T*.7,fi+3.1)));',
    '  q+=(w-.5)*.55;',                                                         /* 소용돌이 */
    '  float yc=(i==0?.04:-.15)+.3*(fbm(vec2(q.x*.7+T*.6+fi*4.,fi))-.5)+.06*sin(q.x*2.3+T*1.7+fi);',
    '  float d=q.y-yc;',                                                        /* 0보다 크면 가장자리 위 */
    '  float prof=exp(-max(-d,0.)*40.)*exp(-max(d,0.)*(5.2+fi*2.2));',
    '  float rays=n(vec2(q.x*34.+w.x*6.,q.y*1.6-T*2.5+fi*9.));',
    '  rays=.3+.7*smoothstep(.2,.95,rays);',                                    /* 세로 빛줄기 */
    '  float patchy=smoothstep(.26,.74,fbm(vec2(q.x*1.6-T*.8+fi*7.,T*.3)));',   /* 끊겼다 이어지는 밝기 */
    '  float edge=exp(-d*d*900.)*.55;',                                         /* 밝은 아래 가장자리 */
    '  float I=(prof*rays+edge)*patchy;',
    '  float hg=clamp(d*4.,0.,1.);',
    '  vec3 c=mix(vec3(.5,.78,1.),vec3(.19,.47,1.),smoothstep(0.,.35,hg));',
    '  c=mix(c,vec3(.42,.36,1.),smoothstep(.35,1.,hg));',
    '  aur+=c*I*(i==0?1.:.72);',
    ' }',
    ' float hz=exp(-pow((uv.y-.06)/.1,2.))*(.35+.65*fbm(vec2(p.x*3.+T*.4,7.)));', /* 지평선 근처 옅은 안개 */
    ' vec2 g=gl_FragCoord.xy/2.5,cell=floor(g);float sh=h(cell);',
    ' float star=step(.992,sh)*smoothstep(.42,0.,length(fract(g)-.5))*(.55+.45*sin(t*(.7+sh*2.3)+sh*40.));',
    ' star*=smoothstep(-.2,.35,p.y)*(1.-clamp(length(aur)*1.4,0.,1.));',      /* 오로라·지평선 쪽 별은 흐리게 */
    ' float bias=mix(1.,smoothstep(-.15,1.05,uv.x),side);',                     /* 제목 쪽은 어둡게 */
    ' vec3 col=sky+aur*1.1*mix(.2,1.,bias)*gain+vec3(.07,.1,.19)*hz*.55+vec3(.78,.86,1.)*star*.75;',
    ' col*=1.-.32*pow(length(uv-.5)*1.15,2.);',                                /* 비네트 */
    ' col+=(h(gl_FragCoord.xy+t)-.5)/255.;',                                    /* 밴딩 막는 디더 */
    ' gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  Array.prototype.forEach.call(hosts, function (host) {
    var canvas = document.createElement('canvas');
    canvas.className = 'mx-aurora';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    if (!gl) return;
    var vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't'),
        uM = gl.getUniformLocation(prog, 'm'), uSide = gl.getUniformLocation(prog, 'side'), uGain = gl.getUniformLocation(prog, 'gain');
    // 히어로는 왼쪽에 제목이 있어 왼쪽을 어둡게, 마무리 띠는 고르게
    var isHero = host.parentNode.classList.contains('mx-hero');
    gl.uniform1f(uSide, isHero ? 1 : .55);
    // 마무리 띠는 납작해서 빛 띠가 가로로 강하게 번진다 — 더 낮게
    gl.uniform1f(uGain, isHero ? .82 : .5);

    host.insertBefore(canvas, host.firstChild);

    var scale = .5, w = 0, h = 0;
    function resize() {
      var rect = host.getBoundingClientRect();
      var k = Math.min(window.devicePixelRatio || 1, 2) * scale;
      var nw = Math.max(1, Math.round(rect.width * k)), nh = Math.max(1, Math.round(rect.height * k));
      // 큰 레티나 화면에서도 GPU 부담이 일정하게 — 그리는 픽셀 수 상한(약 0.6MP)
      var cap = Math.sqrt(600000 / (nw * nh));
      if (cap < 1) { nw = Math.max(1, Math.round(nw * cap)); nh = Math.max(1, Math.round(nh * cap)); }
      if (nw === w && nh === h) return;
      w = nw; h = nh;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
    }

    // 포인터 — 목표값으로 천천히 따라간다
    var mx = 0, my = 0, tx = 0, ty = 0;
    var area = host.parentNode;
    area.addEventListener('pointermove', function (e) {
      var rect = area.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width - .5;
      ty = .5 - (e.clientY - rect.top) / rect.height;
    }, { passive: true });
    area.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

    var start = performance.now() - 40000 * Math.random(), raf = 0, visible = false, shown = false;
    function draw(now) {
      resize();
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) { shown = true; host.classList.add('is-gl'); }
    }
    function loop(now) {
      draw(now);
      raf = visible && !document.hidden && !reduce.matches ? requestAnimationFrame(loop) : 0;
    }
    function kick() {
      if (reduce.matches) { draw(start + 52000); return; }   // 움직임 줄이기: 고정된 한 장면
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) kick();
      }, { rootMargin: '80px' }).observe(host);
    } else { visible = true; kick(); }
    document.addEventListener('visibilitychange', kick);
    if (reduce.addEventListener) reduce.addEventListener('change', kick);
    window.addEventListener('resize', function () { if (reduce.matches || !raf) { w = 0; draw(performance.now()); } }, { passive: true });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); host.classList.remove('is-gl'); cancelAnimationFrame(raf); raf = 0; });
  });
}());
