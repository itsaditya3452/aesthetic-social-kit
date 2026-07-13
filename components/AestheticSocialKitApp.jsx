'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles, Download, Upload, Cake, Quote, Plane, Clapperboard,
  Type, Hash, Copy, Check, Wand2, Image as ImageIcon, Film, X,
  Gauge, Instagram, Music2, Youtube, Flame, BookOpen, Lightbulb,
  Rocket, MessageCircle, Share2, ShoppingBag, Mic, Camera, MonitorPlay,
  Loader2
} from 'lucide-react';

/* ========================================================================= */
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

/* ========================================================================= */
/* TAB 2 — PRO SCRIPT FLOW GENERATOR (VIRAL PSYCHOLOGY ARCHITECTURE)         */
/* ========================================================================= */
const CATEGORY_LIBRARY = [
  {
    keys: ['code', 'coding', 'programming', 'developer', 'software', 'dev'],
    label: 'Coding & Dev',
    bRoll: ['macro shot of hands typing', 'terminal output scrolling fast', 'IDE error turning green', 'monitor glow in a dark room', 'sticky notes on a desk'],
    painPoint: 'wasting hours debugging something that had a one-line fix',
    secretTip: 'a single config change that most tutorials skip',
    statHook: '90% of developers never learn this until years into their career',
  },
  {
    keys: ['fitness', 'gym', 'workout', 'exercise', 'training'],
    label: 'Fitness & Gym',
    bRoll: ['slow-mo barbell loading', 'sweat dripping close-up', 'form comparison split-screen', 'gym clock ticking', 'chalk hands clapping'],
    painPoint: 'training hard for months with barely any visible progress',
    secretTip: 'the one form cue coaches charge $200 an hour to teach',
    statHook: 'studies show most people do this exercise wrong 7 out of 10 times',
  },
  {
    keys: ['food', 'recipe', 'cooking', 'baking', 'kitchen'],
    label: 'Food & Cooking',
    bRoll: ['overhead ingredient flat-lay', 'steam rising off the pan', 'knife through fresh produce', 'plating close-up', 'first bite reaction'],
    painPoint: 'your dish never tasting like the restaurant version',
    secretTip: 'the ingredient swap chefs never mention on camera',
    statHook: 'this one mistake ruins 8 out of 10 home-cooked versions of this dish',
  },
  {
    keys: ['travel', 'vlog', 'trip', 'vacation'],
    label: 'Travel',
    bRoll: ['drone establishing shot', 'quick cut street montage', 'local food stall close-up', 'golden hour skyline', 'transport/transit clip'],
    painPoint: 'planning a trip and still overpaying for the exact same experience',
    secretTip: 'the local trick that saves 40% and skips every tourist trap',
    statHook: 'most tourists visit this spot and completely miss the better version 200m away',
  },
  {
    keys: ['money', 'finance', 'business', 'startup', 'invest'],
    label: 'Finance & Business',
    bRoll: ['phone screen showing a chart', 'whiteboard math close-up', 'handshake or laptop typing', 'calculator/spreadsheet zoom', 'confident walk-and-talk'],
    painPoint: 'working hard and still feeling broke by the end of the month',
    secretTip: 'the exact number most people never calculate before spending',
    statHook: 'roughly 1 in 3 people make this exact mistake with their first paycheck',
  },
  {
    keys: ['skincare', 'beauty', 'makeup', 'glow'],
    label: 'Beauty & Skincare',
    bRoll: ['product texture macro', 'before/after split lighting', 'application close-up', 'natural window light glow shot', 'bathroom shelf flat-lay'],
    painPoint: 'spending money on products that do absolutely nothing',
    secretTip: 'the order of application that changes everything',
    statHook: 'dermatologists say most people apply this in the wrong order every single day',
  },
  {
    keys: ['study', 'productivity', 'exam', 'focus', 'student'],
    label: 'Study & Productivity',
    bRoll: ['clean desk top-down', 'pages flipping fast', 'timer counting down', 'highlighter gliding across notes', 'checklist being ticked'],
    painPoint: 'sitting down to study for hours and retaining almost nothing',
    secretTip: 'the 2-minute technique that doubles retention overnight',
    statHook: 'research shows most students waste 60% of study time re-reading instead of recalling',
  },
  {
    keys: ['gaming', 'game', 'gamer', 'esports'],
    label: 'Gaming',
    bRoll: ['gameplay clip, losing moment', 'settings menu quick cut', 'split-screen comparison', 'killcam replay', 'hype reaction cam'],
    painPoint: 'losing to players who are clearly worse mechanically than you',
    secretTip: 'the setting buried three menus deep that pros always change first',
    statHook: 'most players never touch this setting in their entire time playing',
  },
  {
    keys: ['fashion', 'outfit', 'style', 'ootd'],
    label: 'Fashion & Style',
    bRoll: ['mirror outfit check', 'fabric texture close-up', 'accessory detail shot', 'street style walk-by', 'closet flat-lay'],
    painPoint: 'buying trendy pieces that end up unworn in the closet within a month',
    secretTip: 'the styling rule that instantly makes any outfit look expensive',
    statHook: 'most people repeat the same 3 outfit mistakes without realizing it',
  },
  {
    keys: ['music', 'song', 'producer', 'beat', 'singing'],
    label: 'Music & Production',
    bRoll: ['DAW screen close-up', 'hands on keys or pads', 'waveform scrubbing', 'studio ambient light', 'headphones close-up reaction'],
    painPoint: 'your tracks sounding muddy compared to professionally mixed songs',
    secretTip: 'the one mix setting that instantly adds clarity',
    statHook: 'most bedroom producers skip this step entirely and wonder why it sounds off',
  },
  {
    keys: ['relationship', 'dating', 'marriage', 'partner'],
    label: 'Relationships',
    bRoll: ['couple candid walk shot', 'coffee shop conversation', 'text message screen blur', 'hands close-up', 'sunset silhouette'],
    painPoint: 'having the same argument on repeat with no resolution',
    secretTip: 'the one sentence that de-escalates almost any fight',
    statHook: 'therapists say most couples never learn this simple communication shift',
  },
  {
    keys: ['motivation', 'mindset', 'discipline', 'habit'],
    label: 'Motivation & Mindset',
    bRoll: ['sunrise walk or run', 'journal writing close-up', 'alarm clock at 5am', 'crossing something off a list', 'quiet focused stare to camera'],
    painPoint: 'setting big goals every January and quitting by week three',
    secretTip: 'the tiny habit stack that made consistency finally stick',
    statHook: 'most people abandon new habits by day 18 — here is why yours will not',
  },
];

