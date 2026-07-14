import ToolPageLayout from '../../components/ToolPageLayout';
import StoryGenerator from '../../components/StoryGenerator';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.storyMaker;

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
      title="Instagram Story Maker"
      subtitle="Design animated story templates and export them in HD — no app, no account, no watermark."
      seoContent={
        <FaqSection
          heading="Free Instagram story maker — how it works"
          intro={[
            'This animated Instagram story maker runs entirely on an HTML5 canvas in your browser, so there\'s nothing to install and nothing ever leaves your device. Choose from three templates — Birthday Bash (a floating polaroid frame with sparkle particles), Minimalist Quote (a cinematic typewriter fade-in with a pulsing vignette), or Travel Vibe (a Ken Burns zoom-and-pan effect with a sliding location tag) — then export a clean, fully-settled HD JPG frame in one click.',
          ]}
          items={[
            {
              q: 'Is this Instagram story maker really free?',
              a: 'Yes — every template, the live animated preview, and the HD export are free with no login, no watermark, and no subscription.',
            },
            {
              q: 'What image size does it export?',
              a: 'Every template exports at 1080×1920 — the exact HD resolution Instagram, Facebook, and Snapchat stories use.',
            },
            {
              q: 'Do I need to upload my photo to a server?',
              a: 'No. Your photo is processed locally in your browser using the Canvas API and never leaves your device.',
            },
          ]}
        />
      }
    >
      <StoryGenerator />
    </ToolPageLayout>
  );
}
