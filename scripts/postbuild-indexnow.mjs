// Fires automatically after `next build` completes, because npm always runs
// a "postbuild" script right after "build" — no extra setup needed, no
// GitHub Action, no deploy hook. This is what makes IndexNow "automatic."
//
// It only actually submits when Vercel is building a PRODUCTION deployment
// (VERCEL_ENV === 'production', a variable Vercel sets during the build
// step itself). That guard matters:
//   - Local `npm run build` on your machine → skipped, no VERCEL_ENV set.
//   - Preview deployments (PRs, branches) → skipped, VERCEL_ENV is "preview".
//   - Production deployment (push to your Production Branch) → submits.
//
// Every failure path here is non-fatal on purpose: a broken or unreachable
// IndexNow API must never fail your actual site deployment.

import { SITE_URL, TOOL_PAGES } from '../lib/siteConfig.js';
import { INDEXNOW_KEY } from '../lib/indexNowConfig.js';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv !== 'production') {
    console.log(
      `[IndexNow] Skipping automatic submission — this isn't a production deploy ` +
      `(VERCEL_ENV=${vercelEnv ? `"${vercelEnv}"` : 'not set, likely a local build'}).`
    );
    return;
  }

  const host = new URL(SITE_URL).host;
  const urls = [SITE_URL, ...Object.values(TOOL_PAGES).map((page) => `${SITE_URL}/${page.slug}`)];

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  console.log(`[IndexNow] Production deploy detected — submitting ${urls.length} URL(s) automatically...`);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] ✓ Submitted successfully (status ${res.status}).`);
    } else {
      const text = await res.text().catch(() => '');
      console.warn(`[IndexNow] Non-success response (status ${res.status}), continuing build anyway:`, text);
    }
  } catch (err) {
    console.warn('[IndexNow] Network error reaching IndexNow (non-fatal, build continues):', err.message);
  }
}

main().catch((err) => {
  console.warn('[IndexNow] Unexpected error in postbuild script (non-fatal, build continues):', err);
});
