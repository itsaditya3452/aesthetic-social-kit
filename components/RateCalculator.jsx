'use client';

import React, { useMemo, useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, IndianRupee, Info } from 'lucide-react';

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function getBenchmark(rate) {
  if (rate < 1) return { label: 'Below average', tone: 'low', icon: TrendingDown };
  if (rate < 3.5) return { label: 'Average', tone: 'mid', icon: Minus };
  if (rate < 6) return { label: 'Good', tone: 'good', icon: TrendingUp };
  return { label: 'Excellent', tone: 'great', icon: TrendingUp };
}

const TONE_STYLES = {
  low: { bg: '#FBF1EE', text: '#C97B6A', bar: '#E3A99A' },
  mid: { bg: '#FBF6E9', text: '#B08A2E', bar: '#D8C171' },
  good: { bg: '#EEF2EB', text: '#5B6B57', bar: '#A8B79D' },
  great: { bg: '#F3EFFA', text: '#5B4F8A', bar: '#C9BFE8' },
};

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export default function RateCalculator() {
  const [followers, setFollowers] = useState('');
  const [avgLikes, setAvgLikes] = useState('');
  const [avgComments, setAvgComments] = useState('');
  const [niche, setNiche] = useState('general');

  const NICHE_MULTIPLIERS = {
    general: { label: 'General / Lifestyle', mult: 1 },
    fashion: { label: 'Fashion & Beauty', mult: 1.15 },
    finance: { label: 'Finance & Business', mult: 1.4 },
    tech: { label: 'Tech & Gadgets', mult: 1.2 },
    food: { label: 'Food & Cooking', mult: 1.05 },
    fitness: { label: 'Fitness & Health', mult: 1.1 },
    travel: { label: 'Travel', mult: 1.1 },
  };

  const results = useMemo(() => {
    const f = Number(followers) || 0;
    const likes = Number(avgLikes) || 0;
    const comments = Number(avgComments) || 0;
    if (f <= 0) return null;

    const engagementRate = ((likes + comments) / f) * 100;
    const benchmark = getBenchmark(engagementRate);

    // Rough, transparent starting-point formula — NOT a market quote.
    // Base: ~₹150 per 1000 followers for a feed post, scaled by engagement
    // relative to the 2% "average" baseline, then by niche.
    const engagementMultiplier = clamp(engagementRate / 2, 0.5, 3);
    const nicheMultiplier = NICHE_MULTIPLIERS[niche].mult;
    const basePostRate = (f / 1000) * 150 * engagementMultiplier * nicheMultiplier;

    return {
      engagementRate,
      benchmark,
      post: basePostRate,
      reel: basePostRate * 1.6,
      story: basePostRate * 0.35,
      carousel: basePostRate * 1.25,
    };
  }, [followers, avgLikes, avgComments, niche]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-[#5B6B57] mb-1.5 block">Followers</label>
          <input
            type="number"
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            placeholder="24500"
            className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[#5B6B57] mb-1.5 block">Avg. likes/post</label>
          <input
            type="number"
            value={avgLikes}
            onChange={(e) => setAvgLikes(e.target.value)}
            placeholder="1800"
            className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[#5B6B57] mb-1.5 block">Avg. comments/post</label>
          <input
            type="number"
            value={avgComments}
            onChange={(e) => setAvgComments(e.target.value)}
            placeholder="120"
            className="w-full rounded-xl border border-[#E4DFD3] bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#A8B79D] focus:ring-2 focus:ring-[#A8B79D]/30 transition"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[#5B6B57] mb-2 block">Niche</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(NICHE_MULTIPLIERS).map(([key, n]) => (
            <button
              key={key}
              onClick={() => setNiche(key)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium border transition-all duration-200 ${
                niche === key ? 'bg-[#2B2A28] border-[#2B2A28] text-[#F5F1E8]' : 'bg-white/50 border-[#E4DFD3] text-[#3A3733] hover:border-[#C9BFE8]'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {results ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#E4DFD3] bg-white/60 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold tracking-wider text-[#8A8578] flex items-center gap-1.5"><Calculator size={13} /> ENGAGEMENT RATE</p>
              {(() => {
                const Icon = results.benchmark.icon;
                const tone = TONE_STYLES[results.benchmark.tone];
                return (
                  <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: tone.bg, color: tone.text }}>
                    <Icon size={12} /> {results.benchmark.label}
                  </span>
                );
              })()}
            </div>
            <p className="text-4xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
              {results.engagementRate.toFixed(2)}%
            </p>
            <div className="mt-3 h-2 rounded-full bg-[#EDE8DC] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${clamp(results.engagementRate * 10, 3, 100)}%`,
                  backgroundColor: TONE_STYLES[results.benchmark.tone].bar,
                }}
              />
            </div>
            <p className="text-xs text-[#8A8578] mt-2">
              Industry rule of thumb: under 1% is low, 1–3.5% average, 3.5–6% good, 6%+ excellent — these bands vary a lot by niche and follower count, so use them as a rough compass, not a grade.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-wider text-[#8A8578] mb-3 flex items-center gap-1.5"><IndianRupee size={13} /> SUGGESTED STARTING RATES</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Feed Post', value: results.post },
                { label: 'Reel', value: results.reel },
                { label: 'Carousel', value: results.carousel },
                { label: 'Story', value: results.story },
              ].map((r) => (
                <div key={r.label} className="rounded-xl border border-[#E4DFD3] bg-white/60 p-4 text-center">
                  <p className="text-lg font-semibold text-[#2B2A28]">{formatINR(r.value)}</p>
                  <p className="text-[11px] text-[#8A8578] mt-1">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E4DFD3] bg-[#F3EFFA] p-4 flex gap-2.5">
            <Info size={15} className="shrink-0 mt-0.5 text-[#5B4F8A]" />
            <p className="text-xs text-[#5B4F8A] leading-relaxed">
              This is a rough starting point calculated from your followers, engagement, and niche — not a
              market quote. Real rates also depend on your region, production quality, usage rights, and how
              much a brand wants you specifically. Use this as a floor to negotiate up from, not a fixed price.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E4DFD3] bg-white/40 p-10 text-center">
          <p className="text-sm text-[#8A8578]">Enter your follower count to see your engagement rate and rate estimate.</p>
        </div>
      )}
    </div>
  );
}
