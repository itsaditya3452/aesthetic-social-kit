'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, Download, Upload, Cake, Quote, Plane, Clapperboard,
  Type, Hash, Copy, Check, Wand2, Image as ImageIcon, Film, X
} from 'lucide-react';
import { generateScript } from '../lib/scriptLibrary';

/* ----------------------------------------------------------------------- */
/* FONT LOADING                                                             */
/* ----------------------------------------------------------------------- */
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

/* ----------------------------------------------------------------------- */
/* CANVAS HELPERS                                                           */
/* ----------------------------------------------------------------------- */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(ctx, img, x, y, w, h, radius = 0) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  if (radius > 0) {
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = 'center') {
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
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.textAlign = align;
    ctx.fillText(l, x, startY + i * lineHeight);
  });
  return lines.length;
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

/* ----------------------------------------------------------------------- */
/* TEMPLATE DRAW FUNCTIONS  (canvas is 1080 x 1920 — true HD 9:16)          */
/* ----------------------------------------------------------------------- */
const W = 1080;
const H = 1920;

function drawBirthday(ctx, { name, message, img }) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#F6E9E4');
  grad.addColorStop(0.5, '#EFE6F4');
  grad.addColorStop(1, '#E4EEE0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#ffffff';
  const sparkles = [[130,180,6],[930,260,4],[860,1650,5],[150,1500,4],[520,120,3],[960,900,4],[110,860,3]];
  sparkles.forEach(([sx, sy, r]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, r * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.font = '600 34px "Space Grotesk"';
  ctx.fillStyle = '#B98C7A';
  ctx.textAlign = 'center';
  ctx.fillText('✦ IT’S A CELEBRATION ✦', W / 2, 130);

  const cardX = 90, cardY = 210, cardW = W - 180, cardH = 1330;
  ctx.save();
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
  const photoY = cardY + photoPad;

  if (img) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, 6);
  } else {
    ctx.fillStyle = '#EFE3DD';
    roundRectPath(ctx, photoX, photoY, photoW, photoH, 6);
    ctx.fill();
    ctx.font = '600 100px "Space Grotesk"';
    ctx.fillStyle = '#D8C3B8';
    ctx.textAlign = 'center';
    ctx.fillText('🎂', W / 2, photoY + photoH / 2 + 35);
  }

  ctx.font = 'italic 500 64px "Fraunces"';
  ctx.fillStyle = '#3A2E2A';
  ctx.textAlign = 'center';
  wrapText(ctx, name || 'Happy Birthday!', W / 2, photoY + photoH + 110, cardW - 100, 68);

  ctx.font = '600 38px "Caveat"';
  ctx.fillStyle = '#8A7267';
  wrapText(ctx, message || 'wishing you the best day ever 🎈', W / 2, photoY + photoH + 215, cardW - 140, 46);

  ctx.font = '400 26px "Space Grotesk"';
  ctx.fillStyle = '#C9A9A0';
  ctx.fillText('— made with the aesthetic kit —', W / 2, cardY + cardH - 35);
}

