'use client';

import React, { useState } from 'react';
import {
  Sparkles, Wand2, Flame, BookOpen, Lightbulb, Rocket,
  MessageCircle, Share2, ShoppingBag, Mic, Camera, MonitorPlay,
  Loader2, Film, Type, Clapperboard,
} from 'lucide-react';

/* TAB 2 — PRO SCRIPT FLOW GENERATOR (VIRAL PSYCHOLOGY ARCHITECTURE)         */
/* ========================================================================= */
const CATEGORY_LIBRARY = [
  {
    keys: ['code', 'coding', 'programming', 'developer', 'software', 'dev'],
    label: 'Coding & Dev',
    bRoll: ['macro shot of hands typing', 'terminal output scrolling fast', 'IDE error turning green', 'monitor glow in a dark room', 'sticky notes on a desk'],
    painPoint: 'wasting hours debugging something that had a one-line fix',
    secretTip: 'a single config change that most tutorials skip',
    statHook: '90% of developers never learn this until years into their career',
  },
  {
    keys: ['fitness', 'gym', 'workout', 'exercise', 'training'],
    label: 'Fitness & Gym',
    bRoll: ['slow-mo barbell loading', 'sweat dripping close-up', 'form comparison split-screen', 'gym clock ticking', 'chalk hands clapping'],
    painPoint: 'training hard for months with barely any visible progress',
    secretTip: 'the one form cue coaches charge $200 an hour to teach',
    statHook: 'studies show most people do this exercise wrong 7 out of 10 times',
  },
  {
    keys: ['food', 'recipe', 'cooking', 'baking', 'kitchen'],
    label: 'Food & Cooking',
    bRoll: ['overhead ingredient flat-lay', 'steam rising off the pan', 'knife through fresh produce', 'plating close-up', 'first bite reaction'],
    painPoint: 'your dish never tasting like the restaurant version',
    secretTip: 'the ingredient swap chefs never mention on camera',
    statHook: 'this one mistake ruins 8 out of 10 home-cooked versions of this dish',
  },
  {
    keys: ['travel', 'vlog', 'trip', 'vacation'],
    label: 'Travel',
    bRoll: ['drone establishing shot', 'quick cut street montage', 'local food stall close-up', 'golden hour skyline', 'transport/transit clip'],
    painPoint: 'planning a trip and still overpaying for the exact same experience',
    secretTip: 'the local trick that saves 40% and skips every tourist trap',
    statHook: 'most tourists visit this spot and completely miss the better version 200m away',
  },
  {
    keys: ['money', 'finance', 'business', 'startup', 'invest'],
    label: 'Finance & Business',
    bRoll: ['phone screen showing a chart', 'whiteboard math close-up', 'handshake or laptop typing', 'calculator/spreadsheet zoom', 'confident walk-and-talk'],
    painPoint: 'working hard and still feeling broke by the end of the month',
    secretTip: 'the exact number most people never calculate before spending',
    statHook: 'roughly 1 in 3 people make this exact mistake with their first paycheck',
  },
  {
    keys: ['skincare', 'beauty', 'makeup', 'glow'],
    label: 'Beauty & Skincare',
    bRoll: ['product texture macro', 'before/after split lighting', 'application close-up', 'natural window light glow shot', 'bathroom shelf flat-lay'],
    painPoint: 'spending money on products that do absolutely nothing',
    secretTip: 'the order of application that changes everything',
    statHook: 'dermatologists say most people apply this in the wrong order every single day',
  },
  {
    keys: ['study', 'productivity', 'exam', 'focus', 'student'],
    label: 'Study & Productivity',
    bRoll: ['clean desk top-down', 'pages flipping fast', 'timer counting down', 'highlighter gliding across notes', 'checklist being ticked'],
    painPoint: 'sitting down to study for hours and retaining almost nothing',
    secretTip: 'the 2-minute technique that doubles retention overnight',
    statHook: 'research shows most students waste 60% of study time re-reading instead of recalling',
  },
  {
    keys: ['gaming', 'game', 'gamer', 'esports'],
    label: 'Gaming',
    bRoll: ['gameplay clip, losing moment', 'settings menu quick cut', 'split-screen comparison', 'killcam replay', 'hype reaction cam'],
    painPoint: 'losing to players who are clearly worse mechanically than you',
    secretTip: 'the setting buried three menus deep that pros always change first',
    statHook: 'most players never touch this setting in their entire time playing',
  },
  {
    keys: ['fashion', 'outfit', 'style', 'ootd'],
    label: 'Fashion & Style',
    bRoll: ['mirror outfit check', 'fabric texture close-up', 'accessory detail shot', 'street style walk-by', 'closet flat-lay'],
    painPoint: 'buying trendy pieces that end up unworn in the closet within a month',
    secretTip: 'the styling rule that instantly makes any outfit look expensive',
    statHook: 'most people repeat the same 3 outfit mistakes without realizing it',
  },
  {
    keys: ['music', 'song', 'producer', 'beat', 'singing'],
    label: 'Music & Production',
    bRoll: ['DAW screen close-up', 'hands on keys or pads', 'waveform scrubbing', 'studio ambient light', 'headphones close-up reaction'],
    painPoint: 'your tracks sounding muddy compared to professionally mixed songs',
    secretTip: 'the one mix setting that instantly adds clarity',
    statHook: 'most bedroom producers skip this step entirely and wonder why it sounds off',
  },
  {
    keys: ['relationship', 'dating', 'marriage', 'partner'],
    label: 'Relationships',
    bRoll: ['couple candid walk shot', 'coffee shop conversation', 'text message screen blur', 'hands close-up', 'sunset silhouette'],
    painPoint: 'having the same argument on repeat with no resolution',
    secretTip: 'the one sentence that de-escalates almost any fight',
    statHook: 'therapists say most couples never learn this simple communication shift',
  },
  {
    keys: ['motivation', 'mindset', 'discipline', 'habit'],
    label: 'Motivation & Mindset',
    bRoll: ['sunrise walk or run', 'journal writing close-up', 'alarm clock at 5am', 'crossing something off a list', 'quiet focused stare to camera'],
    painPoint: 'setting big goals every January and quitting by week three',
    secretTip: 'the tiny habit stack that made consistency finally stick',
    statHook: 'most people abandon new habits by day 18 — here is why yours will not',
  },
];

