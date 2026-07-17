import ToolPageLayout from '../../components/ToolPageLayout';
import BioLinkBuilder from '../../components/BioLinkBuilder';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.bioLinkBuilder;

export const metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: `/${page.slug}` },
  openGraph: {
    title: page.title,
    description: page.description,
    url: `${SITE_URL}/${page.slug}`,
  },
  twitter: {
    title: page.title,
    description: page.description,
  },
};

export default function Page() {
  return (
    <ToolPageLayout
      eyebrow="FREE · NO LOGIN · LIVE IN SECONDS"
      title="Link in Bio Builder"
      subtitle="One page for all your links — free forever, unlike Linktree or Beacons."
      seoContent={
        <FaqSection
          heading="Free link in bio page — how it works"
          intro={[
            'Pick a username, add your display name, a short bio, and as many links as you want, choose a theme, and hit save — your page goes live instantly at a shareable URL you can drop straight into your Instagram bio. There\'s no account system: instead, a private "edit key" is generated the first time you save and stored in your browser, so you can come back and update your page anytime without ever creating a login.',
          ]}
          items={[
            {
              q: 'Is this really free, unlike Linktree or Beacons?',
              a: 'Yes — no monthly fee, no link limit, no "remove branding" upsell. The page is powered by a free-tier database, which is realistic to keep free indefinitely.',
            },
            {
              q: 'How do I edit my page after creating it?',
              a: 'Your edit key is saved automatically in this browser. On a new device, enter your username plus the edit key shown when you first saved your page.',
            },
            {
              q: 'What happens if I lose my edit key?',
              a: 'Since there\'s no account/email system, the edit key is the only way to prove a page is yours — keep it somewhere safe, like a notes app, the same way you\'d keep any other access code.',
            },
          ]}
        />
      }
    >
      <BioLinkBuilder />
    </ToolPageLayout>
  );
}