const GENERIC_CATEGORY = {
  label: 'General',
  bRoll: ['relevant close-up shot', 'quick supporting cutaway', 'reaction close-up', 'text overlay graphic', 'wide establishing shot'],
  painPoint: 'putting in effort and not seeing the results you expected',
  secretTip: 'the one detail almost everyone overlooks',
  statHook: 'most people never figure this out on their own',
};

function matchCategory(topic) {
  const lower = topic.toLowerCase();
  const found = CATEGORY_LIBRARY.find((c) => c.keys.some((k) => lower.includes(k)));
  return found || GENERIC_CATEGORY;
}

const TONE_CONFIG = {
  controversial: {
    label: 'Controversial Hook',
    icon: Flame,
    hookBank: [
      (topic, cat) => `Unpopular opinion: most advice about ${topic} is actively making you worse at it.`,
      (topic, cat) => `Stop believing this ${topic} myth — ${cat.statHook}.`,
      (topic, cat) => `Nobody wants to admit this about ${topic}, but here it is anyway.`,
      (topic, cat) => `If you're into ${topic}, this is going to make some people angry.`,
    ],
    pacing: 'Fast, punchy cuts. Deliver the controversial line with zero hesitation — confidence sells the claim.',
    ctaEngagement: (topic, cat) => `Comment "WRONG" if you disagree — let's debate ${topic} in the replies.`,
    ctaShare: (topic, cat) => `Send this to the one friend who still believes the old way about ${topic}.`,
    ctaSales: (topic, cat) => `If you want the full breakdown behind this ${topic} take, it's linked in my bio.`,
  },
  storytelling: {
    label: 'Storytelling / POV',
    icon: BookOpen,
    hookBank: [
      (topic, cat) => `POV: you finally figured out ${topic} after ${cat.painPoint}.`,
      (topic, cat) => `The day I almost gave up on ${topic} — until this happened.`,
      (topic, cat) => `Nobody told me this story about ${topic} until it was almost too late.`,
      (topic, cat) => `This is the moment everything about my ${topic} journey changed.`,
    ],
    pacing: 'Slower, warmer pacing. Let a beat of silence land after the emotional turn before moving to the payoff.',
    ctaEngagement: (topic, cat) => `Comment your own ${topic} turning point — I read every single one.`,
    ctaShare: (topic, cat) => `Share this with someone going through the same ${topic} struggle right now.`,
    ctaSales: (topic, cat) => `I put the full story and the exact steps in the resource linked in my bio.`,
  },
  educational: {
    label: 'Educational / Value Bomb',
    icon: Lightbulb,
    hookBank: [
      (topic, cat) => `Here's exactly how ${topic} actually works — no fluff, just the mechanics.`,
      (topic, cat) => `3 things about ${topic} that instantly separate beginners from pros.`,
      (topic, cat) => `${cat.statHook.charAt(0).toUpperCase() + cat.statHook.slice(1)}. Let me fix that for you.`,
      (topic, cat) => `Save this — it's the clearest explanation of ${topic} you'll see today.`,
    ],
    pacing: 'Clean, confident, information-dense delivery. Use on-screen text to reinforce every key point.',
    ctaEngagement: (topic, cat) => `Comment "GUIDE" and I'll send you the full ${topic} breakdown.`,
    ctaShare: (topic, cat) => `Share this with someone who's just getting started with ${topic}.`,
    ctaSales: (topic, cat) => `The complete ${topic} system is linked in my bio if you want to go deeper.`,
  },
  productivity: {
    label: 'Productivity Hack',
    icon: Rocket,
    hookBank: [
      (topic, cat) => `This ${topic} hack saved me hours every single week.`,
      (topic, cat) => `Do this before you touch ${topic} again — it changes everything.`,
      (topic, cat) => `The 2-minute trick that fixed my entire approach to ${topic}.`,
      (topic, cat) => `If you're short on time but serious about ${topic}, watch this.`,
    ],
    pacing: 'Brisk, efficient pacing that mirrors the "hack" — no wasted seconds, quick numbered beats.',
    ctaEngagement: (topic, cat) => `Comment your biggest ${topic} time-waster — I might fix it in part 2.`,
    ctaShare: (topic, cat) => `Send this to someone who's always saying they don't have time for ${topic}.`,
    ctaSales: (topic, cat) => `Grab my full ${topic} workflow template linked in my bio.`,
  },
};