const GENERIC_CATEGORY = {
  label: 'General',
  bRoll: ['relevant close-up shot', 'quick supporting cutaway', 'reaction close-up', 'text overlay graphic', 'wide establishing shot'],
  painPoint: 'putting in effort and not seeing the results you expected',
  secretTip: 'the one detail almost everyone overlooks',
  statHook: 'most people never figure this out on their own',
};

function matchCategory(topic) {
  const lower = topic.toLowerCase();
  const found = CATEGORY_LIBRARY.find((c) => c.keys.some((k) => lower.includes(k)));
  return found || GENERIC_CATEGORY;
}

const TONE_CONFIG = {
  controversial: {
    label: 'Controversial Hook',
    icon: Flame,
    hookBank: [
      (topic, cat) => `Unpopular opinion: most advice about ${topic} is actively making you worse at it.`,
      (topic, cat) => `Stop believing this ${topic} myth — ${cat.statHook}.`,
      (topic, cat) => `Nobody wants to admit this about ${topic}, but here it is anyway.`,
      (topic, cat) => `If you're into ${topic}, this is going to make some people angry.`,
    ],
    pacing: 'Fast, punchy cuts. Deliver the controversial line with zero hesitation — confidence sells the claim.',
    ctaEngagement: (topic, cat) => `Comment "WRONG" if you disagree — let's debate ${topic} in the replies.`,
    ctaShare: (topic, cat) => `Send this to the one friend who still believes the old way about ${topic}.`,
    ctaSales: (topic, cat) => `If you want the full breakdown behind this ${topic} take, it's linked in my bio.`,
  },
  storytelling: {
    label: 'Storytelling / POV',
    icon: BookOpen,
    hookBank: [
      (topic, cat) => `POV: you finally figured out ${topic} after ${cat.painPoint}.`,
      (topic, cat) => `The day I almost gave up on ${topic} — until this happened.`,
      (topic, cat) => `Nobody told me this story about ${topic} until it was almost too late.`,
      (topic, cat) => `This is the moment everything about my ${topic} journey changed.`,
    ],
    pacing: 'Slower, warmer pacing. Let a beat of silence land after the emotional turn before moving to the payoff.',
    ctaEngagement: (topic, cat) => `Comment your own ${topic} turning point — I read every single one.`,
    ctaShare: (topic, cat) => `Share this with someone going through the same ${topic} struggle right now.`,
    ctaSales: (topic, cat) => `I put the full story and the exact steps in the resource linked in my bio.`,
  },
  educational: {
    label: 'Educational / Value Bomb',
    icon: Lightbulb,
    hookBank: [
      (topic, cat) => `Here's exactly how ${topic} actually works — no fluff, just the mechanics.`,
      (topic, cat) => `3 things about ${topic} that instantly separate beginners from pros.`,
      (topic, cat) => `${cat.statHook.charAt(0).toUpperCase() + cat.statHook.slice(1)}. Let me fix that for you.`,
      (topic, cat) => `Save this — it's the clearest explanation of ${topic} you'll see today.`,
    ],
    pacing: 'Clean, confident, information-dense delivery. Use on-screen text to reinforce every key point.',
    ctaEngagement: (topic, cat) => `Comment "GUIDE" and I'll send you the full ${topic} breakdown.`,
    ctaShare: (topic, cat) => `Share this with someone who's just getting started with ${topic}.`,
    ctaSales: (topic, cat) => `The complete ${topic} system is linked in my bio if you want to go deeper.`,
  },
  productivity: {
    label: 'Productivity Hack',
    icon: Rocket,
    hookBank: [
      (topic, cat) => `This ${topic} hack saved me hours every single week.`,
      (topic, cat) => `Do this before you touch ${topic} again — it changes everything.`,
      (topic, cat) => `The 2-minute trick that fixed my entire approach to ${topic}.`,
      (topic, cat) => `If you're short on time but serious about ${topic}, watch this.`,
    ],
    pacing: 'Brisk, efficient pacing that mirrors the "hack" — no wasted seconds, quick numbered beats.',
    ctaEngagement: (topic, cat) => `Comment your biggest ${topic} time-waster — I might fix it in part 2.`,
    ctaShare: (topic, cat) => `Send this to someone who's always saying they don't have time for ${topic}.`,
    ctaSales: (topic, cat) => `Grab my full ${topic} workflow template linked in my bio.`,
  },
};

