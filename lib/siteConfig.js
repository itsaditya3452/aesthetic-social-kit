// This MUST exactly match your actual live domain — canonical tags, the
// sitemap, Open Graph URLs, and IndexNow submissions all derive from this.
// A mismatch here (e.g. leaving a placeholder domain you haven't deployed)
// tells search engines your canonical page lives somewhere that doesn't
// resolve, which can block indexing entirely even after a successful crawl.
// If you later attach a custom domain in Vercel, update this to match and
// redeploy.
export const SITE_URL = 'https://aesthetic-social-kit.vercel.app';

export const SITE_NAME = 'Aesthetic Social Kit';

export const SITE_TITLE = 'Aesthetic Social Kit — Free Instagram Creator Tools';

export const SITE_DESCRIPTION =
  '10 free browser-based tools for creators: story maker, Reels script generator, link in bio, media kit, caption studio, and more. No login needed.';

export const KEYWORDS = [
  // Brand
  'aesthetic social kit',
  'free instagram tools for creators',
  'all in one instagram tool free',
  'instagram creator toolkit free',
  'social media tools free no login',
  'content creator tools free india',

  // Story Maker
  'free instagram story maker',
  'instagram story generator online',
  'instagram story maker no login',
  'aesthetic status maker',
  'birthday story template free',
  'quote story maker',
  'minimalist quote template',
  'travel story template instagram',
  'animated instagram story generator',
  'hd story download jpg',
  'instagram story banane wala app',
  'free status maker without watermark',
  'aesthetic status kaise banaye',

  // Travel Route Video
  'travel route video maker free',
  'travel map video generator',
  'gpx to video converter',
  'animated map video maker',
  'trip route video maker free',
  'mult.dev alternative free',

  // Birthday Gift
  'free birthday ecard maker',
  'virtual birthday gift generator',
  'animated birthday card free',
  'birthday gift link generator',
  'gifft.me alternative free',
  'online birthday card banane wala',
  'happy birthday video card maker free',

  // Script Generator
  'reels script generator',
  'viral video script generator',
  'hook generator for reels',
  'tiktok script generator free',
  'shorts script generator',
  'video hook ideas generator',
  'storyboard generator for reels',
  'reels ke liye script kaise likhe',
  'viral reels ideas generator free',

  // Caption Studio
  'instagram caption generator',
  'caption generator free',
  'hashtag generator free',
  'niche hashtag generator',
  'caption formatter instagram',
  'fancy text generator instagram',
  'unicode font generator',
  'bold text generator instagram',
  'instagram engagement predictor',
  'viral caption score',
  'instagram ke liye caption generator',
  'hashtag kaise banaye instagram ke liye',

  // YouTube Kit
  'youtube hook generator free',
  'youtube shorts hook ideas',
  'thumbnail ab testing tool free',
  'youtube thumbnail preview tool',
  'youtube ctr optimizer free',
  'youtube video hook kaise likhe',

  // Grid & Carousel
  'instagram grid planner free',
  'reel to grid crop tool',
  'instagram carousel maker free',
  'seamless carousel template',
  'instagram feed planner free',
  'instagram grid kaise banaye',

  // Link in Bio
  'link in bio free',
  'free linktree alternative',
  'bio link maker free',
  'instagram bio link generator',
  'linktree alternative free india',
  'bio link kaise banaye',

  // Media Kit
  'free media kit generator',
  'influencer media kit template free',
  'media kit maker online free',
  'creator media kit generator',
  'media kit kaise banaye',

  // Rate Calculator
  'influencer rate calculator free',
  'instagram engagement rate calculator',
  'sponsorship rate calculator',
  'how much to charge for sponsored post',
  'brand collab rate kaise decide kare',

  // General / long-tail intent
  'social media content creator tool',
  'content creator toolkit free',
  'instagram reels ideas generator',
  'tiktok caption generator',
  'youtube shorts description generator',
  'social media kit online free',
  'creator economy tools',
  'client side story maker',
  'no backend social media tool',
  'free tools for instagram influencers',
  'instagram influencer tools free india',
];

