'use client';

import React, { useState, useMemo } from 'react';
import {
  Type, Sparkles, Hash, Copy, Check, Gauge, Instagram, Music2, Youtube,
} from 'lucide-react';

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

/* TAB 3 — VIRAL CAPTION STUDIO & META ENGAGEMENT KIT                        */
/* ========================================================================= */
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

const DOUBLE_STRUCK_UPPER = {
  A: 0x1d538, B: 0x1d539, C: 0x2102, D: 0x1d53b, E: 0x1d53c, F: 0x1d53d, G: 0x1d53e,
  H: 0x210d, I: 0x1d540, J: 0x1d541, K: 0x1d542, L: 0x1d543, M: 0x1d544, N: 0x2115,
  O: 0x1d546, P: 0x2119, Q: 0x211a, R: 0x211d, S: 0x1d54a, T: 0x1d54b, U: 0x1d54c,
  V: 0x1d54d, W: 0x1d54e, X: 0x1d54f, Y: 0x1d550, Z: 0x2124,
};

function mapDoubleStruck(str) {
  return str
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90 && DOUBLE_STRUCK_UPPER[ch]) {
        return String.fromCodePoint(DOUBLE_STRUCK_UPPER[ch]);
      }
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d552 + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7d8 + (code - 48));
      return ch;
    })
    .join('');
}