function buildStoryboard(topic, category, tone) {
  const audioBank = [
    'Trending upbeat sound builds under the hook',
    'Sudden silence for one beat to add weight',
    'Soft bass swell leading into the reveal',
    'Quick whoosh transition SFX',
    'Typing/click SFX synced to on-screen text',
    'Music ducks slightly so voiceover cuts through',
    'Subtle riser building toward the CTA',
  ];
  return [
    {
      time: '0:00–0:03',
      onCamera: 'Direct to camera, strong eye contact, deliver the hook line with full conviction.',
      bRoll: `${category.bRoll[0]}, flashed for half a second to punctuate the opening line`,
      textOverlay: 'Hook line appears in bold, word-by-word pop-in',
      audio: audioBank[0],
    },
    {
      time: '0:03–0:07',
      onCamera: `Brief context: name the exact problem — ${category.painPoint}.`,
      bRoll: category.bRoll[1],
      textOverlay: '"Sound familiar?"',
      audio: audioBank[1],
    },
    {
      time: '0:07–0:13',
      onCamera: `Deliver value point #1 tied to ${topic}, speaking slightly faster to build energy.`,
      bRoll: category.bRoll[2],
      textOverlay: 'Value point #1 as a short on-screen label',
      audio: audioBank[2],
    },
    {
      time: '0:13–0:19',
      onCamera: `Deliver value point #2 — this is where you reveal ${category.secretTip}.`,
      bRoll: category.bRoll[3],
      textOverlay: 'Value point #2 + a checkmark icon animation',
      audio: audioBank[4],
    },
    {
      time: '0:19–0:24',
      onCamera: 'Show the proof or payoff — the visible result of applying the tip.',
      bRoll: `${category.bRoll[4]}, held a beat longer than the other cutaways`,
      textOverlay: '"Here\'s the result" label with an arrow pointing to the proof',
      audio: audioBank[3],
    },
    {
      time: '0:24–0:27',
      onCamera: 'Emotional peak — genuine reaction shot (relief, excitement, satisfaction).',
      bRoll: 'Slow-motion close-up of the reaction for emphasis',
      textOverlay: 'No text — let the reaction breathe',
      audio: audioBank[5],
    },
    {
      time: '0:27–0:30',
      onCamera: 'Direct to camera for the CTA, slightly warmer tone than the hook.',
      bRoll: 'Cut back to the same framing as the hook for a satisfying bookend',
      textOverlay: 'CTA text pinned at the bottom third',
      audio: audioBank[6],
    },
  ];
}

function generateProScript(topicRaw, toneKey) {
  const topic = (topicRaw || 'this').trim();
  const category = matchCategory(topic);
  const tone = TONE_CONFIG[toneKey] || TONE_CONFIG.educational;
  const hooks = tone.hookBank.slice(0, 3).map((fn) => fn(topic, category));
  const storyboard = buildStoryboard(topic, category, tone);
  return {
    hooks,
    storyboard,
    pacing: tone.pacing,
    ctas: {
      engagement: tone.ctaEngagement(topic, category),
      share: tone.ctaShare(topic, category),
      sales: tone.ctaSales(topic, category),
    },
    toneLabel: tone.label,
    categoryLabel: category.label,
  };
}

