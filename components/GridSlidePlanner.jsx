'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, X, Download, Move, Grid3x3, Layers, Check, RotateCcw,
  Rows3, LayoutGrid, ImageOff
} from 'lucide-react';

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function loadImageEl(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ------------------------------------------------------------------------ */
/* SUB-TOOL 1: REELS & FEED GRID PREVIEWER                                   */
/* ------------------------------------------------------------------------ */
function GridPreviewer() {
  const [mediaSrc, setMediaSrc] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [cropY, setCropY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [justExported, setJustExported] = useState(false);

  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const squareRef = useRef(null);
  const dragStartRef = useRef({ y: 0, cropY: 50 });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMediaSrc(ev.target.result);
      setMediaType(type);
      setCropY(50);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    setMediaSrc(null);
    setCropY(50);
  };

  const handlePointerDown = (e) => {
    if (!mediaSrc) return;
    setIsDragging(true);
    dragStartRef.current = { y: e.clientY, cropY };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) => {
      const rect = squareRef.current?.getBoundingClientRect();
      if (!rect) return;
      const deltaY = e.clientY - dragStartRef.current.y;
      const deltaPercent = (deltaY / rect.height) * 100;
      setCropY(clamp(dragStartRef.current.cropY + deltaPercent, 0, 100));
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  const handleExport = async () => {
    if (!mediaSrc) return;
    let sourceEl, naturalW, naturalH;
    try {
      if (mediaType === 'video' && videoRef.current) {
        sourceEl = videoRef.current;
        naturalW = sourceEl.videoWidth;
        naturalH = sourceEl.videoHeight;
      } else {
        sourceEl = await loadImageEl(mediaSrc);
        naturalW = sourceEl.naturalWidth;
        naturalH = sourceEl.naturalHeight;
      }
    } catch (e) {
      return;
    }
    if (!naturalW || !naturalH) return;

    const size = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cropSide = Math.min(naturalW, naturalH);
    const sx = naturalW > naturalH ? (naturalW - naturalH) * (cropY / 100) : 0;
    const sy = naturalH > naturalW ? (naturalH - naturalW) * (cropY / 100) : 0;
    ctx.drawImage(sourceEl, sx, sy, cropSide, cropSide, 0, 0, size, size);

    const url = canvas.toDataURL('image/jpeg', 0.95);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grid-crop-${Date.now()}.jpg`;
    a.click();
    setJustExported(true);
    setTimeout(() => setJustExported(false), 1800);
  };

  const objectPosition = `center ${cropY}%`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {!mediaSrc ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-[9/16] max-w-[260px] mx-auto flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#C9BFE8] bg-[#F3EFFA] text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-[0.98] transition-all duration-150"
          >
            <Upload size={26} />
            <span className="text-sm font-medium">Upload a 9:16 photo or video</span>
            <span className="text-xs text-[#8A80AE]">Reel, Story, or portrait clip</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[#8A7267] hover:bg-[#F3EFEA] active:scale-95 transition-all duration-150"
            >
              <X size={15} /> Remove & upload another
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-2 text-center">9:16 REEL / STORY FEED</p>
              <div className="relative w-full max-w-[220px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/5 bg-[#1a1a1a]">
                {mediaType === 'video' ? (
                  <video src={mediaSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={mediaSrc} alt="Reel preview" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-2 text-center">1:1 PROFILE GRID</p>
              <div
                ref={squareRef}
                onPointerDown={handlePointerDown}
                className={`relative w-full max-w-[220px] mx-auto aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-black/5 bg-[#1a1a1a] select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {mediaType === 'video' ? (
                  <video
                    ref={videoRef}
                    src={mediaSrc}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition }}
                  />
                ) : (
                  <img
                    src={mediaSrc}
                    alt="Grid crop preview"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center opacity-70">
                    <Move size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#5B6B57]">Adjust grid crop</label>
              <button
                onClick={() => setCropY(50)}
                className="flex items-center gap-1 text-xs text-[#8A8578] hover:text-[#5B6B57] transition"
              >
                <RotateCcw size={12} /> Reset to center
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={cropY}
              onChange={(e) => setCropY(Number(e.target.value))}
              className="w-full accent-[#8DA184]"
            />
            <p className="text-xs text-[#8A8578] text-center">Drag directly on the square preview, or use the slider — top and bottom stay in sync.</p>
          </div>

          <button
            onClick={handleExport}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md"
          >
            {justExported ? <Check size={18} /> : <Download size={18} />}
            {justExported ? 'Saved!' : 'Download 1:1 Crop (JPG)'}
          </button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* SUB-TOOL 2: SEAMLESS CAROUSEL SLIDER DRAFT                                */
/* ------------------------------------------------------------------------ */
let slideIdCounter = 0;
function nextSlideId() {
  slideIdCounter += 1;
  return `slide-${slideIdCounter}`;
}

function makeSlides(count) {
  return Array.from({ length: count }, () => ({ id: nextSlideId(), src: null }));
}

function SlideUploadSlot({ index, slide, onUpload, onRemove }) {
  const fileRef = useRef(null);
  return (
    <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#E4DFD3] bg-white/50">
      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => onUpload(slide.id, e)} className="hidden" />
      {slide.src ? (
        <>
          <img src={slide.src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(slide.id)}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all duration-150"
          >
            <X size={12} />
          </button>
        </>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#8A80AE] hover:bg-[#F3EFFA] active:scale-[0.98] transition-all duration-150"
        >
          <Upload size={16} />
          <span className="text-[11px] font-medium">Slide {index + 1}</span>
        </button>
      )}
    </div>
  );
}

function CarouselDraft() {
  const [slideCount, setSlideCount] = useState(3);
  const [slides, setSlides] = useState(() => makeSlides(3));
  const [previewMode, setPreviewMode] = useState('flow');
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeRef = useRef(null);

  const changeCount = (n) => {
    setSlideCount(n);
    setSlides((prev) => {
      const next = [...prev];
      while (next.length < n) next.push({ id: nextSlideId(), src: null });
      return next.slice(0, n);
    });
  };

  const handleUpload = (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, src: ev.target.result } : s)));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = (id) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, src: null } : s)));
  };

  const handleSwipeScroll = () => {
    const el = swipeRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(clamp(idx, 0, slides.length - 1));
  };

  const scrollToSlide = (idx) => {
    const el = swipeRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  };

  const uploadedCount = slides.filter((s) => s.src).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">NUMBER OF SLIDES</p>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => changeCount(n)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all duration-300 ${
                slideCount === n
                  ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md'
                  : 'bg-white/50 border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">UPLOAD SLIDES ({uploadedCount}/{slideCount})</p>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.min(slideCount, 5)}, minmax(0, 1fr))` }}>
          {slides.map((slide, i) => (
            <SlideUploadSlot key={slide.id} index={i} slide={slide} onUpload={handleUpload} onRemove={handleRemove} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-[#5B6B57] tracking-wide">PREVIEW</p>
          <div className="flex gap-1.5 bg-white/50 border border-[#E4DFD3] rounded-xl p-1">
            <button
              onClick={() => setPreviewMode('flow')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                previewMode === 'flow' ? 'bg-[#2B2A28] text-[#F5F1E8]' : 'text-[#6B665C] hover:bg-white/70'
              }`}
            >
              <Rows3 size={13} /> Flow check
            </button>
            <button
              onClick={() => setPreviewMode('swipe')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                previewMode === 'swipe' ? 'bg-[#2B2A28] text-[#F5F1E8]' : 'text-[#6B665C] hover:bg-white/70'
              }`}
            >
              <LayoutGrid size={13} /> Swipe preview
            </button>
          </div>
        </div>

        {previewMode === 'flow' ? (
          <div>
            <div className="flex overflow-x-auto rounded-2xl border-4 border-white shadow-xl ring-1 ring-black/5 no-scrollbar">
              {slides.map((slide, i) => (
                <div key={slide.id} className="relative shrink-0 h-56 sm:h-72 aspect-[4/5] bg-[#EFE9DC]">
                  {slide.src ? (
                    <img src={slide.src} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#B8AE9B]">
                      <ImageOff size={18} />
                      <span className="text-[11px]">Slide {i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-[#8A8578] mt-2.5">
              Slides sit edge-to-edge with zero gap — check that continuous artwork flows cleanly across the seams.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-full max-w-[280px] mx-auto">
              <div
                ref={swipeRef}
                onScroll={handleSwipeScroll}
                className="flex overflow-x-auto snap-x snap-mandatory rounded-3xl border-4 border-white shadow-2xl ring-1 ring-black/5 no-scrollbar"
              >
                {slides.map((slide, i) => (
                  <div key={slide.id} className="relative snap-center shrink-0 w-full aspect-[4/5] bg-[#EFE9DC]">
                    {slide.src ? (
                      <img src={slide.src} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#B8AE9B]">
                        <ImageOff size={18} />
                        <span className="text-[11px]">Slide {i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-1.5 mt-3">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-5 bg-[#2B2A28]' : 'w-1.5 bg-[#D8D2C4]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-[#8A8578] mt-3">Swipe or tap the dots — just like a real Instagram carousel.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* ROOT: INSTAGRAM GRID & SLIDE PLANNER                                      */
/* ------------------------------------------------------------------------ */
const SUB_TOOLS = [
  { key: 'grid', label: 'Grid Previewer', icon: Grid3x3 },
  { key: 'carousel', label: 'Carousel Draft', icon: Layers },
];

export default function GridSlidePlanner() {
  const [subTab, setSubTab] = useState('grid');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-white/50 backdrop-blur-sm border border-[#E4DFD3] rounded-2xl p-1.5 max-w-md mx-auto sm:mx-0">
        {SUB_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const active = subTab === tool.key;
          return (
            <button
              key={tool.key}
              onClick={() => setSubTab(tool.key)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-all duration-300 ${
                active ? 'bg-[#2B2A28] text-[#F5F1E8] shadow-md' : 'text-[#6B665C] hover:bg-white/70'
              }`}
            >
              <Icon size={15} /> {tool.label}
            </button>
          );
        })}
      </div>

      {subTab === 'grid' ? <GridPreviewer /> : <CarouselDraft />}
    </div>
  );
}
