// Lightweight slippy-map (Web Mercator) engine — no map library, no API key.
// Tiles are served free by CARTO's public basemaps (built on OpenStreetMap data).
// Fine for personal/hobby traffic. For high-traffic production use, swap TILE_TEMPLATES
// for a provider with a free-tier API key (Stadia Maps, MapTiler, etc.) to stay within
// fair-use limits.

export const TILE_SIZE = 256;
const SUBDOMAINS = ['a', 'b', 'c', 'd'];

export const TILE_TEMPLATES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
};

export const MAP_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';

export function tileUrl(style, x, y, z) {
  const template = TILE_TEMPLATES[style] || TILE_TEMPLATES.light;
  const s = SUBDOMAINS[Math.abs(x + y) % SUBDOMAINS.length];
  return template
    .replace('{s}', s)
    .replace('{z}', z)
    .replace('{x}', x)
    .replace('{y}', y);
}

// Convert lon/lat (degrees) to a "world pixel" coordinate at a given zoom level.
export function lonLatToWorldPixel(lon, lat, zoom) {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const clampedLat = Math.max(Math.min(lat, 85.05112878), -85.05112878);
  const x = ((lon + 180) / 360) * scale;
  const sinLat = Math.sin((clampedLat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

// Find the highest zoom level at which every point fits inside canvasW x canvasH
// (minus padding on each side), then return the zoom + the world-pixel center.
export function fitBounds(points, canvasW, canvasH, padding = 140, maxZoom = 16, minZoom = 1) {
  if (!points || points.length === 0) {
    return { zoom: 3, center: lonLatToWorldPixel(0, 20, 3) };
  }
  if (points.length === 1) {
    const zoom = 11;
    return { zoom, center: lonLatToWorldPixel(points[0].lng, points[0].lat, zoom) };
  }
  for (let z = maxZoom; z >= minZoom; z--) {
    const pixels = points.map((p) => lonLatToWorldPixel(p.lng, p.lat, z));
    const minX = Math.min(...pixels.map((p) => p.x));
    const maxX = Math.max(...pixels.map((p) => p.x));
    const minY = Math.min(...pixels.map((p) => p.y));
    const maxY = Math.max(...pixels.map((p) => p.y));
    const w = maxX - minX;
    const h = maxY - minY;
    if (w <= canvasW - padding * 2 && h <= canvasH - padding * 2) {
      return { zoom: z, center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 } };
    }
  }
  return { zoom: minZoom, center: lonLatToWorldPixel(points[0].lng, points[0].lat, minZoom) };
}

// Project a lon/lat point to screen pixel coordinates given the current
// zoom + world-pixel center + canvas size.
export function projectToScreen(lon, lat, zoom, center, canvasW, canvasH) {
  const p = lonLatToWorldPixel(lon, lat, zoom);
  return {
    x: p.x - center.x + canvasW / 2,
    y: p.y - center.y + canvasH / 2,
  };
}

// Simple in-memory tile image cache shared across a single browser session.
const tileCache = new Map();

export function getTileImage(url) {
  const cached = tileCache.get(url);
  if (cached) return cached;
  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  img.loaded = false;
  img.src = url;
  img.onload = () => { img.loaded = true; };
  tileCache.set(url, img);
  return img;
}

export function drawBaseMap(ctx, style, zoom, center, canvasW, canvasH) {
  const topLeftX = center.x - canvasW / 2;
  const topLeftY = center.y - canvasH / 2;
  const firstTileX = Math.floor(topLeftX / TILE_SIZE);
  const firstTileY = Math.floor(topLeftY / TILE_SIZE);
  const lastTileX = Math.ceil((topLeftX + canvasW) / TILE_SIZE);
  const lastTileY = Math.ceil((topLeftY + canvasH) / TILE_SIZE);
  const maxTileIndex = Math.pow(2, zoom) - 1;

  for (let tx = firstTileX; tx <= lastTileX; tx++) {
    for (let ty = firstTileY; ty <= lastTileY; ty++) {
      if (ty < 0 || ty > maxTileIndex) continue;
      const wrappedX = ((tx % (maxTileIndex + 1)) + (maxTileIndex + 1)) % (maxTileIndex + 1);
      const url = tileUrl(style, wrappedX, ty, zoom);
      const img = getTileImage(url);
      const screenX = tx * TILE_SIZE - topLeftX;
      const screenY = ty * TILE_SIZE - topLeftY;
      if (img.loaded) {
        ctx.drawImage(img, screenX, screenY, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = style === 'dark' ? '#1b1b1b' : '#e8e4da';
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

/* ---------------------------------------------------------------------- */
/* Import parsers: GPX / KML / GeoJSON — all native browser APIs, no libs  */
/* ---------------------------------------------------------------------- */
export function parseGPX(xmlText) {
  const doc = new window.DOMParser().parseFromString(xmlText, 'application/xml');
  const trkpts = Array.from(doc.getElementsByTagName('trkpt'));
  if (trkpts.length > 0) {
    return trkpts.map((pt) => ({
      lat: parseFloat(pt.getAttribute('lat')),
      lng: parseFloat(pt.getAttribute('lon')),
    }));
  }
  const wpts = Array.from(doc.getElementsByTagName('wpt'));
  return wpts.map((pt) => {
    const nameEl = pt.getElementsByTagName('name')[0];
    return {
      lat: parseFloat(pt.getAttribute('lat')),
      lng: parseFloat(pt.getAttribute('lon')),
      name: nameEl ? nameEl.textContent : '',
    };
  });
}

export function parseKML(xmlText) {
  const doc = new window.DOMParser().parseFromString(xmlText, 'application/xml');
  const placemarks = Array.from(doc.getElementsByTagName('Placemark'));
  const points = [];
  placemarks.forEach((pm) => {
    const nameEl = pm.getElementsByTagName('name')[0];
    const name = nameEl ? nameEl.textContent : '';
    const coordEls = Array.from(pm.getElementsByTagName('coordinates'));
    coordEls.forEach((coordEl) => {
      const raw = (coordEl.textContent || '').trim();
      const coordSets = raw.split(/\s+/).filter(Boolean);
      coordSets.forEach((set) => {
        const parts = set.split(',');
        if (parts.length >= 2) {
          points.push({
            lng: parseFloat(parts[0]),
            lat: parseFloat(parts[1]),
            name: coordSets.length === 1 ? name : undefined,
          });
        }
      });
    });
  });
  return points;
}

export function parseGeoJSON(jsonText) {
  const data = JSON.parse(jsonText);
  const points = [];
  const features = data.type === 'FeatureCollection' ? data.features : [data];
  features.forEach((f) => {
    const geom = f.geometry;
    const name = f.properties && (f.properties.name || f.properties.title);
    if (!geom) return;
    if (geom.type === 'Point') {
      points.push({ lng: geom.coordinates[0], lat: geom.coordinates[1], name });
    } else if (geom.type === 'LineString') {
      geom.coordinates.forEach((c) => points.push({ lng: c[0], lat: c[1] }));
    } else if (geom.type === 'MultiLineString') {
      geom.coordinates.forEach((line) => line.forEach((c) => points.push({ lng: c[0], lat: c[1] })));
    }
  });
  return points;
}

export function decimatePoints(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = Math.ceil(points.length / maxPoints);
  return points.filter((_, i) => i % step === 0);
}

// Free OpenStreetMap Nominatim geocoder — no API key, but please keep lookups
// occasional (their fair-use policy asks for roughly 1 request/second, max).
export async function geocodePlace(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