function ScriptBuilder() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('educational');
  const [script, setScript] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setScript(generateProScript(topic, tone));
      setIsGenerating(false);
    }, 350);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <label className="text-sm font-medium text-[#5B6B57] mb-2 block">Video topic / idea</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. coding, skincare, gym, travel vlog…"
            className="flex-1 rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-5 py-3 font-medium hover:bg-[#413F3B] active:scale-[0.97] transition-all duration-200 shrink-0 disabled:opacity-60"
          >
            {isGenerating ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
            {isGenerating ? 'Building…' : 'Generate'}
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#5B6B57] mb-3 tracking-wide">SCRIPT TONE / STYLE</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Object.entries(TONE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = tone === key;
            return (
              <button
                key={key}
                onClick={() => setTone(key)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 border transition-all duration-300 ${
                  active
                    ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8] shadow-md scale-[1.02]'
                    : 'bg-white/50 backdrop-blur-sm border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8] hover:bg-white/80'
                }`}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span className="text-[11px] font-medium text-center leading-tight">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {script && (
        <div className="space-y-5 animate-[fadein_0.4s_ease]">
          <div className="rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-4 flex flex-wrap gap-2 items-center text-xs text-[#6B665C]">
            <span className="rounded-full bg-[#EEF2EB] text-[#5B6B57] px-3 py-1 font-medium">{script.categoryLabel}</span>
            <span className="rounded-full bg-[#F3EFFA] text-[#5B4F8A] px-3 py-1 font-medium">{script.toneLabel}</span>
            <span className="italic">{script.pacing}</span>
          </div>

          <ScriptSection label="MULTI-HOOK MATRIX" sub="3 alternate openings" color="#C9BFE8" bg="#F3EFFA" icon={Sparkles}>
            <div className="space-y-3">
              {script.hooks.map((h, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#C9BFE8]/40 text-[#5B4F8A] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-[#3A3733] leading-relaxed text-sm">{h}</p>
                </div>
              ))}
            </div>
          </ScriptSection>

          <ScriptSection label="VISUAL STORYBOARD FLOW" sub="shot-by-shot, timestamped" color="#A8B79D" bg="#EEF2EB" icon={Film}>
            <div className="space-y-3">
              {script.storyboard.map((beat, i) => (
                <div key={i} className="rounded-xl bg-white/70 border border-[#EDE8DC] p-4">
                  <p className="text-xs font-bold text-[#8DA184] tracking-wider mb-2">{beat.time}</p>
                  <div className="space-y-1.5 text-sm text-[#3A3733]">
                    <p className="flex gap-2"><Camera size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[On-Camera Action]</span> {beat.onCamera}</span></p>
                    <p className="flex gap-2"><MonitorPlay size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[B-Roll Layer]</span> {beat.bRoll}</span></p>
                    <p className="flex gap-2"><Type size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[Text on Screen]</span> {beat.textOverlay}</span></p>
                    <p className="flex gap-2"><Mic size={14} className="mt-0.5 shrink-0 text-[#8DA184]" /><span><span className="font-semibold">[Audio/SFX]</span> {beat.audio}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </ScriptSection>

          <ScriptSection label="CONVERSION CTA MATRIX" sub="engagement · shares · sales" color="#E9C9C0" bg="#FBF1EE" icon={Clapperboard}>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Engagement:</span> {script.ctas.engagement}</p>
              </div>
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <Share2 size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Share:</span> {script.ctas.share}</p>
              </div>
              <div className="flex gap-3 rounded-xl bg-white/70 border border-[#EDE8DC] p-3">
                <ShoppingBag size={16} className="mt-0.5 shrink-0 text-[#C79C8E]" />
                <p className="text-sm text-[#3A3733] leading-relaxed"><span className="font-semibold">Sales:</span> {script.ctas.sales}</p>
              </div>
            </div>
          </ScriptSection>
        </div>
      )}
    </div>
  );
}

function ScriptSection({ label, sub, color, bg, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-[#E4DFD3] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: bg }}>
        <Icon size={16} style={{ color }} />
        <span className="text-xs font-bold tracking-wider text-[#3A3733]">{label}</span>
        <span className="text-xs text-[#8A8578] ml-auto">{sub}</span>
      </div>
      <div className="p-4 sm:p-5 bg-white/40">{children}</div>
    </div>
  );
}


export default ScriptBuilder;
