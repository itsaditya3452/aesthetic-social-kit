'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Plus, X, Upload, MapPin, Plane, Train, Car, Footprints, Bike, Sailboat,
  Play, Download, Loader2, FileUp, AlertCircle, Sun, Moon, Trash2
} from 'lucide-react';
import {
  fitBounds, projectToScreen, drawBaseMap, MAP_ATTRIBUTION,
  parseGPX, parseKML, parseGeoJSON, decimatePoints, geocodePlace,
} from '../lib/mapEngine';

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const LEG_TRAVEL_MS = 1800;
const LEG_DWELL_MS = 700;
const LEG_DURATION_MS = LEG_TRAVEL_MS + LEG_DWELL_MS;

const TRANSPORT_MODES = {
  car: { label: 'Car', icon: Car, emoji: '🚗', dash: [], arc: 0.03 },
  plane: { label: 'Plane', icon: Plane, emoji: '✈️', dash: [14, 10], arc: 0.16 },
  train: { label: 'Train', icon: Train, emoji: '🚆', dash: [], arc: 0.03 },
  walk: { label: 'Walk', icon: Footprints, emoji: '🚶', dash: [4, 8], arc: 0.02 },
  bike: { label: 'Bike', icon: Bike, emoji: '🚴', dash: [4, 8], arc: 0.02 },
  boat: { label: 'Boat', icon: Sailboat, emoji: '⛵', dash: [2, 10], arc: 0.09 },
};

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function getControlPoint(p0, p1, arcFactor) {
  const mx = (p0.x + p1.x) / 2;
  const my = (p0.y + p1.y) / 2;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = len * arcFactor;
  return { x: mx + nx * offset, y: my + ny * offset };
}

function quadPoint(p0, p1, ctrl, t) {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * ctrl.x + t * t * p1.x;
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * ctrl.y + t * t * p1.y;
  return { x, y };
}

function sampleCurve(p0, p1, ctrl, upToT, steps = 40) {
  const pts = [];
  const n = Math.max(2, Math.round(steps * clamp(upToT, 0, 1)));
  for (let i = 0; i <= n; i++) {
    const t = (i / steps);
    if (t > upToT) break;
    pts.push(quadPoint(p0, p1, ctrl, t));
  }
  pts.push(quadPoint(p0, p1, ctrl, clamp(upToT, 0, 1)));
  return pts;
}