function buildStoryboard(topic, category, tone) {
  const audioBank = [
    'Trending upbeat sound builds under the hook',
    'Sudden silence for one beat to add weight',
    'Soft bass swell leading into the reveal',
    'Quick whoosh transition SFX',
    'Typing/click SFX synced to on-screen text',
    'Music ducks slightly so voiceover cuts through',
    'Subtle riser building toward the CTA',
  ];
  return [
    {
      time: '0:00–0:03',
      onCamera: 'Direct to camera, strong eye contact, deliver the hook line with full conviction.',
      bRoll: `${category.bRoll[0]}, flashed for half a second to punctuate the opening line`,
      textOverlay: 'Hook line appears in bold, word-by-word pop-in',
      audio: audioBank[0],
    },
    {
      time: '0:03–0:07',
      onCamera: `Brief context: name the exact problem — ${category.painPoint}.`,
      bRoll: category.bRoll[1],
      textOverlay: '"Sound familiar?"',
      audio: audioBank[1],
    },
    {
      time: '0:07–0:13',
      onCamera: `Deliver value point #1 tied to ${topic}, speaking slightly faster to build energy.`,
      bRoll: category.bRoll[2],
      textOverlay: 'Value point #1 as a short on-screen label',
      audio: audioBank[2],
    },
    {
      time: '0:13–0:19',
      onCamera: `Deliver value point #2 — this is where you reveal ${category.secretTip}.`,
      bRoll: category.bRoll[3],
      textOverlay: 'Value point #2 + a checkmark icon animation',
      audio: audioBank[4],
    },
    {
      time: '0:19–0:24',
      onCamera: 'Show the proof or payoff — the visible result of applying the tip.',
      bRoll: `${category.bRoll[4]}, held a beat longer than the other cutaways`,
      textOverlay: '"Here\'s the result" label with an arrow pointing to the proof',
      audio: audioBank[3],
    },
    {
      time: '0:24–0:27',
      onCamera: 'Emotional peak — genuine reaction shot (relief, excitement, satisfaction).',
      bRoll: 'Slow-motion close-up of the reaction for emphasis',
      textOverlay: 'No text — let the reaction breathe',
      audio: audioBank[5],
    },
    {
      time: '0:27–0:30',
      onCamera: 'Direct to camera for the CTA, slightly warmer tone than the hook.',
      bRoll: 'Cut back to the same framing as the hook for a satisfying bookend',
      textOverlay: 'CTA text pinned at the bottom third',
      audio: audioBank[6],
    },
  ];
}

