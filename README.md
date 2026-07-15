# Aesthetic Social Kit — Pro

A zero-backend creator suite built with Next.js 14, Tailwind CSS, and lucide-react. Everything runs
client-side — no database, no API keys, no login, no paid services.

## Site structure (new — one URL per tool)

Each tool now has its own real page and URL, instead of being a tab hidden behind client-side state.
This means each one can rank independently in search for its own keywords, and each has its own title,
description, and keyword list.

| Page | URL | Targets |
|---|---|---|
| Home hub | `/` | "aesthetic social kit", links to every tool |
| Instagram Story Maker | `/instagram-story-maker` | instagram story maker, aesthetic status maker |
| Travel Route Video Maker | `/travel-video-maker` | travel map video generator, gpx to video |
| Birthday Gift Maker | `/birthday-gift-maker` | free birthday ecard, virtual birthday gift |
| Reels & TikTok Script Generator | `/reels-script-generator` | reels script generator, viral hook generator |
| Instagram Caption Generator | `/instagram-caption-generator` | instagram caption generator, hashtag generator |
| YouTube Creator Kit | `/youtube-hook-generator` | youtube hook generator, thumbnail ab testing tool |
| Instagram Grid & Slide Planner | `/instagram-grid-planner` | instagram grid planner, seamless carousel maker |

Navigating between tools uses real `<Link>` navigation (`components/ToolNav.jsx`), so the URL bar updates
on every click, back/forward buttons work correctly, and each page can be shared, bookmarked, or indexed
on its own.

### Where things live
- `components/ToolPageLayout.jsx` — shared header/nav/footer shell used by every tool page (server-rendered).
- `components/ToolNav.jsx` — the client-side nav bar that highlights the active route (`usePathname`).
- `components/FaqSection.jsx` — reusable server-rendered FAQ accordion for per-page SEO content.
- `components/StoryGenerator.jsx`, `TravelRouteAnimator.jsx`, `BirthdayGiftMaker.jsx` (+`BirthdayGiftPageClient.jsx`
  for the incoming-link detection), `ScriptBuilder.jsx`, `CaptionStudio.jsx` — the five tools themselves,
  each now a standalone component imported by exactly one page.
- `lib/siteConfig.js` — `TOOL_PAGES` holds each page's title, description, and keyword list in one place.

### Adding a 6th tool later
1. Build the tool as its own component in `components/`.
2. Add an entry to `TOOL_PAGES` in `lib/siteConfig.js` with a slug, title, description, and keywords.
3. Add a route to `TOOL_ROUTES` in `components/ToolNav.jsx`.
4. Create `app/your-slug/page.jsx` following the pattern in the existing tool pages.
5. Add a card for it in `app/page.jsx`'s `HUB_TOOLS` array.
The sitemap picks up new `TOOL_PAGES` entries automatically.

## Features
- **Instagram Story Maker** — Birthday Bash, Minimalist Quote, and Travel Vibe templates, animating live
  on an HTML5 canvas, exportable as HD JPG.
- **Travel Route Video Maker** — animates a route across a real map (free CARTO/OSM tiles), supports
  GPX/KML/GeoJSON import, free geocoding, transport-mode styling, and native video export.
- **Birthday Gift Maker** — animated eCard (Balloons/Confetti/Candles/Fireworks) with a zero-backend
  shareable link, plus video and image export.
- **Reels & TikTok Script Generator** — topic + tone-driven engine outputting a multi-hook matrix, a
  timestamped storyboard, and a CTA matrix.
- **Instagram Caption Generator** — aesthetic line breaks, Unicode fonts, a live Viral Potential Score,
  hashtag generator, and platform presets.
- **YouTube Creator Kit** — a Hook Generator (12 psychology-backed formulas, e.g. Negative Frame,
  Curiosity Gap, Contrarian Take) plus an A/B Thumbnail & Title Previewer rendered inside a realistic
  YouTube feed card with a light/dark mode toggle.
- **Instagram Grid & Slide Planner** — a Reel-to-grid crop previewer (drag directly on the preview or use
  a slider to choose what lands in the 1:1 profile grid, then export at 1080×1080) plus a seamless
  carousel draft tool (2–5 slides, a zero-gap "flow check" view, and a real swipeable carousel mock).

## SEO setup
- `lib/siteConfig.js` — `SITE_URL` (update before deploying), plus `TOOL_PAGES` for per-page metadata.
- `app/layout.js` — sitewide metadata defaults, title template (`%s | Aesthetic Social Kit`), Open Graph,
  Twitter cards, and JSON-LD structured data.
- Every tool page exports its own `metadata` (title, description, keywords, canonical URL).
- `app/sitemap.js` — auto-generates `/sitemap.xml` listing the home page and all tool pages.
- `app/robots.js`, `app/opengraph-image.jsx`, `app/icon.jsx` — robots.txt, share image, favicon.

### After deploying
1. Update `SITE_URL` in `lib/siteConfig.js` to your live domain, then redeploy.
2. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. In Search Console, request indexing for each of the 6 URLs individually the first time — it speeds
   up discovery of the new pages.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Push to GitHub
```bash
git init
git add .
git commit -m "Aesthetic Social Kit Pro — multi-page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Deploy to Vercel
1. Go to https://vercel.com/new
2. Import the GitHub repo you just pushed.
3. Leave all settings as default (Next.js is auto-detected).
4. Click **Deploy**.

No environment variables are required.
