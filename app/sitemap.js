import { SITE_URL, TOOL_PAGES } from '../lib/siteConfig';

export default function sitemap() {
  const now = new Date();
  const toolEntries = Object.values(TOOL_PAGES).map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolEntries,
  ];
}
