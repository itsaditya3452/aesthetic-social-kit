import ToolPageLayout from '../../components/ToolPageLayout';
import BirthdayGiftPageClient from '../../components/BirthdayGiftPageClient';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.birthdayGift;

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
      eyebrow="FREE · NO ACCOUNT · SHAREABLE LINK"
      title="Birthday Gift Maker"
      subtitle="Build an animated eCard and share it instantly — inspired by gifft.me, built free forever."
      seoContent={
        <FaqSection
          heading="Free birthday eCard maker — how it works"
          intro={[
            'Pick a theme — Balloons, Confetti, Candles, or Fireworks — add a name, age, message, and an optional photo, then watch the cinematic reveal animate live. The entire gift is encoded directly into your shareable link (not stored on any server), so opening the link plays the animated reveal full-screen for whoever you send it to. You can also export it as a real video file or a static HD card to send directly.',
          ]}
          items={[
            {
              q: 'Is this really free, unlike gifft.me?',
              a: 'Yes — no subscription, no ads to remove, and no per-gift cost. The tradeoff for zero cost is that gifts aren\'t saved to an account; they live entirely inside the link you share.',
            },
            {
              q: 'Do I need to sign up to send a gift?',
              a: 'No account is needed to create or open a gift. Just build it, copy the link, and send it however you like.',
            },
            {
              q: 'Can I send it as a video instead of a link?',
              a: 'Yes — the "Export Video" button records the full animated reveal as a WebM file you can send directly over WhatsApp, Instagram, or Telegram.',
            },
          ]}
        />
      }
    >
      <BirthdayGiftPageClient />
    </ToolPageLayout>
  );
}
