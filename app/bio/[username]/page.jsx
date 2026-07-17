import { ExternalLink, Sparkles } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { getBioTheme } from '../../../lib/bioThemes';
import { SITE_URL, SITE_NAME } from '../../../lib/siteConfig';

async function getBioPage(username) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('bio_pages')
    .select('username, display_name, bio_text, theme, links, created_at')
    .eq('username', username)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }) {
  const page = await getBioPage(params.username);
  if (!page) {
    return { title: 'Page not found' };
  }
  const title = `${page.display_name || page.username} — Links`;
  const description = page.bio_text || `${page.display_name || page.username}'s links, all in one place.`;
  return {
    title,
    description,
    alternates: { canonical: `/bio/${page.username}` },
    openGraph: { title, description, url: `${SITE_URL}/bio/${page.username}` },
    twitter: { title, description },
    robots: { index: true, follow: true },
  };
}

export default async function BioPage({ params }) {
  const page = await getBioPage(params.username);
  const theme = getBioTheme(page?.theme);

  if (!page) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F1E8] px-4" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-5xl">🔗</p>
          <h1 className="text-2xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>This page doesn't exist yet</h1>
          <p className="text-sm text-[#6B665C]">The link you followed doesn't match any page here.</p>
          <a
            href="/bio-link-builder"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B2A28] text-[#F5F1E8] px-5 py-3 text-sm font-medium hover:bg-[#413F3B] transition"
          >
            <Sparkles size={15} /> Create your own free bio link
          </a>
        </div>
      </div>
    );
  }

  const links = Array.isArray(page.links) ? page.links : [];

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-14"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: theme.accent, color: theme.bg }}
        >
          {(page.display_name || page.username).charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: '"Fraunces", serif' }}>
            {page.display_name || page.username}
          </h1>
          {page.bio_text && <p className="text-sm mt-1.5 opacity-70">{page.bio_text}</p>}
        </div>

        <div className="w-full space-y-3 mt-2">
          {links.length === 0 ? (
            <p className="text-sm opacity-50">No links added yet.</p>
          ) : (
            links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 px-4 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: theme.card, border: `1px solid ${theme.accent}55` }}
              >
                {link.label} <ExternalLink size={13} className="opacity-50" />
              </a>
            ))
          )}
        </div>

        <a
          href="/bio-link-builder"
          className="mt-8 flex items-center gap-1.5 text-xs opacity-50 hover:opacity-80 transition"
        >
          <Sparkles size={12} /> Made free with {SITE_NAME}
        </a>
      </div>
    </div>
  );
}
