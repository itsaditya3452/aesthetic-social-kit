import { SITE_URL, TOOL_PAGES } from '../lib/siteConfig';

export default function sitemap() {
  const now = new Date();

  // 1. Check karo ki kya site Vercel ke preview/sub-domain par run ho rahi hai
  // Agar VERCEL_URL available hai toh use use karega, nahi toh aapka main SITE_URL (.com)
  const vercelEnvUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  const currentBaseUrl = vercelEnvUrl 
    ? `https://${vercelEnvUrl}` 
    : SITE_URL;

  // 2. Tools ke saare inner pages ke entries map karein
  const toolEntries = Object.values(TOOL_PAGES).map((page) => ({
    url: `${currentBaseUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. Final array return karein jo XML generate karega
  return [
    {
      url: currentBaseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolEntries,
  ];
}