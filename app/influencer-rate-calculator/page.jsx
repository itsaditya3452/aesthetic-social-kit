import ToolPageLayout from '../../components/ToolPageLayout';
import RateCalculator from '../../components/RateCalculator';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.rateCalculator;

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
      eyebrow="FREE · NO LOGIN · INSTANT RESULTS"
      title="Influencer Rate & Engagement Calculator"
      subtitle="Know your numbers before you reply to a brand's DM — free, instant."
      seoContent={
        <FaqSection
          heading="Free engagement rate & sponsorship rate calculator — how it works"
          intro={[
            'Enter your follower count and average likes and comments per post to get your engagement rate instantly, benchmarked against general industry bands. Pick your niche and the calculator suggests a starting-point rate for a feed post, Reel, carousel, and story — scaled by your actual engagement, not just your follower count, since two accounts with the same followers can have wildly different real value to a brand.',
          ]}
          items={[
            {
              q: 'Are these rate suggestions accurate market prices?',
              a: 'They\'re a transparent starting-point estimate based on your followers, engagement, and niche — not a market quote. Real deals depend on region, usage rights, production quality, and brand budget too. Treat the number as a floor to negotiate from.',
            },
            {
              q: 'Why does engagement rate matter more than follower count?',
              a: 'Brands increasingly pay for engaged audiences, not just reach — an account with fewer followers but strong engagement often out-performs a larger, less engaged one, and this calculator\'s rate suggestion reflects that.',
            },
            {
              q: 'Is my data stored anywhere?',
              a: 'No — everything is calculated locally in your browser and nothing is saved or sent anywhere.',
            },
          ]}
        />
      }
    >
      <RateCalculator />
    </ToolPageLayout>
  );
}