const UNICODE_STYLES = {
  serifBold: (s) => mapUnicode(s, 0x1d400, 0x1d41a, 0x1d7ce),
  sansSlanted: (s) => mapUnicode(s, 0x1d608, 0x1d622, null),
  doubleStruck: (s) => mapDoubleStruck(s),
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

function computeViralScore(text, hashtags) {
  if (!text || !text.trim()) {
    return { score: 0, tips: ['Start typing your caption to see your Viral Potential Score.'] };
  }
  const tips = [];
  let score = 50;

  const trimmed = text.trim();
  const len = trimmed.length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const lineBreaks = (trimmed.match(/\n/g) || []).length;
  const emojiMatches = trimmed.match(/\p{Extended_Pictographic}/gu) || [];
  const emojiCount = emojiMatches.length;
  const emojiDensity = emojiCount / wordCount;
  const firstLine = trimmed.split('\n')[0] || '';
  const hasQuestionOpener = /\?/.test(firstLine);
  const ctaWords = ['comment', 'share', 'save', 'follow', 'tag', 'link in bio', 'dm me', 'let me know'];
  const lowerText = trimmed.toLowerCase();
  const hasCTA = ctaWords.some((w) => lowerText.includes(w));
  const firstLineHasCTA = ctaWords.some((w) => firstLine.toLowerCase().includes(w));
  const avgWordLen = words.reduce((a, w) => a + w.length, 0) / wordCount;

  if (len >= 60 && len <= 150) {
    score += 12;
  } else if (len < 30) {
    score -= 10;
    tips.push('Your caption is quite short — add a bit more context to boost watch-through.');
  } else if (len > 300) {
    score -= 8;
    tips.push('Caption is long — trim it or move extra detail to the first comment.');
  }

  if (lineBreaks >= 2) {
    score += 10;
  } else {
    tips.push('Add more line breaks — dense text blocks lower readability on mobile.');
  }

  if (emojiDensity > 0.02 && emojiDensity < 0.25) {
    score += 10;
  } else if (emojiCount === 0) {
    score -= 5;
    tips.push('Add 1-2 emojis to increase scroll-stopping power.');
  } else if (emojiDensity >= 0.25) {
    score -= 6;
    tips.push('Too many emojis can look spammy — dial it back a little.');
  }

  if (hasQuestionOpener) {
    score += 8;
  } else {
    tips.push('Open with a question or bold statement to hook readers instantly.');
  }

  if (hasCTA) {
    score += 10;
    if (!firstLineHasCTA) {
      tips.push('Move your CTA higher — the first line gets the most attention.');
    }
  } else {
    tips.push('Add a clear call-to-action like "comment below" or "save this".');
  }

  if (hashtags && hashtags.length >= 5 && hashtags.length <= 15) {
    score += 10;
  } else if (!hashtags || hashtags.length === 0) {
    tips.push('Generate a hashtag stack to widen your reach.');
  }

  if (avgWordLen <= 6) {
    score += 5;
  } else {
    tips.push('Simplify some longer words for easier skimming.');
  }

  score = clamp(Math.round(score), 4, 98);
  if (tips.length === 0) tips.push('Great structure! This caption is optimized for maximum reach.');
  return { score, tips: tips.slice(0, 4) };
}

function formatInstagram(text, hashtags) {
  const spacer = '.\n.\n.\n.\n.\n';
  return `${text.trim()}\n\n${spacer}${hashtags.join(' ')}`;
}
function formatTikTok(text, hashtags) {
  const firstLine = text.trim().split('\n')[0];
  return `${firstLine}\n${hashtags.slice(0, 10).join(' ')}`;
}
function formatYouTubeShorts(text, hashtags) {
  const title = text.trim().split('\n')[0].slice(0, 80);
  const body = text.trim();
  return `${title}\n\n${body}\n\n🔔 Subscribe for more!\n\n${hashtags.slice(0, 3).join(' ')}`;
}

const PLATFORM_PRESETS = {
  instagram: { label: 'Instagram Reel', icon: Instagram, format: formatInstagram },
  tiktok: { label: 'TikTok', icon: Music2, format: formatTikTok },
  youtube: { label: 'YouTube Shorts', icon: Youtube, format: formatYouTubeShorts },
};

function ScoreRing({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#8DA184' : score >= 45 ? '#D8B26A' : '#C97B6A';
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#EDE8DC" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#2B2A28]">{score}%</span>
        <span className="text-[9px] text-[#8A8578] tracking-wide">VIRAL SCORE</span>
      </div>
    </div>
  );
}

function CaptionStudio() {
  const [raw, setRaw] = useState('');
  const [output, setOutput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState('instagram');

  const applyBreaks = () => setOutput(addAestheticBreaks(output || raw));
  const applyStyle = (styleKey) => setOutput(UNICODE_STYLES[styleKey](output || raw));
  const applyHashtags = () => setHashtags(generateHashtags(output || raw));

  const baseText = output || raw;
  const { score, tips } = useMemo(() => computeViralScore(baseText, hashtags), [baseText, hashtags]);

  const formattedForPlatform = useMemo(() => {
    if (!baseText.trim()) return '';
    return PLATFORM_PRESETS[platform].format(baseText, hashtags.length ? hashtags : generateHashtags(baseText));
  }, [baseText, hashtags, platform]);

  const handleCopy = async () => {
    const finalText = formattedForPlatform || baseText;
    try {
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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

      <div className="rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-5 flex flex-col sm:flex-row items-center gap-5">
        <ScoreRing score={score} />
        <div className="flex-1 space-y-1.5 w-full">
          <p className="text-xs font-bold tracking-wider text-[#8A8578] flex items-center gap-1.5"><Gauge size={13} /> LIVE ENGAGEMENT PREDICTOR</p>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-[#6B665C] flex gap-1.5">
                <span className="text-[#C9BFE8]">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolButton icon={Type} label="Aesthetic line breaks" onClick={applyBreaks} />
        <ToolButton icon={Sparkles} label="Serif bold" onClick={() => applyStyle('serifBold')} />
        <ToolButton icon={Sparkles} label="Sans slanted" onClick={() => applyStyle('sansSlanted')} />
        <ToolButton icon={Sparkles} label="Double-struck" onClick={() => applyStyle('doubleStruck')} />
        <ToolButton icon={Hash} label="Hashtag stack" onClick={applyHashtags} />
      </div>

      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">PLATFORM PRESET</p>
        <div className="grid grid-cols-3 gap-2.5">
          {Object.entries(PLATFORM_PRESETS).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = platform === key;
            return (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-2 border text-xs font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md'
                    : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80'
                }`}
              >
                <Icon size={15} /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E4DFD3] bg-white/70 p-5 space-y-4">
        <p className="text-xs font-bold tracking-wider text-[#8A8578]">OUTPUT · {PLATFORM_PRESETS[platform].label.toUpperCase()} FORMAT</p>
        <p className="whitespace-pre-wrap text-[#3A3733] leading-relaxed min-h-[60px] text-sm">
          {formattedForPlatform || 'Your formatted caption will appear here…'}
        </p>
      </div>

      <button
        onClick={handleCopy}
        disabled={!baseText.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] py-3.5 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'One-Click Copy'}
      </button>
    </div>
  );
}

function ToolButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-[#E4DFD3] bg-white/60 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-[#3A3733] hover:border-[#C9BFE8] hover:bg-[#F3EFFA] active:scale-[0.95] transition-all duration-200"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}


export default CaptionStudio;
