'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Wand2, Copy, Check, Upload, X, Sun, Moon, Youtube, Flame,
  EyeOff, Swords, ThumbsDown, AlertTriangle, User, ListOrdered,
  Sparkles, Lock, Clock, HelpCircle, Megaphone
} from 'lucide-react';

/* ------------------------------------------------------------------------ */
/* HOOK FORMULA LIBRARY                                                      */
/* ------------------------------------------------------------------------ */
const HOOK_FORMULAS = [
  {
    key: 'negative-frame',
    name: 'The Negative Frame',
    psychology: 'Loss aversion — people fear losing more than they desire gaining.',
    icon: ThumbsDown,
    build: (topic) => `Stop doing ${topic} the way everyone tells you to — it's quietly ruining your results.`,
  },
  {
    key: 'curiosity-gap',
    name: 'The Secret / Curiosity Gap',
    psychology: 'Opens an information gap the brain feels compelled to close.',
    icon: EyeOff,
    build: (topic) => `Nobody talks about this part of ${topic} — and that's exactly why it works.`,
  },
  {
    key: 'challenge',
    name: 'The Challenge',
    psychology: 'Personal stakes + a countdown make viewers commit to the outcome.',
    icon: Swords,
    build: (topic) => `I tried ${topic} for 30 days straight with zero days off. Here's what actually happened.`,
  },
  {
    key: 'contrarian',
    name: 'The Contrarian Take',
    psychology: 'Disagreement triggers an instinctive need to see the justification.',
    icon: Megaphone,
    build: (topic) => `Unpopular opinion: everything you've been taught about ${topic} is backwards.`,
  },
  {
    key: 'warning',
    name: 'The Warning / PSA',
    psychology: 'Threat detection is a hardwired, involuntary attention trigger.',
    icon: AlertTriangle,
    build: (topic) => `If you're doing ${topic} right now, stop and watch this before you waste another week.`,
  },
  {
    key: 'relatable-pov',
    name: 'The Relatable POV',
    psychology: 'Mirrors a specific moment the viewer has lived — instant identification.',
    icon: User,
    build: (topic) => `POV: you just realized you've been doing ${topic} completely wrong this whole time.`,
  },
  {
    key: 'numbered-promise',
    name: 'The Numbered Promise',
    psychology: 'A concrete number sets a clear, low-effort expectation for payoff.',
    icon: ListOrdered,
    build: (topic) => `3 things about ${topic} that nobody explains — and the 3rd one changes everything.`,
  },
  {
    key: 'transformation',
    name: 'The Transformation',
    psychology: 'Visible before/after proof makes the promise feel concrete and achievable.',
    icon: Sparkles,
    build: (topic) => `This is what ${topic} actually did to me in just one week — no exaggeration.`,
  },
  {
    key: 'insider-secret',
    name: 'The Insider Secret',
    psychology: 'Implies exclusive, gatekept knowledge — status + curiosity combined.',
    icon: Lock,
    build: (topic) => `The ${topic} trick professionals use but never post about.`,
  },
  {
    key: 'urgency',
    name: 'The FOMO / Urgency',
    psychology: 'Scarcity and time pressure short-circuit the impulse to scroll past.',
    icon: Clock,
    build: (topic) => `This ${topic} method is about to be everywhere — here's how to use it before everyone else does.`,
  },
  {
    key: 'direct-question',
    name: 'The Direct Question',
    psychology: 'An unanswered question left open in working memory demands closure.',
    icon: HelpCircle,
    build: (topic) => `Why does literally nobody talk about this ${topic} mistake?`,
  },
  {
    key: 'callout',
    name: 'The Callout',
    psychology: 'Direct address filters for the exact viewer this video is for.',
    icon: Flame,
    build: (topic) => `If you're even a little bit into ${topic}, stop scrolling right now.`,
  },
];

