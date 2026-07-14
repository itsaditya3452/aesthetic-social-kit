// Encodes gift data directly into the URL hash fragment so a "shareable link"
// works with zero backend/database — the hash never even gets sent to a server.
// This is the trick that makes free, account-less sharing possible.

export function encodeGiftPayload(obj) {
  const json = JSON.stringify(obj);
  const utf8Bytes = new TextEncoder().encode(json);
  let binary = '';
  utf8Bytes.forEach((b) => { binary += String.fromCharCode(b); });
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeGiftPayload(b64url) {
  try {
    const padLength = (4 - (b64url.length % 4)) % 4;
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLength);
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function compressImageForLink(dataUrl, maxDim = 110, quality = 0.45) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function resizeImageForCanvas(dataUrl, maxDim = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      if (img.width <= maxDim && img.height <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const scale = maxDim / Math.max(img.width, img.height);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
