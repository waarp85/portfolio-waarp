// R&D experiment: still images relit live by a light that follows the cursor.
// Each piece lives in assets/images/rd-experiment/<name>/ (albedo.jpg, normal.jpg, alpha.png).
// The list of pieces is in the data-pieces attribute of #rl-stage. Plain WebGL, no libraries.
(function () {
  const stage = document.getElementById('rl-stage');
  if (!stage) return;
  const cv = stage.querySelector('canvas');
  const scope = stage.closest('section') || document.body;
  const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { stage.classList.add('rl-nogl'); return; }

  const VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  const FS = `precision highp float;
uniform sampler2D uAlb,uNrm,uMsk;uniform vec3 uL,uCol;uniform float uAsp,uImgAsp,uFade;uniform int uMode;varying vec2 v;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){
 vec2 iv=v;
 if(uImgAsp>uAsp){iv.y=(v.y-.5)*uImgAsp/uAsp+.5;}else{iv.x=(v.x-.5)*uAsp/uImgAsp+.5;}
 float inside=step(0.,iv.x)*step(iv.x,1.)*step(0.,iv.y)*step(iv.y,1.);
 vec3 nt=texture2D(uNrm,iv).rgb;float m=texture2D(uMsk,iv).r*inside*uFade;
 if(uMode==2){gl_FragColor=vec4(nt*inside*uFade,1.);return;}
 vec3 n=normalize(nt*2.-1.);
 vec3 p=vec3((v.x-.5)*uAsp,v.y-.5,0.);
 vec3 d=uL-p;float dist=length(d);vec3 L=d/dist;vec3 V=vec3(0.,0.,1.);vec3 H=normalize(L+V);
 float att=5./(1.+dist*dist*3.);
 vec3 alb=pow(texture2D(uAlb,iv).rgb,vec3(2.2));
 float ndl=max(dot(n,L),0.),ndh=max(dot(n,H),0.);
 vec3 f0=clamp(alb*2.4,0.,1.);
 float fr=pow(1.-max(dot(n,V),0.),5.);
 vec3 F=f0+(1.-f0)*fr*.35;
 float sp=pow(ndh,70.)*3.5+pow(ndh,12.)*.45;
 vec3 col=(alb*ndl*.35+F*sp*ndl)*uCol*att+alb*.06;
 col*=m;
 vec3 o=pow(aces(col*1.15),vec3(1./2.2));
 if(uMode==3){vec2 c=floor(gl_FragCoord.xy/16.);vec3 ch=mix(vec3(.82),vec3(.64),mod(c.x+c.y,2.));o=mix(ch,o,m);}
 gl_FragColor=vec4(o,1.);
}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);

  // Three texture slots, filled again each time the piece changes
  const slots = [['uAlb', 'albedo.jpg'], ['uNrm', 'normal.jpg'], ['uMsk', 'alpha.png']].map(([name, file], i) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]
      .forEach(([k, val]) => gl.texParameteri(gl.TEXTURE_2D, k, val));
    gl.uniform1i(U(name), i);
    return { t, i, file };
  });

  const base = 'assets/images/rd-experiment/';
  const pieces = (stage.dataset.pieces || '').split(',').map(s => s.trim()).filter(Boolean);
  let index = 0, fade = 0, fadeTarget = 1, loadToken = 0;

  function loadImg(src) { return new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = ko; im.src = src; }); }
  async function show(n) {
    if (!pieces.length) return;
    index = (n + pieces.length) % pieces.length;
    const token = ++loadToken;
    fadeTarget = 0;
    const dir = base + pieces[index] + '/';
    let imgs;
    try { imgs = await Promise.all(slots.map(s => loadImg(dir + s.file))); } catch (e) { return; }
    if (token !== loadToken) return;
    // wait for the fade-out to finish before swapping
    await new Promise(r => { const w = () => (fade < 0.02 ? r() : requestAnimationFrame(w)); w(); });
    if (token !== loadToken) return;
    slots.forEach((s, k) => { gl.activeTexture(gl.TEXTURE0 + s.i); gl.bindTexture(gl.TEXTURE_2D, s.t); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[k]); });
    gl.uniform1f(U('uImgAsp'), imgs[0].naturalWidth / imgs[0].naturalHeight);
    fadeTarget = 1;
    const count = scope.querySelector('.rl-count');
    if (count) count.textContent = (index + 1) + ' / ' + pieces.length;
  }

  const ASP = 16 / 9; gl.uniform1f(U('uAsp'), ASP); gl.uniform1f(U('uImgAsp'), ASP);
  let mode = +((stage.querySelector('.rl-views [aria-pressed=true]') || {}).dataset || { m: 0 }).m || 0, col = [1, 1, 1], visible = true, running = false;
  const z = 0.45;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cur = { x: -0.35, y: 0.25 }, tgt = { x: -0.35, y: 0.25 };
  let lastMove = -1e9; const t0 = performance.now();

  function resize() {
    const r = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(cv.clientWidth * r), h = Math.round(cv.clientHeight * r);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
  }
  new ResizeObserver(resize).observe(cv);

  function setFromEvent(e) {
    if (e.target.closest('.rl-ui')) return;
    const b = stage.getBoundingClientRect();
    tgt.x = ((e.clientX - b.left) / b.width - 0.5) * ASP;
    tgt.y = 0.5 - (e.clientY - b.top) / b.height;
    lastMove = performance.now();
  }
  stage.addEventListener('pointermove', setFromEvent);
  stage.addEventListener('pointerdown', setFromEvent);

  function frame(now) {
    if (!visible) { running = false; return; }
    if (!reduce && now - lastMove > 2500) { const t = (now - t0) / 1000 * 0.45; tgt.x = Math.cos(t) * ASP * 0.42; tgt.y = Math.sin(t * 1.3) * 0.32; }
    const k = reduce ? 1 : 0.12; cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k;
    fade += (fadeTarget - fade) * (reduce ? 1 : 0.18);
    gl.uniform3f(U('uL'), cur.x, cur.y, z); gl.uniform1i(U('uMode'), mode); gl.uniform3f(U('uCol'), col[0], col[1], col[2]); gl.uniform1f(U('uFade'), fade);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
  // Draw only while the stage is on screen
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }).observe(stage);
  start();
  show(0);

  stage.querySelectorAll('.rl-views button').forEach(b => b.addEventListener('click', () => {
    mode = +b.dataset.m;
    stage.querySelectorAll('.rl-views button').forEach(o => o.setAttribute('aria-pressed', o === b));
  }));
  stage.querySelectorAll('.rl-cols button').forEach(b => b.addEventListener('click', () => {
    col = b.dataset.c.split(',').map(Number);
    stage.querySelectorAll('.rl-cols button').forEach(o => o.setAttribute('aria-pressed', o === b));
  }));

  // Arrows: hidden when there is only one piece
  if (pieces.length > 1) {
    scope.classList.add('rl-multi');
    const prev = scope.querySelector('.rl-prev'), next = scope.querySelector('.rl-next');
    if (prev) prev.addEventListener('click', () => show(index - 1));
    if (next) next.addEventListener('click', () => show(index + 1));
    document.addEventListener('keydown', e => {
      if (!visible || e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }
})();