function loadPhoto(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
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

/* ------------------------------------------------------------------------ */
/* MAIN DRAW FUNCTION                                                        */
/* ------------------------------------------------------------------------ */
function drawRouteFrame(ctx, params, anim) {
  const { stops, tracePoints, mapStyle, photoImages } = params;
  const { elapsedTotal } = anim;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const usingTrace = tracePoints && tracePoints.length > 1;
  const geoPoints = usingTrace
    ? tracePoints
    : stops.map((s) => ({ lat: s.lat, lng: s.lng }));

  if (geoPoints.length === 0) {
    ctx.fillStyle = '#EFE9DC';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#9A9384';
    ctx.font = '500 30px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.fillText('Add stops to preview your route', CANVAS_W / 2, CANVAS_H / 2);
    return;
  }

  const { zoom, center } = fitBounds(geoPoints, CANVAS_W, CANVAS_H, 170);
  drawBaseMap(ctx, mapStyle, zoom, center, CANVAS_W, CANVAS_H);

  ctx.fillStyle = mapStyle === 'dark' ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.12)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const screenPts = geoPoints.map((p) => projectToScreen(p.lng, p.lat, zoom, center, CANVAS_W, CANVAS_H));

  const routeColor = mapStyle === 'dark' ? '#F2C9BE' : '#2B2A28';
  const dimColor = mapStyle === 'dark' ? 'rgba(242,201,190,0.35)' : 'rgba(43,42,40,0.28)';

  if (usingTrace) {
    // Single continuous imported track — reveal progressively.
    const totalMs = LEG_DURATION_MS;
    const rawProgress = clamp(elapsedTotal / totalMs, 0, 1);
    const eased = easeInOutSine(rawProgress);
    const revealCount = Math.max(2, Math.round(screenPts.length * eased));

    ctx.strokeStyle = routeColor;
    ctx.lineWidth = 7;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    ctx.beginPath();
    screenPts.slice(0, revealCount).forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    const markerPt = screenPts[Math.min(revealCount - 1, screenPts.length - 1)];
    drawMarker(ctx, markerPt, '🚗', routeColor);

    drawStopLabel(ctx, screenPts[0], stops[0]?.name || 'Start', mapStyle, clamp(elapsedTotal / 300, 0, 1));
    if (rawProgress > 0.94) {
      const endFade = clamp((rawProgress - 0.94) / 0.06, 0, 1);
      drawStopLabel(ctx, screenPts[screenPts.length - 1], stops[1]?.name || 'Finish', mapStyle, endFade);
    }
  } else if (screenPts.length === 1) {
    drawMarker(ctx, screenPts[0], '📍', routeColor);
    drawStopLabel(ctx, screenPts[0], stops[0].name, mapStyle, 1);
  } else {
    const totalLegs = screenPts.length - 1;
    const cycle = totalLegs * LEG_DURATION_MS;
    const t = cycle > 0 ? elapsedTotal % cycle : 0;
    const activeLeg = clamp(Math.floor(t / LEG_DURATION_MS), 0, totalLegs - 1);

    for (let i = 0; i < totalLegs; i++) {
      const p0 = screenPts[i];
      const p1 = screenPts[i + 1];
      const mode = TRANSPORT_MODES[stops[i + 1]?.transport] || TRANSPORT_MODES.car;
      const ctrl = getControlPoint(p0, p1, mode.arc);

      let legProgress;
      if (i < activeLeg) legProgress = 1;
      else if (i > activeLeg) legProgress = 0;
      else {
        const legElapsed = t - activeLeg * LEG_DURATION_MS;
        legProgress = easeInOutSine(clamp(legElapsed / LEG_TRAVEL_MS, 0, 1));
      }
      if (legProgress <= 0) continue;

      const pts = sampleCurve(p0, p1, ctrl, legProgress);
      ctx.strokeStyle = i === activeLeg ? routeColor : dimColor;
      ctx.lineWidth = 6;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.setLineDash(mode.dash);
      ctx.beginPath();
      pts.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      if (i === activeLeg && legProgress > 0.02 && legProgress < 1) {
        const markerPt = pts[pts.length - 1];
        drawMarker(ctx, markerPt, mode.emoji, routeColor);
      }
    }

    // Stop labels + photo bubbles: fully settled for visited stops, fading in on arrival.
    for (let i = 0; i < screenPts.length; i++) {
      let reveal = 0;
      if (i < activeLeg + 1) {
        reveal = 1;
      } else if (i === activeLeg + 1) {
        const legElapsed = t - activeLeg * LEG_DURATION_MS;
        reveal = clamp((legElapsed - LEG_TRAVEL_MS) / LEG_DWELL_MS, 0, 1);
      } else if (i === 0) {
        reveal = 1;
      }
      if (reveal <= 0) continue;
      drawStopLabel(ctx, screenPts[i], stops[i]?.name || `Stop ${i + 1}`, mapStyle, reveal);
      const photoImg = photoImages[stops[i]?.id];
      if (photoImg && reveal > 0.3) {
        drawPhotoBubble(ctx, screenPts[i], photoImg, reveal);
      }
    }
  }

  // Attribution (required by the free tile provider's terms).
  ctx.font = '400 20px "Space Grotesk"';
  ctx.fillStyle = mapStyle === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';
  ctx.textAlign = 'right';
  ctx.fillText(MAP_ATTRIBUTION, CANVAS_W - 24, CANVAS_H - 24);
}

function drawMarker(ctx, pt, emoji, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, pt.x, pt.y + 1);
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

function drawStopLabel(ctx, pt, name, mapStyle, alpha) {
  if (!pt || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const offsetY = pt.y - 46 - (1 - alpha) * 14;

  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
  ctx.fillStyle = mapStyle === 'dark' ? '#F2C9BE' : '#2B2A28';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = '600 28px "Space Grotesk"';
  const textW = ctx.measureText(name).width;
  const padX = 16, padY = 10;
  roundRectPath(ctx, pt.x - textW / 2 - padX, offsetY - 24 - padY, textW + padX * 2, 24 + padY * 2, 12);
  ctx.fillStyle = mapStyle === 'dark' ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.92)';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = mapStyle === 'dark' ? '#F5F1E8' : '#2B2A28';
  ctx.textAlign = 'center';
  ctx.fillText(name, pt.x, offsetY - padY / 2);
  ctx.restore();
}