// Per-page SEO metadata. Each tool now lives on its own URL so it can rank
// independently for its own set of keywords, instead of all tools competing
// for the same homepage.
export const TOOL_PAGES = {
  storyMaker: {
    slug: 'instagram-story-maker',
    title: 'Free Instagram Story Maker Online — Animated Templates, No Login',
    description:
      'Create animated Instagram & Facebook story templates — Birthday Bash, Minimalist Quote, and Travel Vibe — right in your browser. Export in HD JPG. 100% free, no account needed.',
    keywords: [
      'instagram story maker',
      'free instagram story maker online',
      'instagram story maker no login',
      'aesthetic status maker',
      'birthday story template free',
      'quote story maker online',
      'minimalist quote template instagram',
      'travel story template instagram',
      'animated instagram story generator',
      'instagram story generator free',
      'hd story download jpg',
      'facebook story maker free',
      'story template maker online',
      'aesthetic instagram story ideas',
      'instagram story banane wala app',
      'free status maker without watermark',
      'aesthetic status kaise banaye online',
      'birthday story maker free india',
    ],
  },
  routeAnimator: {
    slug: 'travel-video-maker',
    title: 'Free Travel Route Video Maker — Animated Map Video Generator',
    description:
      'Turn your trip into an animated map video. Add stops, import GPX/KML/GeoJSON, pick a transport icon per leg, and export a real video — free, no login, no app to install.',
    keywords: [
      'travel route video maker',
      'travel map video generator free',
      'gpx to video converter',
      'animated map video maker',
      'route animation video free',
      'travel video maker online free',
      'map animation generator',
      'kml to video',
      'trip route video maker',
      'travel itinerary video maker',
      'mult.dev alternative free',
      'free travel map animation',
      'travel vlog map video maker',
      'trip video maker with route',
    ],
  },
  birthdayGift: {
    slug: 'birthday-gift-maker',
    title: 'Free Birthday eCard Maker — Animated Virtual Birthday Gift Generator',
    description:
      'Create a free animated birthday eCard with balloons, confetti, candles, or fireworks. Add a photo and message, then share an instant link — no account, no app, no cost.',
    keywords: [
      'free birthday ecard maker',
      'virtual birthday gift generator',
      'animated birthday card free',
      'send birthday gift online free',
      'birthday ecard no login',
      'free online birthday card maker',
      'birthday gift link generator',
      'gifft.me alternative free',
      'digital birthday card free',
      'animated happy birthday card maker',
      'birthday video card maker free',
      'happy birthday gift generator online',
      'online birthday card banane wala',
      'happy birthday video card maker free',
      'birthday wish video maker free',
    ],
  },
  scriptBuilder: {
    slug: 'reels-script-generator',
    title: 'Free Reels & TikTok Script Generator — Viral Hook + CTA Framework',
    description:
      'Generate a viral-ready Reels or TikTok script from any topic: a multi-hook matrix, a timestamped shot-by-shot storyboard, and a conversion CTA matrix. Free, no login required.',
    keywords: [
      'reels script generator',
      'tiktok script generator free',
      'viral video script generator',
      'hook generator for reels',
      'shorts script generator free',
      'video hook ideas generator',
      'storyboard generator for reels',
      'instagram reels ideas generator',
      'youtube shorts script generator',
      'ai script generator for videos free',
      'content script generator online',
      'video script writer free',
      'reels ke liye script kaise likhe',
      'viral reels ideas generator free',
      'youtube shorts hook generator free',
    ],
  },
  captionStudio: {
    slug: 'instagram-caption-generator',
    title: 'Free Instagram Caption Generator — Viral Caption Score & Hashtags',
    description:
      'Format captions with aesthetic line breaks and fancy Unicode fonts, generate a niche hashtag stack, and get a live Viral Potential Score with tips — free, for Instagram, TikTok & YouTube.',
    keywords: [
      'instagram caption generator',
      'caption generator free',
      'hashtag generator free',
      'niche hashtag generator',
      'caption formatter instagram',
      'fancy text generator instagram',
      'unicode font generator',
      'bold text generator instagram',
      'instagram engagement predictor',
      'viral caption score',
      'tiktok caption generator',
      'youtube shorts description generator',
      'caption writer online free',
      'instagram ke liye caption generator',
      'hashtag kaise banaye instagram ke liye',
      'best caption for instagram generator',
    ],
  },
  youtubeCreatorKit: {
    slug: 'youtube-hook-generator',
    title: 'Free YouTube Shorts Hook Generator & A/B Thumbnail Tester',
    description:
      'Generate 5 psychology-backed hook formulas for any topic, and preview two thumbnails side-by-side in a real YouTube feed mockup — free, no login, runs entirely in your browser.',
    keywords: [
      'youtube hook generator',
      'youtube shorts hook ideas',
      'video hook generator free',
      'hook formula generator',
      'youtube shorts script hook',
      'clickbait hook generator',
      'thumbnail ab testing tool',
      'youtube thumbnail preview tool',
      'youtube title tester free',
      'thumbnail comparison tool free',
      'youtube ctr optimizer',
      'youtube thumbnail maker free',
      'compare youtube thumbnails online',
      'youtube video hook kaise likhe',
      'best youtube thumbnail tester free',
    ],
  },
  gridSlidePlanner: {
    slug: 'instagram-grid-planner',
    title: 'Free Instagram Grid Planner — Reel Crop Previewer & Carousel Draft Tool',
    description:
      'Preview how your 9:16 Reel crops into the 1:1 profile grid with a drag-to-adjust slider, and draft seamless multi-slide carousels with a swipeable preview — free, no login, runs in your browser.',
    keywords: [
      'instagram grid planner free',
      'reel to grid crop tool',
      'instagram crop preview tool',
      'instagram carousel maker free',
      'seamless carousel template',
      'instagram grid preview online',
      'reels profile grid preview',
      'instagram post crop tool',
      'carousel slide planner',
      'instagram feed planner free',
      'square crop tool instagram',
      'multi slide carousel preview',
      'instagram grid kaise banaye',
      'reel ko grid me kaise dekhe',
    ],
  },
  bioLinkBuilder: {
    slug: 'bio-link-builder',
    title: 'Free Link in Bio Maker — Custom Bio Page for Instagram, No Login',
    description:
      'Build a free "link in bio" page — your name, bio, and links, live at a shareable URL in seconds. No account, no monthly fee, unlike Linktree or Beacons.',
    keywords: [
      'link in bio free',
      'free linktree alternative',
      'bio link maker free',
      'instagram bio link generator',
      'link in bio page maker',
      'free link in bio no login',
      'custom bio link page',
      'linktree alternative free',
      'beacons alternative free',
      'social media link page free',
      'bio link tool for instagram',
      'creator link page free',
      'bio link kaise banaye',
      'free bio link for instagram india',
      'linktree jaisa free tool',
    ],
  },
  mediaKitGenerator: {
    slug: 'media-kit-generator',
    title: 'Free Influencer Media Kit Generator — Downloadable, No Login',
    description:
      'Create a professional media kit with your stats, audience breakdown, and brand collabs, then download it as an image to send to brands — free, no account, no watermark.',
    keywords: [
      'free media kit generator',
      'influencer media kit template free',
      'media kit maker online free',
      'creator media kit generator',
      'instagram media kit template',
      'free rate card generator',
      'influencer press kit maker',
      'media kit for brands free',
      'download media kit free',
      'influencer stats sheet generator',
      'media kit kaise banaye',
      'brand pitch kit maker free',
    ],
  },
  rateCalculator: {
    slug: 'influencer-rate-calculator',
    title: 'Free Influencer Rate & Engagement Rate Calculator',
    description:
      'Calculate your Instagram engagement rate and get a starting-point sponsorship rate estimate based on your followers and engagement — free, instant, no login.',
    keywords: [
      'influencer rate calculator free',
      'instagram engagement rate calculator',
      'sponsorship rate calculator',
      'influencer pricing calculator',
      'how much to charge for sponsored post',
      'engagement rate calculator free',
      'instagram rate card calculator',
      'creator rate calculator',
      'influencer collab rate calculator',
      'brand collab rate kaise decide kare',
      'instagram post ka rate kitna hona chahiye',
    ],
  },
};



