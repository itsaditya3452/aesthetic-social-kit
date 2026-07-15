import ToolPageLayout from '../../components/ToolPageLayout';
import GridSlidePlanner from '../../components/GridSlidePlanner';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.gridSlidePlanner;

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
      title="Instagram Grid & Slide Planner"
      subtitle="Preview your Reel-to-grid crop and draft seamless carousels before you post — free."
      seoContent={
        <FaqSection
          heading="Free Instagram grid & carousel planner — how it works"
          intro={[
            'The Grid Previewer shows your 9:16 photo or video in two mock frames side-by-side — a full Reel/Story preview and a 1:1 profile grid crop — so you can see exactly what gets cut off before you post. Drag directly on the square preview (or use the slider) to shift which part of the vertical media lands in the grid, then export the adjusted square crop as an HD JPG. The Carousel Draft tool lets you plan 2 to 5 slides, upload artwork for each, and check two things: a seamless "flow check" strip with zero gap between slides (to verify continuous designs line up across the seams) and a real swipeable carousel mock so you can feel how it plays on-feed.',
          ]}
          items={[
            {
              q: 'Does my photo or video get uploaded anywhere?',
              a: 'No — everything is processed locally using the Canvas API and the File API. Nothing leaves your device.',
            },
            {
              q: 'What size is the exported grid crop?',
              a: 'The downloaded crop is exported at 1080×1080 — Instagram\'s standard square resolution.',
            },
            {
              q: 'Can I plan a carousel with continuous artwork across slides?',
              a: 'Yes — switch to "Flow check" mode, which lines slides up edge-to-edge with no gap so you can verify a design that spans multiple slides lines up correctly before you post.',
            },
          ]}
        />
      }
    >
      <GridSlidePlanner />
    </ToolPageLayout>
  );
}