function drawPhotoBubble(ctx, pt, img, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = 60;
  const cx = pt.x;
  const cy = pt.y - 150;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  const scale = Math.max((r * 2) / img.width, (r * 2) / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();
}

/* ------------------------------------------------------------------------ */
/* COMPONENT                                                                 */
/* ------------------------------------------------------------------------ */
let stopIdCounter = 0;
function nextId(prefix) {
  stopIdCounter += 1;
  return `${prefix}-${stopIdCounter}`;
}

export default function TravelRouteAnimator() {
  const [stops, setStops] = useState([]);
  const [tracePoints, setTracePoints] = useState([]);
  const [mapStyle, setMapStyle] = useState('light');
  const [newStopName, setNewStopName] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedUrl, setExportedUrl] = useState('');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const paramsRef = useRef({ stops: [], tracePoints: [], mapStyle: 'light', photoImages: {} });
  const photoImagesRef = useRef({});
  const recorderRef = useRef(null);
  const pendingPhotoStopId = useRef(null);

  useEffect(() => {
    paramsRef.current = { stops, tracePoints, mapStyle, photoImages: photoImagesRef.current };
  }, [stops, tracePoints, mapStyle]);

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, [stops.length, tracePoints.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    startTimeRef.current = performance.now();

    const loop = (now) => {
      const elapsedTotal = now - startTimeRef.current;
      drawRouteFrame(ctx, paramsRef.current, { elapsedTotal });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleAddStop = async () => {
    if (!newStopName.trim()) return;
    setIsGeocoding(true);
    setStatusMsg('');
    try {
      const result = await geocodePlace(newStopName.trim());
      if (!result) {
        setStatusMsg(`Couldn't find "${newStopName}" — try a more specific name (e.g. add the country).`);
        setIsGeocoding(false);
        return;
      }
      setStops((prev) => [
        ...prev,
        { id: nextId('stop'), name: newStopName.trim(), lat: result.lat, lng: result.lng, transport: 'car' },
      ]);
      setTracePoints([]);
      setNewStopName('');
    } catch (e) {
      setStatusMsg('Geocoding lookup failed — check your connection and try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const removeStop = (id) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    delete photoImagesRef.current[id];
  };

  const updateTransport = (id, transport) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, transport } : s)));
  };

  const moveStop = (index, dir) => {
    setStops((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handlePhotoPick = (stopId) => {
    pendingPhotoStopId.current = stopId;
    photoInputRef.current?.click();
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    const stopId = pendingPhotoStopId.current;
    if (!file || !stopId) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const img = await loadPhoto(ev.target.result);
        photoImagesRef.current[stopId] = img;
      } catch (err) {
        /* ignore broken image */
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      let points = [];
      try {
        if (ext === 'gpx') points = parseGPX(text);
        else if (ext === 'kml') points = parseKML(text);
        else if (ext === 'geojson' || ext === 'json') points = parseGeoJSON(text);
        else {
          setStatusMsg('Unsupported file type — please upload a .gpx, .kml, or .geojson file.');
          return;
        }
      } catch (err) {
        setStatusMsg('Could not read this file — please check it is a valid export.');
        return;
      }
      points = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      if (points.length === 0) {
        setStatusMsg('No valid coordinates were found in this file.');
        return;
      }
      const named = points.filter((p) => p.name);
      if (named.length >= 2) {
        setStops(named.map((p) => ({ id: nextId('imp'), name: p.name, lat: p.lat, lng: p.lng, transport: 'car' })));
        setTracePoints([]);
      } else {
        const decimated = decimatePoints(points, 300);
        const first = decimated[0];
        const last = decimated[decimated.length - 1];
        setStops([
          { id: nextId('trace-s'), name: 'Start', lat: first.lat, lng: first.lng, transport: 'car' },
          { id: nextId('trace-e'), name: 'Finish', lat: last.lat, lng: last.lng, transport: 'car' },
        ]);
        setTracePoints(decimated);
      }
      setStatusMsg('');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearAll = () => {
    setStops([]);
    setTracePoints([]);
    photoImagesRef.current = {};
    setStatusMsg('');
  };

  const getTotalDuration = useCallback(() => {
    const usingTrace = tracePoints.length > 1;
    if (usingTrace) return LEG_DURATION_MS + 900;
    const legs = Math.max(0, stops.length - 1);
    return legs * LEG_DURATION_MS + 900;
  }, [stops.length, tracePoints.length]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas || stops.length === 0) return;
    setIsExporting(true);
    setExportedUrl('');

    const stream = canvas.captureStream(30);
    let mimeType = 'video/webm;codecs=vp9';
    if (typeof MediaRecorder === 'undefined') {
      setStatusMsg('Video recording is not supported in this browser.');
      setIsExporting(false);
      return;
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setIsExporting(false);
    };

    recorderRef.current = recorder;
    startTimeRef.current = performance.now();
    recorder.start();
    setTimeout(() => {
      recorder.stop();
      startTimeRef.current = performance.now();
    }, getTotalDuration());
  };

  const handleDownloadVideo = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    a.download = `travel-route-${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">ADD A STOP</p>
          <div className="flex gap-2">
            <input
              value={newStopName}
              onChange={(e) => setNewStopName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStop()}
              placeholder="e.g. Jaipur, India"
              className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
            />
            <button
              onClick={handleAddStop}
              disabled={isGeocoding || !newStopName.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-4 py-3 text-sm font-medium hover:bg-[#413F3B] active:scale-[0.96] transition-all duration-200 disabled:opacity-50 shrink-0"
            >
              {isGeocoding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add
            </button>
          </div>
          <p className="text-xs text-[#8A8578] mt-1.5">Free lookup via OpenStreetMap — be specific for best results.</p>
          {statusMsg && (
            <p className="flex items-center gap-1.5 text-xs text-[#C97B6A] mt-2"><AlertCircle size={13} /> {statusMsg}</p>
          )}
        </div>

        {stops.length > 0 && (
          <div className="space-y-2.5">
            {stops.map((stop, i) => {
              const mode = TRANSPORT_MODES[stop.transport] || TRANSPORT_MODES.car;
              return (
                <div key={stop.id} className="rounded-xl border border-[#E4DFD3] bg-white/60 backdrop-blur-sm p-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-[#8DA184] shrink-0" />
                    <span className="flex-1 text-sm font-medium text-[#2B2A28] truncate">{stop.name}</span>
                    <button onClick={() => handlePhotoPick(stop.id)} title="Add photo" className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8A7267] transition">
                      <Upload size={14} />
                    </button>
                    <button onClick={() => moveStop(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8A8578] disabled:opacity-30 transition text-xs">↑</button>
                    <button onClick={() => moveStop(i, 1)} disabled={i === stops.length - 1} className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8A8578] disabled:opacity-30 transition text-xs">↓</button>
                    <button onClick={() => removeStop(stop.id)} className="p-1.5 rounded-lg hover:bg-[#FBEDEA] text-[#C97B6A] transition">
                      <X size={14} />
                    </button>
                  </div>
                  {i > 0 && (
                    <div className="flex gap-1.5 mt-2.5 pl-6">
                      {Object.entries(TRANSPORT_MODES).map(([key, m]) => {
                        const Icon = m.icon;
                        const active = stop.transport === key;
                        return (
                          <button
                            key={key}
                            onClick={() => updateTransport(stop.id, key)}
                            title={m.label}
                            className={`p-1.5 rounded-lg border transition-all duration-150 ${
                              active ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8]' : 'border-[#E4DFD3] text-[#8A8578] hover:border-[#C9BFE8]'
                            }`}
                          >
                            <Icon size={13} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept=".gpx,.kml,.geojson,.json" onChange={handleImportFile} className="hidden" />
          <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] px-4 py-2.5 text-sm font-medium text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-95 transition-all duration-150"
          >
            <FileUp size={15} /> Import GPX / KML / GeoJSON
          </button>
          {(stops.length > 0 || tracePoints.length > 0) && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm text-[#8A7267] hover:bg-[#F3EFEA] active:scale-95 transition-all duration-150"
            >
              <Trash2 size={14} /> Clear route
            </button>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">MAP STYLE</p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setMapStyle('light')}
              className={`flex items-center gap-2 rounded-xl py-2.5 px-4 border text-sm font-medium transition-all duration-300 ${
                mapStyle === 'light' ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md' : 'bg-white/50 border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8]'
              }`}
            >
              <Sun size={15} /> Light
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`flex items-center gap-2 rounded-xl py-2.5 px-4 border text-sm font-medium transition-all duration-300 ${
                mapStyle === 'dark' ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md' : 'bg-white/50 border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8]'
              }`}
            >
              <Moon size={15} /> Dark
            </button>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || stops.length === 0}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
          {isExporting ? 'Recording route animation…' : 'Export Route Video (WebM)'}
        </button>

        {exportedUrl && (
          <button
            onClick={handleDownloadVideo}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#A8B79D] bg-[#EEF2EB] text-[#5B6B57] py-3 font-medium hover:bg-[#E4EBDF] active:scale-[0.97] transition-all duration-200"
          >
            <Download size={17} /> Download Video
          </button>
        )}
        <p className="text-xs text-center text-[#8A8578]">
          Exports as WebM (plays natively in Chrome/Firefox/Edge and uploads fine to Instagram/TikTok/YouTube).
        </p>
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-[300px]">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-black/5"
            style={{ aspectRatio: '9 / 16' }}
          >
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CE0A6] animate-pulse" />
              <span className="text-[10px] font-medium text-white tracking-wide">LIVE PREVIEW</span>
            </div>
          </div>
          <p className="text-center text-xs text-[#8A8578] mt-3">Animated route · 1080×1920 HD</p>
        </div>
      </div>
    </div>
  );
}
