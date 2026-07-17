export const KIT_W = 1080;
export const KIT_H = 1350;

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
  const words = String(text).split(' ');
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

function formatCompact(n) {
  const num = Number(n) || 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return String(num);
}

function drawStatCard(ctx, x, y, w, h, label, value, accent) {
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.fillStyle = '#FFFDF9';
  ctx.fill();
  ctx.strokeStyle = '#E4DFD3';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '700 44px "Space Grotesk"';
  ctx.fillStyle = accent;
  ctx.fillText(value, x + w / 2, y + h / 2 - 2);

  ctx.font = '600 20px "Space Grotesk"';
  ctx.fillStyle = '#8A8578';
  ctx.fillText(label.toUpperCase(), x + w / 2, y + h / 2 + 34);
}

export function drawMediaKit(ctx, data, photoImg) {
  const {
    name, handle, niche, followers, avgLikes, avgComments,
    audienceAge, audienceGender, brands, contactEmail,
    rateReel, ratePost, rateStory,
  } = data;

  ctx.clearRect(0, 0, KIT_W, KIT_H);

  const grad = ctx.createLinearGradient(0, 0, KIT_W, KIT_H);
  grad.addColorStop(0, '#F6E9E4');
  grad.addColorStop(1, '#EEF2EB');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, KIT_W, KIT_H);

  const pad = 64;

  // Header
  const photoR = 68;
  const photoX = pad + photoR;
  const photoY = pad + photoR + 10;
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.fillStyle = '#E4DFD3';
  ctx.fill();
  if (photoImg) {
    ctx.clip();
    const s = Math.max((photoR * 2) / photoImg.width, (photoR * 2) / photoImg.height);
    const w = photoImg.width * s, h = photoImg.height * s;
    ctx.drawImage(photoImg, photoX - w / 2, photoY - h / 2, w, h);
  } else {
    ctx.fillStyle = '#B8AE9B';
    ctx.font = '700 56px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((name || '?').charAt(0).toUpperCase(), photoX, photoY + 2);
    ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();
  ctx.strokeStyle = '#FFFDF9';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();

  const textX = photoX + photoR + 32;
  ctx.textAlign = 'left';
  ctx.font = '600 46px "Fraunces"';
  ctx.fillStyle = '#2B2A28';
  ctx.fillText(name || 'Your Name', textX, pad + 46);
  ctx.font = '500 30px "Space Grotesk"';
  ctx.fillStyle = '#8A7267';
  ctx.fillText(handle ? `@${handle.replace(/^@/, '')}` : '@yourhandle', textX, pad + 88);

  if (niche) {
    ctx.font = '600 24px "Space Grotesk"';
    const tw = ctx.measureText(niche).width;
    roundRectPath(ctx, textX, pad + 106, tw + 32, 42, 21);
    ctx.fillStyle = '#EEF2EB';
    ctx.fill();
    ctx.fillStyle = '#5B6B57';
    ctx.fillText(niche, textX + 16, pad + 134);
  }

  // Stats row
  const statsY = pad + 220;
  const gap = 20;
  const statW = (KIT_W - pad * 2 - gap * 2) / 3;
  const statH = 150;
  const engagementRate = followers > 0 ? (((Number(avgLikes) || 0) + (Number(avgComments) || 0)) / followers) * 100 : 0;

  drawStatCard(ctx, pad, statsY, statW, statH, 'Followers', formatCompact(followers), '#8DA184');
  drawStatCard(ctx, pad + statW + gap, statsY, statW, statH, 'Engagement Rate', `${engagementRate.toFixed(1)}%`, '#5B4F8A');
  drawStatCard(ctx, pad + (statW + gap) * 2, statsY, statW, statH, 'Avg. Likes', formatCompact(avgLikes), '#C97B6A');

  // Audience section
  const audY = statsY + statH + 56;
  ctx.font = '700 26px "Space Grotesk"';
  ctx.fillStyle = '#2B2A28';
  ctx.fillText('AUDIENCE', pad, audY);

  ctx.font = '400 26px "Space Grotesk"';
  ctx.fillStyle = '#6B665C';
  const audienceLine = [
    audienceAge ? `Top age group: ${audienceAge}` : null,
    audienceGender ? `Split: ${audienceGender}` : null,
  ].filter(Boolean).join('   ·   ') || 'Audience details not provided';
  ctx.fillText(audienceLine, pad, audY + 38);

  // Brands worked with
  const brandList = (brands || '').split(',').map((b) => b.trim()).filter(Boolean);
  let brandsY = audY + 90;
  if (brandList.length > 0) {
    ctx.font = '700 26px "Space Grotesk"';
    ctx.fillStyle = '#2B2A28';
    ctx.fillText('BRANDS I\'VE WORKED WITH', pad, brandsY);

    let bx = pad;
    let by = brandsY + 32;
    ctx.font = '500 24px "Space Grotesk"';
    brandList.forEach((brand) => {
      const tw = ctx.measureText(brand).width;
      const boxW = tw + 34;
      if (bx + boxW > KIT_W - pad) {
        bx = pad;
        by += 58;
      }
      roundRectPath(ctx, bx, by, boxW, 46, 23);
      ctx.fillStyle = '#FFFDF9';
      ctx.fill();
      ctx.strokeStyle = '#E4DFD3';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#3A3733';
      ctx.fillText(brand, bx + 17, by + 30);
      bx += boxW + 14;
    });
    brandsY = by + 70;
  } else {
    brandsY += 20;
  }

  // Rates section
  const rates = [
    ratePost ? { label: 'Feed Post', value: ratePost } : null,
    rateReel ? { label: 'Reel', value: rateReel } : null,
    rateStory ? { label: 'Story', value: rateStory } : null,
  ].filter(Boolean);

  if (rates.length > 0) {
    ctx.font = '700 26px "Space Grotesk"';
    ctx.fillStyle = '#2B2A28';
    ctx.fillText('STARTING RATES', pad, brandsY);
    const rateW = (KIT_W - pad * 2 - gap * (rates.length - 1)) / rates.length;
    rates.forEach((r, i) => {
      const rx = pad + i * (rateW + gap);
      roundRectPath(ctx, rx, brandsY + 20, rateW, 90, 14);
      ctx.fillStyle = '#2B2A28';
      ctx.fill();
      ctx.textAlign = 'center';
      ctx.font = '700 28px "Space Grotesk"';
      ctx.fillStyle = '#F5F1E8';
      ctx.fillText(r.value, rx + rateW / 2, brandsY + 60);
      ctx.font = '500 18px "Space Grotesk"';
      ctx.fillStyle = '#C9BFE8';
      ctx.fillText(r.label.toUpperCase(), rx + rateW / 2, brandsY + 90);
      ctx.textAlign = 'left';
    });
  }

  // Footer
  ctx.font = '500 24px "Space Grotesk"';
  ctx.fillStyle = '#8A8578';
  ctx.textAlign = 'center';
  ctx.fillText(contactEmail || '', KIT_W / 2, KIT_H - 48);
  ctx.font = '400 20px "Space Grotesk"';
  ctx.fillStyle = '#B8AE9B';
  ctx.fillText('Media Kit · made with Aesthetic Social Kit', KIT_W / 2, KIT_H - 20);
}
