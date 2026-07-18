'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Gift, Upload, X, Link2, Check, Download, Loader2, PartyPopper,
  Sparkle, Cake, Flame, AlertCircle
} from 'lucide-react';
import {
  initThemeParticles, drawGiftFrame, GIFT_CANVAS_W, GIFT_CANVAS_H, getGiftRevealDuration,
} from '../lib/birthdayGiftEngine';
import { encodeGiftPayload, compressImageForLink, resizeImageForCanvas } from '../lib/giftLink';

const THEMES = {
  balloons: { label: 'Balloons', icon: PartyPopper },
  confetti: { label: 'Confetti', icon: Sparkle },
  cake: { label: 'Candles', icon: Cake },
  fireworks: { label: 'Fireworks', icon: Flame },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function BirthdayGiftMaker() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('balloons');
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoObj, setPhotoObj] = useState(null);
  const [includePhotoInLink, setIncludePhotoInLink] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);
  const [isBuildingLink, setIsBuildingLink] = useState(false);
  const [linkWarning, setLinkWarning] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState('');
  const [justExportedImage, setJustExportedImage] = useState(false);

  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const particlesRef = useRef(initThemeParticles('balloons'));
  const paramsRef = useRef({ name: '', age: '', message: '', photoImg: null, theme: 'balloons' });

  useEffect(() => {
    paramsRef.current = { name, age, message, photoImg: photoObj, theme };
  }, [name, age, message, photoObj, theme]);

  useEffect(() => {
    particlesRef.current = initThemeParticles(theme);
  }, [theme]);

  useEffect(() => {
    if (!photoSrc) { setPhotoObj(null); return; }
    let cancelled = false;
    (async () => {
      const resized = await resizeImageForCanvas(photoSrc, 800, 0.85);
      const img = await loadImage(resized);
      if (!cancelled) setPhotoObj(img);
    })();
    return () => { cancelled = true; };
  }, [photoSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    startTimeRef.current = performance.now();

    const loop = (now) => {
      const elapsed = now - startTimeRef.current;
      drawGiftFrame(ctx, paramsRef.current, {
        elapsed,
        particles: particlesRef.current,
        exportMode: false,
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCopyLink = async () => {
    setIsBuildingLink(true);
    setLinkWarning('');
    try {
      const payload = { n: name || 'Friend', a: age || '', m: message || '', t: theme };
      if (includePhotoInLink && photoSrc) {
        payload.p = await compressImageForLink(photoSrc, 110, 0.45);
      }
      const encoded = encodeGiftPayload(payload);
      const url = `${window.location.origin}${window.location.pathname}#gift=${encoded}`;
      if (url.length > 7000) {
        setLinkWarning('This link is quite long because of the photo — some apps may truncate it. Consider unchecking "include photo".');
      }
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch (e) {
      setLinkWarning('Could not build the link — please try again.');
    } finally {
      setIsBuildingLink(false);
    }
  };

  const handleExportVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    setExportedUrl('');

    const stream = canvas.captureStream(30);
    let mimeType = 'video/webm;codecs=vp9';
    if (typeof MediaRecorder === 'undefined') {
      setIsExporting(false);
      return;
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setIsExporting(false);
    };
    startTimeRef.current = performance.now();
    recorder.start();
    const recordDuration = getGiftRevealDuration(message) + 900;
    setTimeout(() => {
      recorder.stop();
      startTimeRef.current = performance.now();
    }, recordDuration);
  };

  const handleDownloadVideo = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    a.download = `birthday-gift-${Date.now()}.webm`;
    a.click();
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawGiftFrame(ctx, paramsRef.current, {
      elapsed: 0,
      particles: particlesRef.current,
      exportMode: true,
    });
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthday-gift-${Date.now()}.jpg`;
    a.click();
    setJustExportedImage(true);
    setTimeout(() => setJustExportedImage(false), 1800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">CHOOSE A THEME</p>
          <div className="grid grid-cols-4 gap-2.5">
            {Object.entries(THEMES).map(([key, cfg]) => {
              const Icon = cfg.icon;
              const active = theme === key;
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl py-3.5 px-2 border transition-all duration-300 ${
                    active
                      ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md scale-[1.02]'
                      : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80'
                  }`}
                >
                  <Icon size={20} strokeWidth={1.7} />
                  <span className="text-[11px] font-medium">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Recipient's name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya"
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Turning (age) — optional</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
              placeholder="e.g. 21"
              inputMode="numeric"
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Write your birthday wish here…"
              className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Photo (optional)</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] px-4 py-3 text-sm font-medium text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-95 transition-all duration-150"
              >
                <Upload size={16} /> {photoSrc ? 'Change photo' : 'Upload photo'}
              </button>
              {photoSrc && (
                <button
                  onClick={() => { setPhotoSrc(null); setPhotoObj(null); setIncludePhotoInLink(false); }}
                  className="flex items-center gap-1 rounded-xl px-3 py-3 text-sm text-[#8A7267] hover:bg-[#F3EFEA] active:scale-95 transition-all duration-150"
                >
                  <X size={16} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-4 space-y-3">
          <p className="text-xs font-bold tracking-wider text-[#8A8578] flex items-center gap-1.5"><Link2 size={13} /> SHAREABLE LINK — NO ACCOUNT, NO SERVER</p>
          {photoSrc && (
            <label className="flex items-center gap-2 text-xs text-[#6B665C] cursor-pointer">
              <input
                type="checkbox"
                checked={includePhotoInLink}
                onChange={(e) => setIncludePhotoInLink(e.target.checked)}
                className="accent-[#8DA184]"
              />
              Include a small photo thumbnail in the link (makes it longer)
            </label>
          )}
          <button
            onClick={handleCopyLink}
            disabled={isBuildingLink}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#A8B79D] bg-[#EEF2EB] text-[#5B6B57] py-3 font-medium hover:bg-[#E4EBDF] active:scale-[0.97] transition-all duration-200 disabled:opacity-60"
          >
            {isBuildingLink ? <Loader2 size={17} className="animate-spin" /> : linkCopied ? <Check size={17} /> : <Link2 size={17} />}
            {linkCopied ? 'Link copied!' : 'Copy Shareable Gift Link'}
          </button>
          {linkWarning && (
            <p className="flex items-center gap-1.5 text-xs text-[#C97B6A]"><AlertCircle size={13} /> {linkWarning}</p>
          )}
          <p className="text-xs text-[#8A8578]">
            The whole gift is encoded inside the link itself — nothing is uploaded anywhere, so it stays private between you and whoever you send it to.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExportVideo}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md disabled:opacity-60"
          >
            {isExporting ? <Loader2 size={17} className="animate-spin" /> : <Gift size={17} />}
            {isExporting ? 'Recording…' : 'Export Video'}
          </button>
          <button
            onClick={handleDownloadImage}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E4DFD3] bg-white/60 text-[#3A3733] py-3.5 font-medium hover:bg-white active:scale-[0.97] transition-all duration-200"
          >
            {justExportedImage ? <Check size={17} /> : <Download size={17} />}
            {justExportedImage ? 'Saved!' : 'Download Card'}
          </button>
        </div>
        {exportedUrl && (
          <button
            onClick={handleDownloadVideo}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#A8B79D] bg-[#EEF2EB] text-[#5B6B57] py-3 font-medium hover:bg-[#E4EBDF] active:scale-[0.97] transition-all duration-200"
          >
            <Download size={17} /> Download Video (WebM)
          </button>
        )}
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[300px]">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5"
            style={{ aspectRatio: '9 / 16' }}
          >
            <canvas ref={canvasRef} width={GIFT_CANVAS_W} height={GIFT_CANVAS_H} className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Live preview · 1080×1920 HD</p>
        </div>
      </div>
    </div>
  );
}
