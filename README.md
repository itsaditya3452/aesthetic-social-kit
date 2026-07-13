# Aesthetic Social Kit — Pro

A zero-backend creator suite built with Next.js 14, Tailwind CSS, and lucide-react. Everything runs
client-side — no database, no API keys, no login.

## Features
- **Animated Story & Reel Cover Engine** — Birthday Bash, Minimalist Quote, and Travel Vibe templates,
  all animating live on an HTML5 canvas (floating particles, typewriter reveal, Ken Burns pan/zoom),
  exportable as a clean HD JPG frame.
- **Pro Script Flow Generator** — a topic + tone-driven engine (Controversial, Storytelling, Educational,
  Productivity) that outputs a multi-hook matrix, a timestamped shot-by-shot storyboard, and a CTA matrix.
- **Viral Caption Studio** — aesthetic line breaks, three Unicode font styles, a live Viral Potential Score
  with actionable tips, a niche hashtag generator, and platform presets for Instagram, TikTok, and YouTube.

## SEO setup (new)
- `lib/siteConfig.js` — central place for your site URL, title, description, and keyword list.
  **Update `SITE_URL` here to your real domain before deploying.**
- `app/layout.js` — full metadata: title template, description, keywords, Open Graph, Twitter cards,
  canonical URL, and robots directives, plus JSON-LD structured data (`WebApplication` + `FAQPage` schema)
  for rich search results.
- `app/page.jsx` — now a server component so its content is crawlable; renders the interactive app
  (`components/AestheticSocialKitApp.jsx`) plus a keyword-rich intro section and an FAQ block.
- `app/sitemap.js` / `app/robots.js` — auto-generate `/sitemap.xml` and `/robots.txt` using the Next.js
  App Router conventions.
- `app/opengraph-image.jsx` / `app/icon.jsx` — auto-generated share-preview image and favicon, no static
  image files needed.

### After deploying
1. Update `SITE_URL` in `lib/siteConfig.js` to your live domain, then redeploy.
2. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Request indexing for the homepage in Search Console to speed up discovery.
4. Keep adding real, specific content over time (blog posts, template examples) — rankings come from
   depth and freshness, not just tags. The keyword list in `siteConfig.js` reflects real search terms
   for this niche, but no site ranks from metadata alone.

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
