export const SCRIPT_LIBRARY = [
  {
    keys: ['code', 'coding', 'programming', 'developer', 'software', 'dev'],
    hook: (t) => `Stop scrolling if you write code — this ${t} trick will save you hours.`,
    body: [
      '[Cut to close-up on your screen] Show the messy "before" code — let it feel relatable.',
      '[Text overlay: "here\'s the fix"] Reveal the one-line or one-concept solution.',
      '[Screen recording, sped up 2x] Walk through implementing it step by step.',
      '[Cut to your reaction] React genuinely — "wait, that actually worked."',
    ],
    cta: (t) => `Save this before you forget it — and follow for more ${t} shortcuts every week.`,
  },
  {
    keys: ['fitness', 'gym', 'workout', 'exercise', 'training'],
    hook: (t) => `Nobody is telling you this about ${t} — and it's costing you results.`,
    body: [
      '[Cut to gym floor, handheld shot] Show the common mistake people make.',
      '[Text overlay: "here\'s what actually works"] Demonstrate the correct form or method.',
      '[Quick cut montage of 3 reps] Show it in action with clean, punchy cuts.',
      '[Close-up on effort / sweat] Add intensity to keep retention high.',
    ],
    cta: (t) => `Try this in your next session and tag me in your progress — follow for more ${t} tips.`,
  },
  {
    keys: ['food', 'recipe', 'cooking', 'baking', 'kitchen'],
    hook: (t) => `You've been making ${t} wrong this whole time. Here's the fix.`,
    body: [
      '[Overhead shot, ingredients laid out] Introduce the dish visually first.',
      '[Cut to close-up chopping/mixing] Fast, satisfying prep shots.',
      '[Text overlay: "the secret step"] Reveal the one detail most people skip.',
      '[Steam / sizzle sound cue] Show the final plating in slow motion.',
    ],
    cta: (t) => `Comment "recipe" and I'll drop the full one — follow for daily ${t} inspo.`,
  },
  {
    keys: ['travel', 'vlog', 'trip', 'vacation'],
    hook: (t) => `POV: you found the ${t} spot everyone's been hiding from you.`,
    body: [
      '[Drone or wide establishing shot] Set the scene in one breathtaking frame.',
      '[Quick cut montage] Stack 3-4 fast clips of different moments/locations.',
      '[Text overlay: location + cost] Give a practical detail viewers can use.',
      '[Cut to golden hour shot] End the body on the most visually striking clip.',
    ],
    cta: (t) => `Save this for your next trip and follow for more hidden ${t} spots.`,
  },
  {
    keys: ['money', 'finance', 'business', 'startup', 'invest'],
    hook: (t) => `I wish someone told me this about ${t} before I lost money.`,
    body: [
      '[Direct to camera, close-up] State the mistake plainly and with confidence.',
      '[Text overlay: key number/stat] Back it up with one striking fact.',
      '[Cut to whiteboard/phone screen] Break down the simple fix step by step.',
      '[Zoom in for emphasis] Land the key takeaway on one clear sentence.',
    ],
    cta: (t) => `Follow for daily ${t} lessons that actually apply to real life.`,
  },
  {
    keys: ['skincare', 'beauty', 'makeup', 'glow'],
    hook: (t) => `Your ${t} routine is missing this one step — and it shows.`,
    body: [
      '[Close-up on skin/product] Show the "before" texture honestly.',
      '[Text overlay: product name + step] Apply it on camera in real time.',
      '[Quick cut, 10-second timelapse] Show the visible change.',
      '[Natural light close-up] Reveal the "after" with a satisfying glow shot.',
    ],
    cta: (t) => `Save this routine and follow for more ${t} tips that actually work.`,
  },
  {
    keys: ['study', 'productivity', 'exam', 'focus', 'student'],
    hook: (t) => `If you struggle to focus while you ${t}, watch this till the end.`,
    body: [
      '[Cut to desk setup, top-down] Show the distraction-free environment.',
      '[Text overlay: "the 3-step method"] List the method as fast on-screen text.',
      '[Timelapse of you working] Demonstrate the method in real time.',
      '[Cut to checklist ticking off] Show the visible result of following it.',
    ],
    cta: (t) => `Try this for one week and thank me later — follow for more study systems.`,
  },
  {
    keys: ['gaming', 'game', 'gamer', 'esports'],
    hook: (t) => `This ${t} setting is why you keep losing — nobody talks about it.`,
    body: [
      '[Screen capture, gameplay clip] Show the losing moment first.',
      '[Text overlay: "the fix"] Reveal the setting/strategy change.',
      '[Split-screen before/after] Show the same scenario played correctly.',
      '[Cut to hype reaction] React with genuine excitement at the win.',
    ],
    cta: (t) => `Follow for daily ${t} tips that'll actually rank you up.`,
  },
];

export const GENERIC_TEMPLATE = {
  hook: (t) => `Wait — if you're into ${t}, you need to see this.`,
  body: [
    '[Cut to close-up] Open on the most visually interesting moment first.',
    '[Text overlay: key insight] State your main point in one punchy line.',
    '[Quick cut montage] Stack 3 short supporting clips back to back.',
    '[Zoom in for emphasis] Land your strongest visual right before the CTA.',
  ],
  cta: (t) => `Follow for more on ${t} — you won't want to miss what's next.`,
};

export function generateScript(topicRaw) {
  const topic = topicRaw.trim();
  const lower = topic.toLowerCase();
  const match = SCRIPT_LIBRARY.find((entry) => entry.keys.some((k) => lower.includes(k)));
  if (match) {
    return {
      hook: match.hook(topic),
      body: match.body,
      cta: match.cta(topic),
    };
  }
  return {
    hook: GENERIC_TEMPLATE.hook(topic),
    body: GENERIC_TEMPLATE.body,
    cta: GENERIC_TEMPLATE.cta(topic),
  };
}