function drawQuote(ctx, { name, message, img }) {
  if (img) {
    drawImageCover(ctx, img, 0, 0, W, H);
    const overlay = ctx.createLinearGradient(0, 0, 0, H);
    overlay.addColorStop(0, 'rgba(20,18,16,0.55)');
    overlay.addColorStop(1, 'rgba(20,18,16,0.75)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = '#1E1C1A';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  ctx.font = '700 160px "Fraunces"';
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.textAlign = 'center';
  ctx.fillText('“', W / 2, 480);

  ctx.font = 'italic 500 66px "Fraunces"';
  ctx.fillStyle = '#FBF8F3';
  wrapText(ctx, message || 'Quiet minds are the loudest creators.', W / 2, H / 2 - 40, W - 220, 84);

  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 60, H / 2 + 230);
  ctx.lineTo(W / 2 + 60, H / 2 + 230);
  ctx.stroke();

  ctx.font = '600 32px "Space Grotesk"';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText((name || 'your name').toUpperCase().split('').join(' '), W / 2, H / 2 + 300);
}

function drawTravel(ctx, { name, message, img }) {
  if (img) {
    drawImageCover(ctx, img, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#9FC6D8');
    grad.addColorStop(1, '#4E7C93');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
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
  }

  const overlay = ctx.createLinearGradient(0, H * 0.45, 0, H);
  overlay.addColorStop(0, 'rgba(10,10,10,0)');
  overlay.addColorStop(1, 'rgba(10,10,10,0.78)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, H * 0.45, W, H * 0.55);

  const pillW = 300, pillH = 76;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundRectPath(ctx, 60, 70, pillW, pillH, pillH / 2);
  ctx.fill();
  drawPin(ctx, 60 + 44, 70 + pillH / 2, 20, '#4E7C93');
  ctx.font = '600 30px "Space Grotesk"';
  ctx.fillStyle = '#2B2A28';
  ctx.textAlign = 'left';
  ctx.fillText((name || 'somewhere new').slice(0, 16), 60 + 78, 70 + pillH / 2 + 10);

  ctx.textAlign = 'center';
  ctx.font = '700 84px "Space Grotesk"';
  ctx.fillStyle = '#FFFFFF';
  wrapText(ctx, message || 'chasing new horizons', W / 2, H - 260, W - 160, 92);

  ctx.font = '500 28px "Space Grotesk"';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('✦ TRAVEL DIARIES ✦', W / 2, H - 110);
}

const TEMPLATES = {
  birthday: { label: 'Birthday Bash', icon: Cake, draw: drawBirthday },
  quote: { label: 'Minimalist Quote', icon: Quote, draw: drawQuote },
  travel: { label: 'Travel Vibe', icon: Plane, draw: drawTravel },
};

/* ----------------------------------------------------------------------- */
/* TAB 1 — STORY GENERATOR                                                  */
/* ----------------------------------------------------------------------- */
function StoryGenerator() {
  const fontsReady = useGoogleFonts();
  const [template, setTemplate] = useState('birthday');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [imgSrc, setImgSrc] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!imgSrc) { setImgObj(null); return; }
    let cancelled = false;
    loadImage(imgSrc).then((img) => { if (!cancelled) setImgObj(img); });
    return () => { cancelled = true; };
  }, [imgSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    TEMPLATES[template].draw(ctx, { name, message, img: imgObj });
  }, [template, name, message, imgObj]);

  useEffect(() => { if (fontsReady) draw(); }, [fontsReady, draw]);

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
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `story-${template}-${Date.now()}.jpg`;
    a.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">CHOOSE AN OCCASION</p>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TEMPLATES).map(([key, t]) => {
              const Icon = t.icon;
              const active = template === key;
              return (
                <button
                  key={key}
                  onClick={() => setTemplate(key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-4 px-2 border transition-all duration-300 ${
                    active
                      ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-lg scale-[1.02]'
                      : 'bg-white/60 border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.6} />
                  <span className="text-xs font-medium text-center leading-tight">{t.label}</span>
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
                className="flex items-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] px-4 py-3 text-sm font-medium text-[#5B4F8A] hover:bg-[#EAE3F7] transition"
              >
                <Upload size={16} /> {imgSrc ? 'Change image' : 'Upload image'}
              </button>
              {imgSrc && (
                <button
                  onClick={() => { setImgSrc(null); setImgObj(null); }}
                  className="flex items-center gap-1 rounded-xl px-3 py-3 text-sm text-[#8A7267] hover:bg-[#F3EFEA] transition"
                >
                  <X size={16} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          <Download size={18} /> Download Story (HD JPG)
        </button>
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[300px]">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            style={{ aspectRatio: '9 / 16' }}
          >
            <canvas ref={canvasRef} width={W} height={H} className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Live preview · 1080×1920 HD</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* TAB 2 — SCRIPT FLOW BUILDER                                              */
/* ----------------------------------------------------------------------- */
function ScriptBuilder() {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setScript(generateScript(topic));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Video topic / idea</label>
        <div className="flex gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. coding, skincare, gym, travel vlog…"
            className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-5 py-3 font-medium hover:bg-[#413F3B] active:scale-[0.98] transition-all duration-200 shrink-0"
          >
            <Wand2 size={17} /> Generate
          </button>
        </div>
      </div>

      {script && (
        <div className="space-y-4">
          <ScriptSection label="THE HOOK" time="0–3s" color="#C9BFE8" bg="#F3EFFA" icon={Sparkles}>
            <p className="text-[#3A3733] leading-relaxed">{script.hook}</p>
          </ScriptSection>

          <ScriptSection label="RETENTION BODY" time="3–20s" color="#A8B79D" bg="#EEF2EB" icon={Film}>
            <ol className="space-y-3">
              {script.body.map((line, i) => (
                <li key={i} className="flex gap-3 text-[#3A3733] leading-relaxed">
                  <span className="text-[#8DA184] font-semibold shrink-0">{i + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </ScriptSection>

          <ScriptSection label="CTA / REWARD" time="last 3s" color="#E9C9C0" bg="#FBF1EE" icon={Clapperboard}>
            <p className="text-[#3A3733] leading-relaxed">[Direct to camera] {script.cta}</p>
          </ScriptSection>
        </div>
      )}
    </div>
  );
}

function ScriptSection({ label, time, color, bg, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-[#E4DFD3] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: bg }}>
        <Icon size={16} style={{ color }} />
        <span className="text-xs font-bold tracking-wider text-[#3A3733]">{label}</span>
        <span className="text-xs text-[#8A8578] ml-auto">{time}</span>
      </div>
      <div className="p-5 bg-white/60">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* TAB 3 — CAPTION & FORMATTING STUDIO                                      */
/* ----------------------------------------------------------------------- */
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

const UNICODE_STYLES = {
  bold: (s) => mapUnicode(s, 0x1d400, 0x1d41a, 0x1d7ce),
  italicSerif: (s) => mapUnicode(s, 0x1d434, 0x1d44e, null),
  sansBold: (s) => mapUnicode(s, 0x1d5d4, 0x1d5ee, 0x1d7ec),
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

function CaptionStudio() {
  const [raw, setRaw] = useState('');
  const [output, setOutput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [copied, setCopied] = useState(false);

  const applyBreaks = () => setOutput(addAestheticBreaks(output || raw));
  const applyStyle = (styleKey) => setOutput(UNICODE_STYLES[styleKey](output || raw));
  const applyHashtags = () => setHashtags(generateHashtags(output || raw));

  const finalText = [output || raw, hashtags.length ? hashtags.join(' ') : ''].filter(Boolean).join('\n\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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

      <div className="flex flex-wrap gap-2">
        <ToolButton icon={Type} label="Aesthetic line breaks" onClick={applyBreaks} />
        <ToolButton icon={Sparkles} label="Bold" onClick={() => applyStyle('bold')} />
        <ToolButton icon={Sparkles} label="Italic serif" onClick={() => applyStyle('italicSerif')} />
        <ToolButton icon={Sparkles} label="Sans bold" onClick={() => applyStyle('sansBold')} />
        <ToolButton icon={Hash} label="Hashtag stack" onClick={applyHashtags} />
      </div>

      <div className="rounded-2xl border border-[#E4DFD3] bg-white/70 p-5 space-y-4">
        <p className="text-xs font-bold tracking-wider text-[#8A8578]">OUTPUT</p>
        <p className="whitespace-pre-wrap text-[#3A3733] leading-relaxed min-h-[60px]">
          {output || raw || 'Your formatted caption will appear here…'}
        </p>
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EDE8DC]">
            {hashtags.map((h) => (
              <span key={h} className="text-xs rounded-full bg-[#EEF2EB] text-[#5B6B57] px-3 py-1 font-medium">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleCopy}
        disabled={!finalText.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'One-Click Copy to Instagram'}
      </button>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-[#E4DFD3] bg-white/60 px-4 py-2.5 text-sm font-medium text-[#3A3733] hover:border-[#C9BFE8] hover:bg-[#F3EFFA] active:scale-[0.97] transition-all duration-200"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/* ----------------------------------------------------------------------- */
/* ROOT COMPONENT                                                           */
/* ----------------------------------------------------------------------- */
const TABS = [
  { key: 'story', label: 'Story Generator', icon: ImageIcon },
  { key: 'script', label: 'Script Builder', icon: Clapperboard },
  { key: 'caption', label: 'Caption Studio', icon: Type },
];

export default function AestheticSocialKit() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div
      className="min-h-screen w-full bg-[#F5F1E8]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#E4DFD3] px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-[#A8909E]" />
            <span className="text-xs font-medium text-[#5B6B57] tracking-wide">ZERO SETUP · RUNS FULLY IN-BROWSER</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-[#2B2A28] tracking-tight"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            Aesthetic Social Kit
          </h1>
          <p className="text-[#6B665C] mt-2 max-w-xl mx-auto sm:mx-0">
            Your instant status engine — design stories, script reels, and format captions, all on one screen.
          </p>
        </header>

        <nav className="flex gap-2 mb-8 bg-white/50 border border-[#E4DFD3] rounded-2xl p-1.5 max-w-xl mx-auto sm:mx-0 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-all duration-300 ${
                  active ? 'bg-[#2B2A28] text-[#F5F1E8] shadow-md' : 'text-[#6B665C] hover:bg-white/70'
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </nav>

        <main className="bg-white/40 border border-[#E4DFD3] rounded-3xl p-5 sm:p-8 backdrop-blur-sm">
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
