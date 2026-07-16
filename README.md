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

## IndexNow (instant indexing for Bing, Yandex, and other participating engines)

IndexNow is a separate, much faster path than sitemaps: instead of waiting for a crawler to come back,
you push the URL directly to the search engine the moment it changes. Google doesn't participate in
IndexNow (Search Console + sitemap is still how you reach Google), but Bing, Yandex, Seznam.cz, and
Naver do.

### How it's wired up
| File | Purpose |
|---|---|
| `lib/indexNowConfig.js` | Holds `INDEXNOW_KEY`. A working default key ships out of the box. |
| `app/[key]/route.js` | Serves `https://yourdomain.com/<KEY>.txt` — the verification file search engines fetch to confirm you own the site. Any other `*.txt` request correctly 404s here. |
| `app/api/indexnow/route.js` | `POST` endpoint — send it `{ "urls": [...] }` and it forwards the submission to the real IndexNow API, with input validation and clear error messages for the 400/403/422/429 cases. |
| `scripts/submit-indexnow.mjs` | A ready-to-run script that submits the homepage + all tool pages in one call. |
| `.env.local.example` | Documents `INDEXNOW_KEY` and `INDEXNOW_SUBMIT_SECRET`. |

### The key file — why `app/[key]/route.js` and not `app/[key].txt/route.js`
Next.js dynamic segments can't mix literal characters with brackets in a folder name — `[key].txt` as a
folder name isn't valid App Router syntax. The fix used here is just as exact: a single dynamic segment
(`[key]`) captures the **entire** path segment, dots included. So a request for
`/ea7a587bf0d4aa44bea0e98e94b7c4b8.txt` arrives with `params.key` equal to that whole string, and the
route handler compares it against `${INDEXNOW_KEY}.txt` before responding. Next.js still resolves static
routes (like `/instagram-story-maker`) ahead of this dynamic catch-all at the same level, so there's no
conflict with any other page.

### Setting your own key (recommended before going live)
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```
Put the result in `.env.local` (copy `.env.local.example` first) and in your Vercel project's
**Settings → Environment Variables**:
```
INDEXNOW_KEY=your-generated-key
```

### Securing the submission endpoint
Without `INDEXNOW_SUBMIT_SECRET` set, `POST /api/indexnow` is open to anyone — fine for local testing,
not for production, since a stranger could waste your submission quota. Set a secret before deploying:
```
INDEXNOW_SUBMIT_SECRET=some-long-random-string
```
Then every request must include a matching header:
```
x-indexnow-secret: some-long-random-string
```

### Testing locally
```bash
npm run dev
# in another terminal:
curl http://localhost:3000/<your-key>.txt
# → should print your raw key, content-type: text/plain; charset=utf-8

curl -X POST http://localhost:3000/api/indexnow \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://yourdomain.com/instagram-story-maker"]}'
```
Note: IndexNow verifies your key file over the **public internet**, so a submission tested from
`localhost` will fail at the "IndexNow could not verify your key file" step even if everything is
wired correctly — that check only succeeds once `SITE_URL` is live and deployed.

### Triggering it in production
Once deployed with the right `SITE_URL`, `INDEXNOW_KEY`, and `INDEXNOW_SUBMIT_SECRET`:
```bash
INDEXNOW_SUBMIT_SECRET=your-secret npm run indexnow
```
This submits every page on the site in one call. Run it manually after any content update, or wire it
into your deploy process — e.g. a GitHub Action step after a successful Vercel deploy, or a
`postbuild`/deploy-hook script that calls the same `curl` command shown above with your production URLs.

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
