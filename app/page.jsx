import Link from 'next/link';
import { Image as ImageIcon, Map, Gift, Clapperboard, Type, ArrowRight, Sparkles } from 'lucide-react';
import ToolNav from '../components/ToolNav';
import FaqSection from '../components/FaqSection';
import HomeGiftFallbackViewer from '../components/HomeGiftFallbackViewer';

const HUB_TOOLS = [
  {
    href: '/instagram-story-maker',
    icon: ImageIcon,
    title: 'Instagram Story Maker',
    desc: 'Animated Birthday, Quote, and Travel story templates. Export in HD, no login.',
  },
  {
    href: '/travel-video-maker',
    icon: Map,
    title: 'Travel Route Video Maker',
    desc: 'Animate a trip on a real map with GPX import and video export — free.',
  },
  {
    href: '/birthday-gift-maker',
    icon: Gift,
    title: 'Birthday Gift Maker',
    desc: 'Animated eCards with a shareable link, no account, no database.',
  },
  {
    href: '/reels-script-generator',
    icon: Clapperboard,
    title: 'Reels & TikTok Script Generator',
    desc: 'Timestamped viral scripts with hooks, storyboard, and CTAs.',
  },
  {
    href: '/instagram-caption-generator',
    icon: Type,
    title: 'Instagram Caption Generator',
    desc: 'Fancy fonts, hashtag stacks, and a live Viral Potential Score.',
  },
];

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full bg-[#F5F1E8]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <HomeGiftFallbackViewer />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E4DFD3] px-4 py-1.5 mb-4 shadow-sm">
            <Sparkles size={14} className="text-[#A8909E]" />
            <span className="text-xs font-medium text-[#5B6B57] tracking-wide">PRO SUITE · ZERO BACKEND · RUNS FULLY IN-BROWSER</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-[#2B2A28] tracking-tight"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            Aesthetic Social Kit
          </h1>
          <p className="text-[#6B665C] mt-2 max-w-xl mx-auto sm:mx-0">
            Five free creator tools — animated story assets, travel route videos, birthday eCards, a
            viral script engine, and a full caption dashboard. No login, no backend, no cost.
          </p>
        </header>

        <ToolNav />

        <main className="grid sm:grid-cols-2 gap-4">
          {HUB_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col gap-3 rounded-2xl border border-[#E4DFD3] bg-white/50 backdrop-blur-sm p-6 hover:bg-white/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2B2A28] text-[#F5F1E8] flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.7} />
                </div>
                <h2 className="text-lg font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
                  {tool.title}
                </h2>
                <p className="text-sm text-[#6B665C] leading-relaxed">{tool.desc}</p>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-[#5B6B57] group-hover:gap-2.5 transition-all">
                  Open tool <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </main>

        <div className="mt-14">
          <FaqSection
            heading="About Aesthetic Social Kit"
            intro={[
              'Aesthetic Social Kit is a free, no-login suite of five creator tools that all run entirely in your browser — nothing is uploaded to a server, and there\'s no account or subscription required for any feature. Design animated Instagram stories, turn a trip into a route video, send an animated birthday eCard, generate a viral Reels script, or format a high-converting caption — each tool has its own dedicated page linked above.',
            ]}
            items={[
              {
                q: 'Is Aesthetic Social Kit really free to use?',
                a: 'Yes. Every tool — the story maker, route animator, birthday gift maker, script generator, and caption studio — runs entirely in your browser with no login, no signup, and no hidden paywalls.',
              },
              {
                q: 'Do I need to install anything or create an account?',
                a: 'No installation and no account are required for any tool. Open the page and start creating instantly — nothing is uploaded to a server, so your images and text stay on your device.',
              },
              {
                q: 'Which tool should I start with?',
                a: 'If you just want a quick animated story, start with the Instagram Story Maker. For a trip recap, use the Travel Route Video Maker. For a birthday surprise, use the Birthday Gift Maker.',
              },
            ]}
          />
        </div>

        <footer className="text-center text-xs text-[#8A8578] mt-10">
          No backend, no database — everything runs client-side. Deploy straight to Vercel.
        </footer>
      </div>
    </div>
  );
}
