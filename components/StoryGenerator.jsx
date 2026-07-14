'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Download, Upload, Cake, Quote, Plane, X, Check,
} from 'lucide-react';

/* FONT LOADING                                                              */
/* ========================================================================= */
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Space+Grotesk:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap';

function useGoogleFonts() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!document.getElementById('askit-fonts')) {
      const link = document.createElement('link');
      link.id = 'askit-fonts';
      link.rel = 'stylesheet';
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
    let cancelled = false;
    const load = async () => {
      try {
        await Promise.all([
          document.fonts.load('600 48px "Fraunces"'),
          document.fonts.load('italic 500 48px "Fraunces"'),
          document.fonts.load('700 48px "Fraunces"'),
          document.fonts.load('600 32px "Space Grotesk"'),
          document.fonts.load('700 32px "Space Grotesk"'),
          document.fonts.load('600 40px "Caveat"'),
        ]);
        await document.fonts.ready;
      } catch (e) {
        /* fonts still usable via fallback stack */
      }
      if (!cancelled) setReady(true);
    };
    load();
    return () => { cancelled = true; };
  }, []);
  return ready;
}

/* ========================================================================= */
/* EASING + MATH HELPERS                                                     */
/* ========================================================================= */
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function easeOutCubic(t) {
  const c = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - c, 3);
}
function triangleWave(t) {
  const p = t % 1;
  return p < 0.5 ? p * 2 : (1 - p) * 2;
}
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

/* ========================================================================= */
/* CANVAS DRAW HELPERS                                                       */
/* ========================================================================= */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCoverTransformed(ctx, img, x, y, w, h, radius = 0, scale = 1, panX = 0, panY = 0) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
  }
  const zoomedSw = sw / scale;
  const zoomedSh = sh / scale;
  const centerX = (img.width - sw) / 2 + sw / 2;
  const centerY = (img.height - sh) / 2 + sh / 2;
  const sx = clamp(centerX - zoomedSw / 2 + panX, 0, img.width - zoomedSw);
  const sy = clamp(centerY - zoomedSh / 2 + panY, 0, img.height - zoomedSh);
  ctx.save();
  if (radius > 0) {
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  ctx.drawImage(img, sx, sy, zoomedSw, zoomedSh, x, y, w, h);
  ctx.restore();
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
  const lines = wrapLines(ctx, text, maxWidth);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.textAlign = align;
    ctx.fillText(l, x, startY + i * lineHeight);
  });
  return lines.length;
}

function drawTypewriterText(ctx, text, x, y, maxWidth, lineHeight, align, charsToShow) {
  const lines = wrapLines(ctx, text, maxWidth);
  let remaining = charsToShow;
  const visibleLines = [];
  for (const l of lines) {
    if (remaining <= 0) break;
    if (remaining >= l.length) {
      visibleLines.push(l);
      remaining -= l.length + 1;
    } else {
      visibleLines.push(l.slice(0, remaining));
      remaining = 0;
    }
  }
  const totalLines = lines.length;
  const startY = y - ((totalLines - 1) * lineHeight) / 2;
  visibleLines.forEach((l, i) => {
    ctx.textAlign = align;
    ctx.fillText(l, x, startY + i * lineHeight);
  });
  return totalLines;
}

function drawPin(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.15, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.5, cy);
  ctx.quadraticCurveTo(cx, cy + size * 1.1, cx + size * 0.5, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.15, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function makeParticles(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      baseX: Math.random() * 1080,
      baseY: Math.random() * 1920,
      r: 2 + Math.random() * 4,
      speed: 0.01 + Math.random() * 0.025,
      phase: Math.random() * Math.PI * 2,
      driftAmp: 10 + Math.random() * 25,
    });
  }
  return arr;
}

/* ========================================================================= */
/* TEMPLATE DRAW FUNCTIONS (canvas 1080x1920, HD 9:16)                       */
/* ========================================================================= */
const W = 1080;
const H = 1920;

