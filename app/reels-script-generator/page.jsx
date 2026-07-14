import ToolPageLayout from '../../components/ToolPageLayout';
import ScriptBuilder from '../../components/ScriptBuilder';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.scriptBuilder;

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
      title="Reels & TikTok Script Generator"
      subtitle="Turn any topic into a timestamped, shot-by-shot viral script — free, instantly."
      seoContent={
        <FaqSection
          heading="Free Reels & TikTok script generator — how it works"
          intro={[
            'Type any topic and pick a tone — Controversial Hook, Storytelling/POV, Educational/Value Bomb, or Productivity Hack — to get a full script package: a multi-hook matrix with 3 alternate openings, a timestamped shot-by-shot storyboard that separates on-camera action, b-roll, on-screen text, and audio/SFX cues, plus a conversion CTA matrix for engagement, shares, and sales.',
          ]}
          items={[
            {
              q: 'Is the script generator powered by an AI API?',
              a: 'No — it runs a purpose-built local script engine directly in your browser, so there\'s no API cost, no rate limit, and no account required.',
            },
            {
              q: 'What tones can I choose from?',
              a: 'Controversial Hook, Storytelling/POV, Educational/Value Bomb, and Productivity Hack — each with its own hook style, pacing notes, and CTA phrasing.',
            },
            {
              q: 'Does it work for TikTok, Reels, and Shorts?',
              a: 'Yes — the Hook–Retention–CTA structure it generates is the same short-form format used across Instagram Reels, TikTok, and YouTube Shorts.',
            },
          ]}
        />
      }
    >
      <ScriptBuilder />
    </ToolPageLayout>
  );
}
