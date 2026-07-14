'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import {
  initThemeParticles, drawGiftFrame, GIFT_CANVAS_W, GIFT_CANVAS_H,
} from '../lib/birthdayGiftEngine';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function BirthdayGiftViewer({ gift, onClose }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const particlesRef = useRef(initThemeParticles(gift.t || 'balloons'));
  const [photoObj, setPhotoObj] = useState(null);

  useEffect(() => {
    if (!gift.p) return;
    let cancelled = false;
    loadImage(gift.p).then((img) => { if (!cancelled) setPhotoObj(img); }).catch(() => {});
    return () => { cancelled = true; };
  }, [gift.p]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    startTimeRef.current = performance.now();
    const params = {
      name: gift.n || '',
      age: gift.a || '',
      message: gift.m || '',
      theme: gift.t || 'balloons',
      get photoImg() { return photoObj; },
    };

    const loop = (now) => {
      const elapsed = now - startTimeRef.current;
      drawGiftFrame(ctx, { ...params, photoImg: photoObj }, {
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
  }, [gift, photoObj]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#1E1C1A] flex items-center justify-center">
      <div className="relative h-full w-full max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          width={GIFT_CANVAS_W}
          height={GIFT_CANVAS_H}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 pb-8 pt-16 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-center gap-3">
          <a
            href={typeof window !== 'undefined' ? window.location.pathname : '/'}
            className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-[#2B2A28] hover:bg-white active:scale-95 transition-all duration-200 shadow-lg"
          >
            <Sparkles size={15} /> Create your own free birthday gift
          </a>
        </div>
      </div>
    </div>
  );
}