function drawBirthday(ctx, params, anim) {
  const { name, message, img } = params;
  const { elapsed, particles, exportMode } = anim;
  const t = exportMode ? 0 : elapsed;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#F6E9E4');
  grad.addColorStop(0.5, '#EFE6F4');
  grad.addColorStop(1, '#E4EEE0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  particles.forEach((p) => {
    const travel = exportMode ? 0 : (t * p.speed) % (H + 160);
    const y = p.baseY - travel + 80;
    const wrappedY = ((y % (H + 160)) + (H + 160)) % (H + 160) - 80;
    const x = p.baseX + (exportMode ? 0 : Math.sin(t / 2200 + p.phase) * p.driftAmp);
    const alpha = exportMode ? 0.55 : 0.35 + Math.sin(t / 900 + p.phase) * 0.25;
    ctx.globalAlpha = clamp(alpha, 0.08, 0.75);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, wrappedY, p.r * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  const bob = exportMode ? 0 : Math.sin(t / 1400) * 6;
  const breathe = exportMode ? 1 : 1 + Math.sin(t / 900) * 0.006;

  ctx.font = '600 34px "Space Grotesk"';
  ctx.fillStyle = '#B98C7A';
  ctx.textAlign = 'center';
  ctx.fillText('✦ IT’S A CELEBRATION ✦', W / 2, 130 + bob * 0.3);

  const cardX = 90, cardY = 210, cardW = W - 180, cardH = 1330;
  ctx.save();
  ctx.translate(W / 2, cardY + cardH / 2 + bob);
  ctx.scale(breathe, breathe);
  ctx.translate(-(W / 2), -(cardY + cardH / 2));
  ctx.shadowColor = 'rgba(60,40,50,0.25)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 25;
  ctx.fillStyle = '#FFFDF9';
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 18);
  ctx.fill();
  ctx.restore();

  const photoPad = 40;
  const photoW = cardW - photoPad * 2;
  const photoH = cardH - 330;
  const photoX = cardX + photoPad;
  const photoY = cardY + photoPad + bob;

  if (img) {
    drawImageCoverTransformed(ctx, img, photoX, photoY, photoW, photoH, 6, 1, 0, 0);
  } else {
    ctx.fillStyle = '#EFE3DD';
    roundRectPath(ctx, photoX, photoY, photoW, photoH, 6);
    ctx.fill();
    ctx.font = '600 100px "Space Grotesk"';
    ctx.fillStyle = '#D8C3B8';
    ctx.textAlign = 'center';
    ctx.fillText('🎂', W / 2, photoY + photoH / 2 + 35);
  }

  const textSlide = exportMode ? 0 : Math.sin(t / 1700) * 4;

  ctx.font = 'italic 500 64px "Fraunces"';
  ctx.fillStyle = '#3A2E2A';
  ctx.textAlign = 'center';
  drawWrappedText(ctx, name || 'Happy Birthday!', W / 2 + textSlide, photoY + photoH + 110, cardW - 100, 68);

  ctx.font = '600 38px "Caveat"';
  ctx.fillStyle = '#8A7267';
  drawWrappedText(ctx, message || 'wishing you the best day ever 🎈', W / 2 - textSlide, photoY + photoH + 215, cardW - 140, 46);

  ctx.font = '400 26px "Space Grotesk"';
  ctx.fillStyle = '#C9A9A0';
  ctx.textAlign = 'center';
  ctx.fillText('— made with the aesthetic kit —', W / 2, cardY + cardH - 35 + bob);
}