function generateProScript(topicRaw, toneKey) {
  const topic = (topicRaw || 'this').trim();
  const category = matchCategory(topic);
  const tone = TONE_CONFIG[toneKey] || TONE_CONFIG.educational;
  const hooks = tone.hookBank.slice(0, 3).map((fn) => fn(topic, category));
  const storyboard = buildStoryboard(topic, category, tone);
  return {
    hooks,
    storyboard,
    pacing: tone.pacing,
    ctas: {
      engagement: tone.ctaEngagement(topic, category),
      share: tone.ctaShare(topic, category),
      sales: tone.ctaSales(topic, category),
    },
    toneLabel: tone.label,
    categoryLabel: category.label,
  };
}

function ScriptBuilder() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('educational');
  const [script, setScript] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setScript(generateProScript(topic, tone));
      setIsGenerating(false);
    }, 350);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Video topic / idea</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. coding, skincare, gym, travel vlog…"
            className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-5 py-3 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shrink-0 disabled:opacity-60"
          >
            {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
            {isGenerating ? 'Building…' : 'Generate'}
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">SCRIPT TONE / STYLE</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.entries(TONE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = tone === key;
            return (
              <button
                key={key}
                onClick={() => setTone(key)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 border transition-all duration-300 ${
                  active
                    ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md scale-[1.02]'
                    : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80'
                }`}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span className="text-[11px] font-medium text-center leading-tight">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {script && (
        <div className="space-y-5 animate-[fadein_0.4s_ease]">
          <div className="rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-4 flex flex-wrap gap-2 items-center text-xs text-[#6B665C]">
            <span className="rounded-full bg-[#EEF2EB] text-[#5B6B57] px-3 py-1 font-medium">{script.categoryLabel}</span>
            <span className="rounded-full bg-[#F3EFFA] text-[#5B4F8A] px-3 py-1 font-medium">{script.toneLabel}</span>
            <span className="italic">{script.pacing}</span>
          </div>

          <ScriptSection label="MULTI-HOOK MATRIX" sub="3 alternate openings" color="#C9BFE8" bg="#F3EFFA" icon={Sparkles}>
            <div className="space-y-3">
              {script.hooks.map((h, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#C9BFE8]/40 text-[#5B4F8A] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-[#3A3733] leading-relaxed text-sm">{h}</p>
                </div>
              ))}
            </div>
          </ScriptSection>

          <ScriptSection label="VISUAL STORYBOARD FLOW" sub="shot-by-shot, timestamped" color="#A8B79D" bg="#EEF2EB" icon={Film}>
            <div className="space-y-3">
              {script.storyboard.map((beat, i) => (
                <div key={i} className="rounded-xl bg-white/70 border border-[#EDE8DC] p-4">
                  <p className="text-xs font-bold text-[#8DA184] tracking-wider mb-2">{beat.time}</p>
                  <div className="space-y-1.5 text-sm text-[#3A3733]">
                    <p className="flex gap-2"><Camera size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[On-Camera Action]</span> {beat.onCamera}</span></p>
                    <p className="flex gap-2"><MonitorPlay size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[B-Roll Layer]</span> {beat.bRoll}</span></p>
                    <p className="flex gap-2"><Type size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[Text on Screen]</span> {beat.textOverlay}</span></p>
                    <p className="flex gap-2"><Mic size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[Audio/SFX]</span> {beat.audio}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </ScriptSection>

          <ScriptSection label="CONVERSION CTA MATRIX" sub="engagement · shares · sales" color="#E9C9C0" bg="#FBF1EE" icon={Clapperboard}>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Engagement:</span> {script.ctas.engagement}</p>
              </div>
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <Share2 size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Share:</span> {script.ctas.share}</p>
              </div>
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <ShoppingBag size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Sales:</span> {script.ctas.sales}</p>
              </div>
            </div>
          </ScriptSection>
        </div>
      )}
    </div>
  );
}

function ScriptSection({ label, sub, color, bg, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-[#E4DFD3] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: bg }}>
        <Icon size={16} style={{ color }} />
        <span className="text-xs font-bold tracking-wider text-[#3A3733]">{label}</span>
        <span className="text-xs text-[#8A8578] ml-auto">{sub}</span>
      </div>
      <div className="p-4 sm:p-5 bg-white/40">{children}</div>
    </div>
  );
}

/* ========================================================================= */
/* TAB 3 — VIRAL CAPTION STUDIO & META ENGAGEMENT KIT                        */
/* ========================================================================= */
function mapUnicode(str, upperBase, lowerBase, digitBase) {
  return str
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(upperBase + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(lowerBase + (code - 97));
      if (digitBase && code >= 48 && code <= 57) return String.fromCodePoint(digitBase + (code - 48));
      return ch;
    })
    .join('');
}

const DOUBLE_STRUCK_UPPER = {
  A: 0x1d538, B: 0x1d539, C: 0x2102, D: 0x1d53b, E: 0x1d53c, F: 0x1d53d, G: 0x1d53e,
  H: 0x210d, I: 0x1d540, J: 0x1d541, K: 0x1d542, L: 0x1d543, M: 0x1d544, N: 0x2115,
  O: 0x1d546, P: 0x2119, Q: 0x211a, R: 0x211d, S: 0x1d54a, T: 0x1d54b, U: 0x1d54c,
  V: 0x1d54d, W: 0x1d54e, X: 0x1d54f, Y: 0x1d550, Z: 0x2124,
};

function mapDoubleStruck(str) {
  return str
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90 && DOUBLE_STRUCK_UPPER[ch]) {
        return String.fromCodePoint(DOUBLE_STRUCK_UPPER[ch]);
      }
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d552 + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7d8 + (code - 48));
      return ch;
    })
    .join('');
}

const UNICODE_STYLES = {
  serifBold: (s) => mapUnicode(s, 0x1d400, 0x1d41a, 0x1d7ce),
  sansSlanted: (s) => mapUnicode(s, 0x1d608, 0x1d622, null),
  doubleStruck: (s) => mapDoubleStruck(s),
};

function addAestheticBreaks(text) {
  const separators = ['⋆.˚', '✦', '˖°', '⋆'];
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) {
    return text
      .split(/,\s*/)
      .filter(Boolean)
      .join(`\n\n${separators[0]}\n\n`);
  }
  return sentences
    .map((s, i) => `${s}\n\n${separators[i % separators.length]}`)
    .join('\n\n')
    .trim();
}

const HASHTAG_LIBRARY = {
  travel: ['#traveldiaries', '#wanderlust', '#explorepage', '#travelgram', '#tripgoals', '#hiddengems', '#passportready', '#travelvibes'],
  food: ['#foodie', '#foodstagram', '#homemade', '#recipeoftheday', '#foodphotography', '#tastythings', '#comfortfood', '#foodblogger'],
  fitness: ['#fitnessmotivation', '#gymlife', '#workoutroutine', '#fitfam', '#trainhard', '#strongnotskinny', '#fitnessjourney', '#gainz'],
  study: ['#studygram', '#productivity', '#studymotivation', '#examprep', '#focusmode', '#studytips', '#academicweapon', '#dailygrind'],
  code: ['#coding', '#developerlife', '#programming', '#techtok', '#buildinpublic', '#softwareengineer', '#100daysofcode', '#devcommunity'],
  beauty: ['#skincare', '#glowup', '#selfcaresunday', '#makeuplook', '#beautytips', '#skincareroutine', '#naturalglow', '#getreadywithme'],
  fashion: ['#ootd', '#stylegoals', '#fashionlover', '#outfitinspo', '#streetstyle', '#lookbook', '#trendalert', '#aestheticoutfit'],
  general: ['#aesthetic', '#dailyvibes', '#contentcreator', '#momentslikethese', '#slowliving', '#viral', '#reelsinstagram', '#explore'],
};

function generateHashtags(caption) {
  const lower = caption.toLowerCase();
  const categoryMatch = [
    { key: 'travel', words: ['travel', 'trip', 'vacation', 'flight', 'explore'] },
    { key: 'food', words: ['food', 'recipe', 'cook', 'eat', 'kitchen'] },
    { key: 'fitness', words: ['gym', 'workout', 'fitness', 'exercise', 'training'] },
    { key: 'study', words: ['study', 'exam', 'focus', 'productivity', 'college'] },
    { key: 'code', words: ['code', 'coding', 'developer', 'programming', 'software'] },
    { key: 'beauty', words: ['skin', 'makeup', 'beauty', 'glow', 'skincare'] },
    { key: 'fashion', words: ['outfit', 'fashion', 'style', 'wear', 'ootd'] },
  ].find((c) => c.words.some((w) => lower.includes(w)));

  const category = categoryMatch ? categoryMatch.key : 'general';
  const niche = HASHTAG_LIBRARY[category];
  const general = HASHTAG_LIBRARY.general.filter((h) => !niche.includes(h));
  return [...niche.slice(0, 6), ...general.slice(0, 4)];
}

function computeViralScore(text, hashtags) {
  if (!text || !text.trim()) {
    return { score: 0, tips: ['Start typing your caption to see your Viral Potential Score.'] };
  }
  const tips = [];
  let score = 50;

  const trimmed = text.trim();
  const len = trimmed.length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const lineBreaks = (trimmed.match(/\n/g) || []).length;
  const emojiMatches = trimmed.match(/\p{Extended_Pictographic}/gu) || [];
  const emojiCount = emojiMatches.length;
  const emojiDensity = emojiCount / wordCount;
  const firstLine = trimmed.split('\n')[0] || '';
  const hasQuestionOpener = /\?/.test(firstLine);
  const ctaWords = ['comment', 'share', 'save', 'follow', 'tag', 'link in bio', 'dm me', 'let me know'];
  const lowerText = trimmed.toLowerCase();
  const hasCTA = ctaWords.some((w) => lowerText.includes(w));
  const firstLineHasCTA = ctaWords.some((w) => firstLine.toLowerCase().includes(w));
  const avgWordLen = words.reduce((a, w) => a + w.length, 0) / wordCount;

  if (len >= 60 && len <= 150) {
    score += 12;
  } else if (len < 30) {
    score -= 10;
    tips.push('Your caption is quite short — add a bit more context to boost watch-through.');
  } else if (len > 300) {
    score -= 8;
    tips.push('Caption is long — trim it or move extra detail to the first comment.');
  }

  if (lineBreaks >= 2) {
    score += 10;
  } else {
    tips.push('Add more line breaks — dense text blocks lower readability on mobile.');
  }

  if (emojiDensity > 0.02 && emojiDensity < 0.25) {
    score += 10;
  } else if (emojiCount === 0) {
    score -= 5;
    tips.push('Add 1-2 emojis to increase scroll-stopping power.');
  } else if (emojiDensity >= 0.25) {
    score -= 6;
    tips.push('Too many emojis can look spammy — dial it back a little.');
  }

  if (hasQuestionOpener) {
    score += 8;
  } else {
    tips.push('Open with a question or bold statement to hook readers instantly.');
  }

  if (hasCTA) {
    score += 10;
    if (!firstLineHasCTA) {
      tips.push('Move your CTA higher — the first line gets the most attention.');
    }
  } else {
    tips.push('Add a clear call-to-action like "comment below" or "save this".');
  }

  if (hashtags && hashtags.length >= 5 && hashtags.length <= 15) {
    score += 10;
  } else if (!hashtags || hashtags.length === 0) {
    tips.push('Generate a hashtag stack to widen your reach.');
  }

  if (avgWordLen <= 6) {
    score += 5;
  } else {
    tips.push('Simplify some longer words for easier skimming.');
  }

  score = clamp(Math.round(score), 4, 98);
  if (tips.length === 0) tips.push('Great structure! This caption is optimized for maximum reach.');
  return { score, tips: tips.slice(0, 4) };
}

function formatInstagram(text, hashtags) {
  const spacer = '.\n.\n.\n.\n.\n';
  return `${text.trim()}\n\n${spacer}${hashtags.join(' ')}`;
}
function formatTikTok(text, hashtags) {
  const firstLine = text.trim().split('\n')[0];
  return `${firstLine}\n${hashtags.slice(0, 10).join(' ')}`;
}
function formatYouTubeShorts(text, hashtags) {
  const title = text.trim().split('\n')[0].slice(0, 80);
  const body = text.trim();
  return `${title}\n\n${body}\n\n🔔 Subscribe for more!\n\n${hashtags.slice(0, 3).join(' ')}`;
}

const PLATFORM_PRESETS = {
  instagram: { label: 'Instagram Reel', icon: Instagram, format: formatInstagram },
  tiktok: { label: 'TikTok', icon: Music2, format: formatTikTok },
  youtube: { label: 'YouTube Shorts', icon: Youtube, format: formatYouTubeShorts },
};

function ScoreRing({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#8DA184' : score >= 45 ? '#D8B26A' : '#C97B6A';
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#EDE8DC" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#2B2A28]">{score}%</span>
        <span className="text-[9px] text-[#8A8578] tracking-wide">VIRAL SCORE</span>
      </div>
    </div>
  );
}

function CaptionStudio() {
  const [raw, setRaw] = useState('');
  const [output, setOutput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState('instagram');

  const applyBreaks = () => setOutput(addAestheticBreaks(output || raw));
  const applyStyle = (styleKey) => setOutput(UNICODE_STYLES[styleKey](output || raw));
  const applyHashtags = () => setHashtags(generateHashtags(output || raw));

  const baseText = output || raw;
  const { score, tips } = useMemo(() => computeViralScore(baseText, hashtags), [baseText, hashtags]);

  const formattedForPlatform = useMemo(() => {
    if (!baseText.trim()) return '';
    return PLATFORM_PRESETS[platform].format(baseText, hashtags.length ? hashtags : generateHashtags(baseText));
  }, [baseText, hashtags, platform]);

  const handleCopy = async () => {
    const finalText = formattedForPlatform || baseText;
    try {
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Raw caption</label>
        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setOutput(e.target.value); }}
          rows={4}
          placeholder="Type or paste your caption here…"
          className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition resize-none"
        />
      </div>

      <div className="rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-5 flex flex-col sm:flex-row items-center gap-5">
        <ScoreRing score={score} />
        <div className="flex-1 space-y-1.5 w-full">
          <p className="text-xs font-bold tracking-wider text-[#8A8578] flex items-center gap-1.5"><Gauge size={13} /> LIVE ENGAGEMENT PREDICTOR</p>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-[#6B665C] flex gap-1.5">
                <span className="text-[#C9BFE8]">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton icon={Type} label="Aesthetic line breaks" onClick={applyBreaks} />
        <ToolButton icon={Sparkles} label="Serif bold" onClick={() => applyStyle('serifBold')} />
        <ToolButton icon={Sparkles} label="Sans slanted" onClick={() => applyStyle('sansSlanted')} />
        <ToolButton icon={Sparkles} label="Double-struck" onClick={() => applyStyle('doubleStruck')} />
        <ToolButton icon={Hash} label="Hashtag stack" onClick={applyHashtags} />
      </div>

      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">PLATFORM PRESET</p>
        <div className="grid grid-cols-3 gap-2.5">
          {Object.entries(PLATFORM_PRESETS).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = platform === key;
            return (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-2 border text-xs font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md'
                    : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80'
                }`}
              >
                <Icon size={15} /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E4DFD3] bg-white/70 p-5 space-y-4">
        <p className="text-xs font-bold tracking-wider text-[#8A8578]">OUTPUT · {PLATFORM_PRESETS[platform].label.toUpperCase()} FORMAT</p>
        <p className="whitespace-pre-wrap text-[#3A3733] leading-relaxed min-h-[60px] text-sm">
          {formattedForPlatform || 'Your formatted caption will appear here…'}
        </p>
      </div>

      <button
        onClick={handleCopy}
        disabled={!baseText.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'One-Click Copy'}
      </button>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-[#E4DFD3] bg-white/60 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-[#3A3733] hover:border-[#C9BFE8] hover:bg-[#F3EFFA] active:scale-[0.95] transition-all duration-200"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/* ========================================================================= */
/* ROOT COMPONENT                                                            */
/* ========================================================================= */
const TABS = [
  { key: 'story', label: 'Story Engine', icon: ImageIcon },
  { key: 'script', label: 'Script Builder', icon: Clapperboard },
  { key: 'caption', label: 'Caption Studio', icon: Type },
];

export default function AestheticSocialKitApp() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div
      className="min-h-screen w-full bg-[#F5F1E8]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E4DFD3] px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles size={14} className="text-[#A8909E]" />
            <span className="text-xs font-medium text-[#5B6B57] tracking-wide">PRO SUITE · ZERO BACKEND · RUNS FULLY IN-BROWSER</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-[#2B2A28] tracking-tight"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            Aesthetic Social Kit
          </h1>
          <p className="text-[#6B665C] mt-2 max-w-xl mx-auto sm:mx-0">
            Animated story assets, a viral psychology script engine, and a full engagement dashboard — all on one screen.
          </p>
        </header>

        <nav className="flex gap-2 mb-8 bg-white/50 backdrop-blur-sm border border-[#E4DFD3] rounded-2xl p-1.5 max-w-xl mx-auto sm:mx-0 overflow-x-auto shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-all duration-300 ${
                  active ? 'bg-[#2B2A28] text-[#F5F1E8] shadow-md scale-[1.01]' : 'text-[#6B665C] hover:bg-white/70'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </nav>

        <main className="bg-white/40 backdrop-blur-sm border border-[#E4DFD3] rounded-3xl p-5 sm:p-8 shadow-sm">
          {activeTab === 'story' && <StoryGenerator />}
          {activeTab === 'script' && <ScriptBuilder />}
          {activeTab === 'caption' && <CaptionStudio />}
        </main>

        <footer className="text-center text-xs text-[#8A8578] mt-8">
          No backend, no database — everything runs client-side. Deploy straight to Vercel.
        </footer>
      </div>
    </div>
  );
}
