'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Download, Check, Loader2 } from 'lucide-react';
import { drawMediaKit, KIT_W, KIT_H } from '../lib/mediaKitEngine';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const initialForm = {
  name: '',
  handle: '',
  niche: '',
  followers: '',
  avgLikes: '',
  avgComments: '',
  audienceAge: '',
  audienceGender: '',
  brands: '',
  contactEmail: '',
  ratePost: '',
  rateReel: '',
  rateStory: '',
};

function Field({ label, value, onChange, placeholder, type = 'text', half }) {
  return (
    <div className={half ? '' : 'sm:col-span-2'}>
      <label className="text-xs font-medium text-[#5B6B57] mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#E4DFD3] bg-white/70 px-3.5 py-2.5 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
      />
    </div>
  );
}

export default function MediaKitGenerator() {
  const [form, setForm] = useState(initialForm);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoObj, setPhotoObj] = useState(null);
  const [justExported, setJustExported] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([
          document.fonts.load('600 46px "Fraunces"'),
          document.fonts.load('700 44px "Space Grotesk"'),
          document.fonts.load('500 30px "Space Grotesk"'),
        ]);
        await document.fonts.ready;
      } catch (e) { /* fallback fonts still work */ }
      if (!cancelled) setFontsReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!photoSrc) { setPhotoObj(null); return; }
    let cancelled = false;
    loadImage(photoSrc).then((img) => { if (!cancelled) setPhotoObj(img); });
    return () => { cancelled = true; };
  }, [photoSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawMediaKit(ctx, {
      ...form,
      followers: Number(form.followers) || 0,
      avgLikes: Number(form.avgLikes) || 0,
      avgComments: Number(form.avgComments) || 0,
    }, photoObj);
  }, [form, photoObj]);

  useEffect(() => { if (fontsReady) draw(); }, [fontsReady, draw]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleExport = () => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `media-kit-${Date.now()}.jpg`;
    a.click();
    setJustExported(true);
    setTimeout(() => setJustExported(false), 1800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-2">Profile photo</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] px-4 py-2.5 text-sm font-medium text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-95 transition-all duration-150"
            >
              <Upload size={15} /> {photoSrc ? 'Change photo' : 'Upload photo'}
            </button>
            {photoSrc && (
              <button onClick={() => { setPhotoSrc(null); setPhotoObj(null); }} className="flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm text-[#8A7267] hover:bg-[#F3EFEA] transition">
                <X size={15} /> Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-3">CREATOR INFO</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field half label="Name" value={form.name} onChange={set('name')} placeholder="Priya Sharma" />
            <Field half label="Handle" value={form.handle} onChange={set('handle')} placeholder="priyacreates" />
            <Field label="Niche" value={form.niche} onChange={set('niche')} placeholder="Fashion & Lifestyle" />
            <Field label="Contact email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="collabs@priyacreates.com" type="email" />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-3">STATS</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field half label="Followers" value={form.followers} onChange={set('followers')} placeholder="24500" type="number" />
            <Field half label="Avg. likes/post" value={form.avgLikes} onChange={set('avgLikes')} placeholder="1800" type="number" />
            <Field half label="Avg. comments/post" value={form.avgComments} onChange={set('avgComments')} placeholder="120" type="number" />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-3">AUDIENCE</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field half label="Top age group" value={form.audienceAge} onChange={set('audienceAge')} placeholder="18-24" />
            <Field half label="Gender split" value={form.audienceGender} onChange={set('audienceGender')} placeholder="70% Female, 30% Male" />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-3">BRANDS & RATES (optional)</p>
          <div className="grid gap-3">
            <Field label="Brands you've worked with" value={form.brands} onChange={set('brands')} placeholder="Nykaa, Zomato, Boat (comma separated)" />
            <div className="grid sm:grid-cols-3 gap-3">
              <Field half label="Feed post rate" value={form.ratePost} onChange={set('ratePost')} placeholder="₹5,000" />
              <Field half label="Reel rate" value={form.rateReel} onChange={set('rateReel')} placeholder="₹8,000" />
              <Field half label="Story rate" value={form.rateStory} onChange={set('rateStory')} placeholder="₹2,000" />
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md"
        >
          {justExported ? <Check size={18} /> : <Download size={18} />}
          {justExported ? 'Saved!' : 'Download Media Kit (JPG)'}
        </button>
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[300px]">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5" style={{ aspectRatio: `${KIT_W} / ${KIT_H}` }}>
            <canvas ref={canvasRef} width={KIT_W} height={KIT_H} className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Live preview · exports at {KIT_W}×{KIT_H}</p>
        </div>
      </div>
    </div>
  );
}