function drawQuote(ctx, params, anim) {
  const { name, message, img } = params;
  const { elapsed, revealElapsed, exportMode } = anim;
  const t = exportMode ? 0 : elapsed;
  const text = message || 'Quiet minds are the loudest creators.';

  if (img) {
    drawImageCoverTransformed(ctx, img, 0, 0, W, H, 0, 1, 0, 0);
    const overlay = ctx.createLinearGradient(0, 0, 0, H);
    overlay.addColorStop(0, 'rgba(20,18,16,0.55)');
    overlay.addColorStop(1, 'rgba(20,18,16,0.75)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = '#1E1C1A';
    ctx.fillRect(0, 0, W, H);
  }

  const pulse = exportMode ? 0.9 : 0.82 + Math.sin(t / 1500) * 0.08;
  const vignette = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 1000);
  vignette.addColorStop(0, `rgba(255,255,255,${0.05 * pulse})`);
  vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  ctx.font = '700 160px "Fraunces"';
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.textAlign = 'center';
  ctx.fillText('“', W / 2, 480);

  const charsToShow = exportMode ? text.length : Math.floor(revealElapsed / 32);
  ctx.font = 'italic 500 66px "Fraunces"';
  ctx.fillStyle = '#FBF8F3';
  drawTypewriterText(ctx, text, W / 2, H / 2 - 40, W - 220, 84, 'center', Math.max(charsToShow, 0));

  const showCaret = !exportMode && charsToShow < text.length && Math.floor(t / 420) % 2 === 0;
  if (showCaret) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(W / 2 + 2, H / 2 + 6, 4, 54);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 60, H / 2 + 230);
  ctx.lineTo(W / 2 + 60, H / 2 + 230);
  ctx.stroke();

  ctx.font = '600 32px "Space Grotesk"';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText((name || 'your name').toUpperCase().split('').join(' '), W / 2, H / 2 + 300);
}

