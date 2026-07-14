# Aesthetic Social Kit — Pro

A zero-backend creator suite built with Next.js 14, Tailwind CSS, and lucide-react. Everything runs
client-side — no database, no API keys, no login, no paid services.

## Features

- **Animated Story & Reel Cover Engine** — Birthday Bash, Minimalist Quote, and Travel Vibe templates,
  animating live on an HTML5 canvas, exportable as a clean HD JPG frame.
- **Travel Route Animator** — animates a route across a real map (free CARTO/OSM tiles), supports
  GPX/KML/GeoJSON import, free place-name geocoding, transport-mode styling, and native video export.
- **Birthday Gift** *(new, inspired by gifft.me)* — build an animated birthday eCard (Balloons, Confetti,
  Candles, or Fireworks theme) with a photo, name, age, and message, then:
  - **Copy Shareable Gift Link** — the entire gift is encoded directly into the URL itself (as a hash
    fragment, which browsers never send to any server), so opening the link plays the animated reveal
    full-screen for the recipient. No account, no database, no expiry — it works as long as the link exists.
  - **Export Video** — records the reveal as a real WebM video via the browser's native `MediaRecorder`,
    so it can be sent directly as a file over WhatsApp/Instagram/Telegram instead of a link.
  - **Download Card** — a static HD JPG of the fully-revealed card.
- **Pro Script Flow Generator** — topic + tone-driven engine (Controversial, Storytelling, Educational,
  Productivity) that outputs a multi-hook matrix, a timestamped storyboard, and a CTA matrix.
- **Viral Caption Studio** — aesthetic line breaks, Unicode font styles, a live Viral Potential Score,
  a hashtag generator, and platform presets for Instagram, TikTok, and YouTube.

### How the gift link works with no backend (technical note)
Everything about the gift — name, age, message, theme, and (optionally) a tiny compressed photo — is
serialized to JSON, UTF-8-safe base64-encoded, and placed after a `#gift=` in the URL. Because it's in
the *hash fragment* (after the `#`), browsers never transmit it to any server on page load — it's 100%
peer-to-peer via whatever app carries the link (WhatsApp, SMS, etc.). The tradeoff: including a photo makes
the link longer (a small compressed thumbnail is used by default, and it's opt-in via a checkbox precisely
because of this). There's no server-side storage, so a gift can't be "found" later except through the
link itself — that's the cost of avoiding a database entirely.

### A note on "free forever" for the map feature
The route animator uses CARTO's public basemap tiles and OpenStreetMap's free Nominatim geocoder — both
genuinely free, no API key. They're intended for personal/hobby-scale traffic. If that tab gets serious
traffic, swap in a free-tier key from Stadia Maps or MapTiler in `lib/mapEngine.js` — still $0 for
generous limits, just with guaranteed uptime under load.

## SEO setup
- `lib/siteConfig.js` — site URL, title, description, keyword list. **Update `SITE_URL` before deploying.**
- `app/layout.js` — full metadata, Open Graph, Twitter cards, canonical URL, JSON-LD structured data.
- `app/page.jsx` — server component with crawlable intro copy + FAQ, wrapping the interactive app.
- `app/sitemap.js` / `app/robots.js` — auto-generated `/sitemap.xml` and `/robots.txt`.
- `app/opengraph-image.jsx` / `app/icon.jsx` — auto-generated share image and favicon.

### After deploying
1. Update `SITE_URL` in `lib/siteConfig.js` to your live domain, then redeploy.
2. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

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
git commit -m "Aesthetic Social Kit Pro"
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
