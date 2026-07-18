import { SITE_URL, TOOL_PAGES } from '../lib/siteConfig';

export default function sitemap() {
  const now = new Date();

  // Agar Vercel environment hai toh seedhe aapka main vercel subdomain use hoga, random branch URL nahi
  const currentBaseUrl = process.env.VERCEL_URL 
    ? 'https://aesthetic-social-kit.vercel.app' 
    : SITE_URL;

  const toolEntries = Object.values(TOOL_PAGES).map((page) => ({
    url: `${currentBaseUrl}/${page.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

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