function drawTravel(ctx, params, anim) {
  const { name, message, img } = params;
  const { elapsed, revealElapsed, exportMode } = anim;
  const t = exportMode ? 0 : elapsed;

  const cycle = 12000;
  const phase = exportMode ? 0.3 : triangleWave(t / cycle);
  const eased = easeInOutSine(phase);
  const scale = 1 + eased * 0.14;
  const panX = (eased - 0.5) * 60;

  if (img) {
    drawImageCoverTransformed(ctx, img, 0, 0, W, H, 0, scale, panX, 0);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#9FC6D8');
    grad.addColorStop(1, '#4E7C93');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(panX * 0.4, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.6);
    ctx.lineTo(W * 0.3, H * 0.42);
    ctx.lineTo(W * 0.55, H * 0.58);
    ctx.lineTo(W * 0.8, H * 0.38);
    ctx.lineTo(W, H * 0.55);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const overlay = ctx.createLinearGradient(0, H * 0.45, 0, H);
  overlay.addColorStop(0, 'rgba(10,10,10,0)');
  overlay.addColorStop(1, 'rgba(10,10,10,0.78)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, H * 0.45, W, H * 0.55);

  const slideProgress = exportMode ? 1 : easeOutCubic(clamp(revealElapsed / 700, 0, 1));
  const pillOffsetX = (1 - slideProgress) * -260;
  const pillW = 300, pillH = 76;
  ctx.globalAlpha = clamp(slideProgress + 0.15, 0, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundRectPath(ctx, 60 + pillOffsetX, 70, pillW, pillH, pillH / 2);
  ctx.fill();
  drawPin(ctx, 60 + pillOffsetX + 44, 70 + pillH / 2, 20, '#4E7C93');
  ctx.font = '600 30px "Space Grotesk"';
  ctx.fillStyle = '#2B2A28';
  ctx.textAlign = 'left';
  ctx.fillText((name || 'somewhere new').slice(0, 16), 60 + pillOffsetX + 78, 70 + pillH / 2 + 10);
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.font = '700 84px "Space Grotesk"';
  ctx.fillStyle = '#FFFFFF';
  drawWrappedText(ctx, message || 'chasing new horizons', W / 2, H - 260, W - 160, 92);

  ctx.font = '500 28px "Space Grotesk"';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('✦ TRAVEL DIARIES ✦', W / 2, H - 110);
}

const TEMPLATES = {
  birthday: { label: 'Birthday Bash', icon: Cake, draw: drawBirthday },
  quote: { label: 'Minimalist Quote', icon: Quote, draw: drawQuote },
  travel: { label: 'Travel Vibe', icon: Plane, draw: drawTravel },
};

/* ========================================================================= */
/* TAB 1 — ANIMATED STORY & REEL COVER ENGINE                                */
/* ========================================================================= */
function StoryGenerator() {
  const fontsReady = useGoogleFonts();
  const [template, setTemplate] = useState('birthday');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imgSrc, setImgSrc] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [justExported, setJustExported] = useState(false);

  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const revealStartRef = useRef(0);
  const particlesRef = useRef(makeParticles(26));
  const paramsRef = useRef({ template: 'birthday', name: '', message: '', img: null });

  useEffect(() => {
    paramsRef.current = { template, name, message, img: imgObj };
  }, [template, name, message, imgObj]);

  useEffect(() => {
    revealStartRef.current = performance.now();
  }, [message, template, imgSrc]);

  useEffect(() => {
    if (!imgSrc) { setImgObj(null); return; }
    let cancelled = false;
    loadImage(imgSrc).then((img) => { if (!cancelled) setImgObj(img); });
    return () => { cancelled = true; };
  }, [imgSrc]);

  useEffect(() => {
    if (!fontsReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    startTimeRef.current = performance.now();
    revealStartRef.current = performance.now();

    const loop = (now) => {
      const elapsed = now - startTimeRef.current;
      const revealElapsed = now - revealStartRef.current;
      const p = paramsRef.current;
      ctx.clearRect(0, 0, W, H);
      TEMPLATES[p.template].draw(ctx, p, {
        elapsed,
        revealElapsed,
        particles: particlesRef.current,
        exportMode: false,
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fontsReady]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const p = paramsRef.current;
    ctx.clearRect(0, 0, W, H);
    TEMPLATES[p.template].draw(ctx, p, {
      elapsed: 0,
      revealElapsed: 999999,
      particles: particlesRef.current,
      exportMode: true,
    });
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-${template}-${Date.now()}.jpg`;
    a.click();
    setJustExported(true);
    setTimeout(() => setJustExported(false), 1800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">CHOOSE AN OCCASION</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TEMPLATES).map(([key, tmpl]) => {
              const Icon = tmpl.icon;
              const active = template === key;
              return (
                <button
                  key={key}
                  onClick={() => setTemplate(key)}
                  className={`group relative flex flex-col items-center gap-2 rounded-2xl py-4 px-2 border overflow-hidden transition-all duration-300 ${
                    active
                      ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-lg scale-[1.02]'
                      : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.6} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs font-medium text-center leading-tight">{tmpl.label}</span>
                  {active && <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-[#C9BFE8]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Name / Title</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={template === 'travel' ? 'e.g. Manali, India' : 'e.g. Aditya'}
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Short Message / Caption</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Write your line here…"
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] px-4 py-3 text-sm font-medium text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-95 transition-all duration-150"
              >
                <Upload size={16} /> {imgSrc ? 'Change image' : 'Upload image'}
              </button>
              {imgSrc && (
                <button
                  onClick={() => { setImgSrc(null); setImgObj(null); }}
                  className="flex items-center gap-1 rounded-xl px-3 py-3 text-sm text-[#8A7267] hover:bg-[#F3EFEA] active:scale-95 transition-all duration-150"
                >
                  <X size={16} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md"
        >
          {justExported ? <Check size={18} /> : <Download size={18} />}
          {justExported ? 'Exported!' : 'Export Asset (HD JPG)'}
        </button>
        <p className="text-xs text-center text-[#8A8578] -mt-3">Captures a clean, fully-settled frame — independent of the live motion preview.</p>
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[300px]">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5"
            style={{ aspectRatio: '9 / 16' }}
          >
            <canvas ref={canvasRef} width={W} height={H} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CE0A6] animate-pulse" />
              <span className="text-[10px] font-medium text-white tracking-wide">LIVE 60FPS</span>
            </div>
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Live animated preview · 1080×1920 HD</p>
        </div>
      </div>
    </div>
  );
}

export default StoryGenerator;