function shuffledSample(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/* ------------------------------------------------------------------------ */
/* SUB-TOOL 1: HOOK GENERATOR                                                */
/* ------------------------------------------------------------------------ */
function HookGenerator() {
  const [topic, setTopic] = useState('');
  const [hooks, setHooks] = useState([]);
  const [copiedKey, setCopiedKey] = useState('');

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const picked = shuffledSample(HOOK_FORMULAS, 5);
    setHooks(picked.map((f) => ({ ...f, text: f.build(topic.trim()) })));
  };

  const handleCopy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1600);
    } catch (e) {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Video topic</label>
        <div className="flex gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. morning routines, budgeting, home workouts…"
            className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="flex items-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-5 py-3 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 shrink-0"
          >
            <Wand2 size={17} /> Generate Hooks
          </button>
        </div>
      </div>

      {hooks.length > 0 && (
        <div className="space-y-3">
          {hooks.map((h) => {
            const Icon = h.icon;
            const isCopied = copiedKey === h.key;
            return (
              <div key={h.key} className="rounded-2xl border border-[#E4DFD3] bg-white/60 backdrop-blur-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F3EFFA] text-[#5B4F8A] flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-0.5">{h.name.toUpperCase()}</p>
                    <p className="text-sm text-[#2B2A28] leading-relaxed">{h.text}</p>
                    <p className="text-xs text-[#8A8578] italic mt-1.5">{h.psychology}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(h.key, h.text)}
                    title="Copy hook"
                    className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium border transition-all duration-200 active:scale-95 ${
                      isCopied
                        ? 'bg-[#EEF2EB] border-[#A8B79D] text-[#5B6B57]'
                        : 'bg-white border-[#E4DFD3] text-[#6B665C] hover:border-[#C9BFE8]'
                    }`}
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9BFE8] bg-[#F3EFFA] text-[#5B4F8A] py-2.5 text-sm font-medium hover:bg-[#EAE3F7] active:scale-[0.98] transition-all duration-150"
          >
            <Wand2 size={14} /> Shuffle 5 new formulas
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* SUB-TOOL 2: A/B THUMBNAIL & TITLE PREVIEWER                               */
/* ------------------------------------------------------------------------ */
const MOCK_META = [
  { views: '128K views', time: '3 days ago', duration: '12:47' },
  { views: '84K views', time: '1 week ago', duration: '8:12' },
];

function ThumbnailSlot({ label, src, onUpload, onRemove }) {
  const fileRef = useRef(null);
  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
      {!src ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-[#C9BFE8] bg-[#F3EFFA] flex flex-col items-center justify-center gap-2 text-[#5B4F8A] hover:bg-[#EAE3F7] active:scale-[0.98] transition-all duration-150"
        >
          <Upload size={20} />
          <span className="text-xs font-medium">Upload {label}</span>
        </button>
      ) : (
        <div className="relative">
          <img src={src} alt={label} className="w-full aspect-video object-cover rounded-xl" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all duration-150"
          >
            <X size={14} />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-lg bg-black/60 text-white text-xs px-2.5 py-1.5 hover:bg-black/80 active:scale-95 transition-all duration-150"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}

function YouTubeCard({ thumbnail, title, dark, meta }) {
  const cardBg = dark ? 'bg-[#0F0F0F]' : 'bg-white';
  const titleColor = dark ? 'text-[#F1F1F1]' : 'text-[#0F0F0F]';
  const subColor = dark ? 'text-[#AAAAAA]' : 'text-[#606060]';

  return (
    <div className={`rounded-2xl overflow-hidden border border-[#E4DFD3] ${cardBg} transition-colors duration-300`}>
      <div className="relative aspect-video bg-[#1a1a1a]">
        {thumbnail ? (
          <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">
            No thumbnail uploaded
          </div>
        )}
        <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
          {meta.duration}
        </span>
      </div>
      <div className="p-3 flex gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9BFE8] to-[#A8B79D] flex items-center justify-center text-white text-xs font-bold shrink-0">
          YC
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium leading-snug line-clamp-2 ${titleColor}`}>
            {title || 'Your video title will appear here'}
          </p>
          <p className={`text-xs mt-1 ${subColor}`}>Your Channel</p>
          <p className={`text-xs ${subColor}`}>{meta.views} • {meta.time}</p>
        </div>
      </div>
    </div>
  );
}

function ABThumbnailPreviewer() {
  const [thumbA, setThumbA] = useState(null);
  const [thumbB, setThumbB] = useState(null);
  const [title, setTitle] = useState('');
  const [dark, setDark] = useState(false);

  const handleUpload = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <ThumbnailSlot label="Thumbnail A" src={thumbA} onUpload={handleUpload(setThumbA)} onRemove={() => setThumbA(null)} />
        <ThumbnailSlot label="Thumbnail B" src={thumbB} onUpload={handleUpload(setThumbB)} onRemove={() => setThumbB(null)} />
      </div>

      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Video title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type the title you're testing…"
          className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#3A3733]">
          <Youtube size={16} className="text-[#8A8578]" />
          Preview feed mode
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="flex items-center gap-2 rounded-full border border-[#E4DFD3] bg-white px-3 py-1.5 text-xs font-medium text-[#3A3733] hover:border-[#C9BFE8] active:scale-95 transition-all duration-150"
        >
          {dark ? <Moon size={14} /> : <Sun size={14} />}
          {dark ? 'Dark mode' : 'Light mode'}
        </button>
      </div>

      <div className={`rounded-2xl p-5 transition-colors duration-300 ${dark ? 'bg-[#0F0F0F]' : 'bg-[#F1F1F1]'}`}>
        <div className="grid sm:grid-cols-2 gap-4">
          <YouTubeCard thumbnail={thumbA} title={title} dark={dark} meta={MOCK_META[0]} />
          <YouTubeCard thumbnail={thumbB} title={title} dark={dark} meta={MOCK_META[1]} />
        </div>
      </div>
      <p className="text-xs text-center text-[#8A8578]">
        View counts and upload times are illustrative mock data, styled to match a real YouTube feed card.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* ROOT: YOUTUBE CREATOR KIT (two micro-tools)                               */
/* ------------------------------------------------------------------------ */
const SUB_TOOLS = [
  { key: 'hooks', label: 'Hook Generator', icon: Wand2 },
  { key: 'thumbnails', label: 'A/B Thumbnail Previewer', icon: Youtube },
];

export default function YouTubeCreatorKit() {
  const [subTab, setSubTab] = useState('hooks');

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

      {subTab === 'hooks' ? <HookGenerator /> : <ABThumbnailPreviewer />}
    </div>
  );
}
