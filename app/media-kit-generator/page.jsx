import ToolPageLayout from '../../components/ToolPageLayout';
import MediaKitGenerator from '../../components/MediaKitGenerator';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.mediaKitGenerator;

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
      title="Media Kit Generator"
      subtitle="A clean, professional one-pager for brand pitches — download it in seconds."
      seoContent={
        <FaqSection
          heading="Free influencer media kit generator — how it works"
          intro={[
            'Fill in your stats, audience breakdown, and any brands you\'ve worked with, and watch a professional media kit build itself live on canvas — your photo, engagement rate (calculated automatically from your inputs), audience details, brand logos as tags, and your rates if you choose to include them. Download it as a high-resolution JPG ready to attach to an email or DM the moment a brand reaches out.',
          ]}
          items={[
            {
              q: 'Does it calculate my engagement rate automatically?',
              a: 'Yes — enter your follower count plus average likes and comments, and the engagement rate updates live in the preview.',
            },
            {
              q: 'Do I have to include my rates?',
              a: 'No — the rates section only appears if you fill in at least one rate field, so you can leave pricing off entirely if you\'d rather negotiate privately.',
            },
            {
              q: 'Is my data uploaded anywhere?',
              a: 'No — the whole media kit is drawn locally on an HTML5 canvas in your browser and never leaves your device until you choose to download it.',
            },
          ]}
        />
      }
    >
      <MediaKitGenerator />
    </ToolPageLayout>
  );
}
