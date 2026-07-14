import ToolPageLayout from '../../components/ToolPageLayout';
import CaptionStudio from '../../components/CaptionStudio';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.captionStudio;

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
      eyebrow="FREE · NO LOGIN · RUNS IN YOUR BROWSER"
      title="Instagram Caption Generator"
      subtitle="Format, score, and platform-optimize your caption — free, in real time."
      seoContent={
        <FaqSection
          heading="Free Instagram caption generator — how it works"
          intro={[
            'Paste a raw caption and format it with aesthetic line breaks or fancy Unicode fonts (Serif Bold, Sans-Serif Slanted, Double-Struck), generate a niche hashtag stack, and preview platform-specific presets for Instagram Reels, TikTok, and YouTube Shorts. A live Viral Potential Score analyzes length, emoji density, line breaks, hook strength, and CTA placement, with specific tips to improve it before you post.',
          ]}
          items={[
            {
              q: 'How is the Viral Potential Score calculated?',
              a: 'A local algorithm checks caption length, emoji density, line breaks, whether it opens with a hook, CTA presence and placement, hashtag count, and readability — then gives a percentage score with concrete tips.',
            },
            {
              q: 'Are the Unicode fonts real fonts?',
              a: 'They\'re real Unicode characters (Mathematical Alphanumeric Symbols), so they display as styled text anywhere — Instagram bio, captions, TikTok, anywhere text is accepted.',
            },
            {
              q: 'Does it work for TikTok and YouTube too?',
              a: 'Yes — the platform preset selector reformats your caption specifically for Instagram Reels, TikTok, or YouTube Shorts conventions.',
            },
          ]}
        />
      }
    >
      <CaptionStudio />
    </ToolPageLayout>
  );
}
