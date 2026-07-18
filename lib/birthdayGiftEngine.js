const W = 1080;
const H = 1920;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}
function easeOutCubic(t) {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
}
function easeOutBack(t) {
  const c = clamp(t, 0, 1);
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
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

function drawTypewriter(ctx, text, x, y, maxWidth, lineHeight, charsToShow) {
  const lines = wrapLines(ctx, text, maxWidth);
  let remaining = charsToShow;
  const visible = [];
  for (const l of lines) {
    if (remaining <= 0) break;
    if (remaining >= l.length) {
      visible.push(l);
      remaining -= l.length + 1;
    } else {
      visible.push(l.slice(0, remaining));
      remaining = 0;
    }
  }
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  visible.forEach((l, i) => {
    ctx.textAlign = 'center';
    ctx.fillText(l, x, startY + i * lineHeight);
  });
  return lines.length;
}

/* ------------------------------------------------------------------------ */
/* THEME PARTICLE SYSTEMS                                                    */
/* ------------------------------------------------------------------------ */
const BALLOON_COLORS = ['#E9C9C0', '#C9BFE8', '#A8B79D', '#F2D680', '#8FBFC9'];
const CONFETTI_COLORS = ['#E9C9C0', '#C9BFE8', '#A8B79D', '#F2D680', '#8FBFC9', '#F2A6A6'];

export function initThemeParticles(theme) {
  if (theme === 'balloons') {
    return Array.from({ length: 14 }, (_, i) => ({
      x: 60 + Math.random() * (W - 120),
      baseY: H + Math.random() * 400,
      speed: 0.045 + Math.random() * 0.03,
      sway: 30 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      r: 55 + Math.random() * 35,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    }));
  }
  if (theme === 'confetti') {
    return Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * W,
      baseY: -Math.random() * H,
      speed: 0.15 + Math.random() * 0.2,
      sway: 15 + Math.random() * 25,
      phase: Math.random() * Math.PI * 2,
      size: 8 + Math.random() * 10,
      rotSpeed: (Math.random() - 0.5) * 0.006,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }));
  }
  if (theme === 'fireworks') {
    return Array.from({ length: 6 }, (_, i) => ({
      cx: 150 + Math.random() * (W - 300),
      cy: 250 + Math.random() * 900,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      period: 2600 + Math.random() * 1600,
      offset: Math.random() * 3000,
      particleCount: 22,
    }));
  }
  if (theme === 'cake') {
    return Array.from({ length: 3 }, (_, i) => ({
      x: W / 2 - 60 + i * 60,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  return [];
}

function drawBalloons(ctx, particles, elapsed) {
  particles.forEach((p) => {
    const travel = (elapsed * p.speed) % (H + 500);
    const y = p.baseY - travel;
    if (y < -150 || y > H + 150) return;
    const x = p.x + Math.sin(elapsed / 1600 + p.phase) * p.sway;
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + p.r * 0.9);
    ctx.lineTo(x, y + p.r * 0.9 + 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y, p.r * 0.78, p.r, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(x - p.r * 0.22, y - p.r * 0.35, p.r * 0.16, p.r * 0.24, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
    ctx.restore();
  });
}

function drawConfetti(ctx, particles, elapsed) {
  particles.forEach((p) => {
    const travel = (elapsed * p.speed) % (H + 200);
    const y = p.baseY + travel;
    const x = p.x + Math.sin(elapsed / 900 + p.phase) * p.sway;
    const rot = elapsed * p.rotSpeed + p.phase;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    ctx.restore();
  });
}

function drawFireworks(ctx, particles, elapsed) {
  particles.forEach((fw) => {
    const t = ((elapsed + fw.offset) % fw.period) / fw.period;
    if (t > 0.5) return;
    const burstT = t / 0.5;
    const eased = easeOutCubic(burstT);
    const alpha = 1 - burstT;
    for (let i = 0; i < fw.particleCount; i++) {
      const angle = (i / fw.particleCount) * Math.PI * 2;
      const dist = eased * 160;
      const px = fw.cx + Math.cos(angle) * dist;
      const py = fw.cy + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

function drawCake(ctx, particles, elapsed) {
  const baseY = H - 420;
  const cx = W / 2;
  ctx.save();
  ctx.fillStyle = '#FFFDF9';
  roundRectPath(ctx, cx - 220, baseY + 60, 440, 90, 14);
  ctx.fill();
  ctx.fillStyle = '#F6E4D8';
  roundRectPath(ctx, cx - 190, baseY - 10, 380, 90, 14);
  ctx.fill();
  ctx.fillStyle = '#FFFDF9';
  roundRectPath(ctx, cx - 155, baseY - 80, 310, 90, 14);
  ctx.fill();

  particles.forEach((candle) => {
    const flicker = 0.75 + Math.sin(elapsed / 90 + candle.phase) * 0.2 + Math.sin(elapsed / 47 + candle.phase) * 0.08;
    ctx.fillStyle = '#E9C9C0';
    ctx.fillRect(candle.x - 4, baseY - 130, 8, 55);
    ctx.beginPath();
    ctx.ellipse(candle.x, baseY - 145, 8 * flicker, 16 * flicker, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(candle.x, baseY - 145, 1, candle.x, baseY - 145, 16 * flicker);
    grad.addColorStop(0, '#FFF6D6');
    grad.addColorStop(0.5, '#F2C265');
    grad.addColorStop(1, 'rgba(242,194,101,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  });
  ctx.restore();
}

export function drawThemeBackground(ctx, theme, particles, elapsed) {
  const gradients = {
    balloons: ['#F6E9E4', '#EFE6F4', '#E4EEE0'],
    confetti: ['#FBF3EC', '#F3EFFA', '#EDF4EA'],
    fireworks: ['#211E2B', '#2B2440', '#1A2233'],
    cake: ['#FBF1EA', '#F6E9E4', '#F2E3DD'],
  };
  const stops = gradients[theme] || gradients.balloons;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.5, stops[1]);
  grad.addColorStop(1, stops[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (theme === 'balloons') drawBalloons(ctx, particles, elapsed);
  else if (theme === 'confetti') drawConfetti(ctx, particles, elapsed);
  else if (theme === 'fireworks') drawFireworks(ctx, particles, elapsed);
  else if (theme === 'cake') drawCake(ctx, particles, elapsed);
}

/* ------------------------------------------------------------------------ */
/* MAIN REVEAL FRAME                                                         */
/* ------------------------------------------------------------------------ */
export const GIFT_CANVAS_W = W;
export const GIFT_CANVAS_H = H;
export const GIFT_MESSAGE_START_MS = 2950;
export const GIFT_MIN_REVEAL_DURATION_MS = 7200;

// The typewriter speed used to be a fixed 28ms/char with a fixed total video
// duration — fine for short demo text, but any real message over ~150
// characters got cut off mid-sentence before the video finished exporting.
// Both the speed and the export duration now scale with the actual message
// length, so a full heartfelt paragraph reveals completely and the video
// still ends shortly after it finishes, instead of on a fixed clock.
export function getTypewriterCharDuration(message) {
  const len = (message || '').length || 1;
  // Keep the pleasant slow pace for short messages; speed up for long ones so
  // the video doesn't balloon into a minute-long typing animation.
  return clamp(5500 / len, 14, 28);
}

export function getGiftRevealDuration(message) {
  const len = (message || '').length || 0;
  const charDuration = getTypewriterCharDuration(message);
  const typingTime = len * charDuration;
  const settleBuffer = 1500; // let the finished message sit on screen before the video ends
  return Math.max(GIFT_MIN_REVEAL_DURATION_MS, GIFT_MESSAGE_START_MS + typingTime + settleBuffer);
}

// Kept for backward compatibility with anything importing the old fixed
// constant — now just the minimum/default duration for short messages.
export const GIFT_REVEAL_DURATION_MS = GIFT_MIN_REVEAL_DURATION_MS;

export function drawGiftFrame(ctx, params, anim) {
  const { name, age, message, photoImg, theme } = params;
  const { elapsed, particles, exportMode } = anim;
  const t = exportMode ? GIFT_REVEAL_DURATION_MS : elapsed;

  ctx.clearRect(0, 0, W, H);
  drawThemeBackground(ctx, theme, particles, t);

  const isDark = theme === 'fireworks';
  const textColor = isDark ? '#FBF8F3' : '#2B2A28';
  const subColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(43,42,40,0.65)';

  const photoStart = 900, photoDur = 700;
  const headlineStart = 1700, headlineDur = 650;
  const nameStart = 2150, nameDur = 650;
  const ageStart = 2500, ageDur = 500;
  const msgStart = GIFT_MESSAGE_START_MS;

  let cursorY = 330;

  if (photoImg) {
    const p = clamp((t - photoStart) / photoDur, 0, 1);
    if (p > 0) {
      const scale = easeOutBack(p);
      const alpha = clamp(p * 1.4, 0, 1);
      const r = 190;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(W / 2, cursorY + r);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.save();
      ctx.clip();
      const s = Math.max((r * 2) / photoImg.width, (r * 2) / photoImg.height);
      const w = photoImg.width * s;
      const h = photoImg.height * s;
      ctx.drawImage(photoImg, -w / 2, -h / 2, w, h);
      ctx.restore();
      ctx.lineWidth = 10;
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.85)' : '#FFFDF9';
      ctx.stroke();
      ctx.restore();
    }
    cursorY += 420;
  } else {
    cursorY += 60;
  }

  const hp = clamp((t - headlineStart) / headlineDur, 0, 1);
  if (hp > 0) {
    ctx.save();
    ctx.globalAlpha = hp;
    ctx.translate(0, (1 - easeOutCubic(hp)) * 30);
    ctx.font = '700 78px "Fraunces"';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText('🎉 Happy Birthday', W / 2, cursorY);
    ctx.restore();
  }
  cursorY += 120;

  const np = clamp((t - nameStart) / nameDur, 0, 1);
  if (np > 0 && name) {
    ctx.save();
    ctx.globalAlpha = np;
    ctx.translate(0, (1 - easeOutCubic(np)) * 24);
    ctx.font = 'italic 500 66px "Fraunces"';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(name, W / 2, cursorY);
    ctx.restore();
    cursorY += 100;
  }

  const ap = clamp((t - ageStart) / ageDur, 0, 1);
  if (ap > 0 && age) {
    ctx.save();
    const scale = easeOutBack(ap);
    ctx.globalAlpha = clamp(ap * 1.4, 0, 1);
    ctx.translate(W / 2, cursorY + 30);
    ctx.scale(scale, scale);
    const label = `turning ${age}`;
    ctx.font = '600 32px "Space Grotesk"';
    const tw = ctx.measureText(label).width;
    roundRectPath(ctx, -tw / 2 - 24, -30, tw + 48, 60, 30);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(43,42,40,0.08)';
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, 11);
    ctx.restore();
    cursorY += 110;
  }

  if (message) {
    const charDuration = getTypewriterCharDuration(message);
    const charsToShow = exportMode ? message.length : Math.floor((t - msgStart) / charDuration);
    if (charsToShow > 0 || exportMode) {
      ctx.font = '400 40px "Space Grotesk"';
      ctx.fillStyle = subColor;
      drawTypewriter(ctx, message, W / 2, cursorY + 60, W - 240, 56, Math.max(0, charsToShow));
    }
  }

  ctx.font = '500 26px "Space Grotesk"';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(43,42,40,0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('✦ sent with Aesthetic Social Kit ✦', W / 2, H - 60);
}
