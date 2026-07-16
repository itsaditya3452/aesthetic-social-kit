// Submits every page on the site to IndexNow via our own /api/indexnow route.
//
// Usage:
//   node scripts/submit-indexnow.mjs                          (submits to production SITE_URL)
//   BASE_URL=http://localhost:3000 node scripts/submit-indexnow.mjs   (submits while testing locally)
//
// If you set INDEXNOW_SUBMIT_SECRET in your environment, pass the same value
// here too so the request is authorized:
//   INDEXNOW_SUBMIT_SECRET=your-secret node scripts/submit-indexnow.mjs

import { SITE_URL, TOOL_PAGES } from '../lib/siteConfig.js';

const baseUrl = process.env.BASE_URL || SITE_URL;
const secret = process.env.INDEXNOW_SUBMIT_SECRET || '';

const urls = [
  SITE_URL,
  ...Object.values(TOOL_PAGES).map((page) => `${SITE_URL}/${page.slug}`),
];

async function main() {
  console.log(`Submitting ${urls.length} URL(s) to IndexNow via ${baseUrl}/api/indexnow ...`);
  urls.forEach((u) => console.log(`  - ${u}`));

  const headers = { 'Content-Type': 'application/json' };
  if (secret) headers['x-indexnow-secret'] = secret;

  const res = await fetch(`${baseUrl}/api/indexnow`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ urls }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    console.log('✓ Success:', data);
  } else {
    console.error(`✗ Failed (status ${res.status}):`, data);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('✗ Script error:', err);
  process.exitCode = 1;
});
