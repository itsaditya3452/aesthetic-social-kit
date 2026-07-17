import Link from 'next/link';
import { Image as ImageIcon, Map, Gift, Clapperboard, Type, Youtube, Grid3x3, Link2, FileBadge, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import ToolNav from '../components/ToolNav';
import FaqSection from '../components/FaqSection';
import HomeGiftFallbackViewer from '../components/HomeGiftFallbackViewer';

const HUB_TOOLS = [
  {
    href: '/instagram-story-maker',
    icon: ImageIcon,
    title: 'Instagram Story Maker',
    desc: 'Animated Birthday, Quote, and Travel story templates. Export in HD, no login.',
    cta: 'Open Story Maker',
  },
  {
    href: '/travel-video-maker',
    icon: Map,
    title: 'Travel Route Video Maker',
    desc: 'Animate a trip on a real map with GPX import and video export — free.',
    cta: 'Open Route Animator',
  },
  {
    href: '/birthday-gift-maker',
    icon: Gift,
    title: 'Birthday Gift Maker',
    desc: 'Animated eCards with a shareable link, no account, no database.',
    cta: 'Open Gift Maker',
  },
  {
    href: '/reels-script-generator',
    icon: Clapperboard,
    title: 'Reels & TikTok Script Generator',
    desc: 'Timestamped viral scripts with hooks, storyboard, and CTAs.',
    cta: 'Open Script Generator',
  },
  {
    href: '/instagram-caption-generator',
    icon: Type,
    title: 'Instagram Caption Generator',
    desc: 'Fancy fonts, hashtag stacks, and a live Viral Potential Score.',
    cta: 'Open Caption Studio',
  },
  {
    href: '/youtube-hook-generator',
    icon: Youtube,
    title: 'YouTube Creator Kit',
    desc: 'Psychology-backed hook formulas plus an A/B thumbnail & title previewer.',
    cta: 'Open YouTube Kit',
  },
  {
    href: '/instagram-grid-planner',
    icon: Grid3x3,
    title: 'Instagram Grid & Slide Planner',
    desc: 'Drag-to-adjust Reel-to-grid crop preview, plus a seamless carousel draft tool.',
    cta: 'Open Grid Planner',
  },
  {
    href: '/bio-link-builder',
    icon: Link2,
    title: 'Link in Bio Builder',
    desc: 'A free Linktree alternative — your own shareable bio page, live in seconds.',
    cta: 'Open Bio Link Builder',
  },
  {
    href: '/media-kit-generator',
    icon: FileBadge,
    title: 'Media Kit Generator',
    desc: 'A downloadable stats sheet for brand pitches — no login, no watermark.',
    cta: 'Open Media Kit Generator',
  },
  {
    href: '/influencer-rate-calculator',
    icon: Calculator,
    title: 'Influencer Rate Calculator',
    desc: 'Engagement rate plus a starting-point sponsorship rate estimate.',
    cta: 'Open Rate Calculator',
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
            Ten free creator tools — animated story assets, travel route videos, birthday eCards, a
            viral script engine, a YouTube hook generator, a grid & carousel planner, a link-in-bio
            builder, a media kit generator, a rate calculator, and a full caption dashboard. No login,
            no backend cost, no subscription.
          </p>
        </header>

        <img
          src="/opengraph-image"
          alt="Aesthetic Social Kit — animated story assets, travel route videos, birthday eCards, viral Reels scripts, YouTube hooks, grid planning, and caption tools, all free and running in the browser"
          loading="lazy"
          width={1200}
          height={630}
          className="w-full rounded-2xl border border-[#E4DFD3] shadow-sm mb-8 object-cover"
        />

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
                  {tool.cta} <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </main>

        <div className="mt-14 space-y-14">
          <FaqSection
            heading="About Aesthetic Social Kit"
            intro={[
              'Aesthetic Social Kit is a free, no-login suite of ten creator tools that all run entirely in your browser — nothing is uploaded to a server, and there\'s no account or subscription required for any feature. Design animated Instagram stories, turn a trip into a route video, send an animated birthday eCard, generate a viral Reels or TikTok script, write high-converting captions, generate YouTube hooks and A/B test a thumbnail, plan an Instagram grid and carousel, build a free link-in-bio page, put together a media kit for brand pitches, or check your engagement and sponsorship rate — each tool has its own dedicated page linked above, and each one works the same way: open it, do the work, export or copy the result, and move on. There\'s no dashboard to configure and no project to save, because nothing needs saving on our end (the one exception is the Link in Bio Builder, which uses a small free-tier database only because a public shareable page has to live somewhere).',
              'Most "social media tool" sites either lock the good features behind a paywall or quietly upload your photos to a server you can\'t see. Aesthetic Social Kit was built the opposite way on purpose: every image, video, and piece of text you work with is processed locally on your device using the browser\'s own Canvas, File, and MediaRecorder APIs. That\'s also why it\'s realistic for this to stay free — there\'s no server-side rendering cost per export, no storage bill, and no reason to ever put these tools behind a paywall.',
            ]}
            items={[
              {
                q: 'Is Aesthetic Social Kit really free to use?',
                a: 'Yes. Every tool — the story maker, route animator, birthday gift maker, script generator, YouTube kit, grid planner, and caption studio — runs entirely in your browser with no login, no signup, and no hidden paywalls.',
              },
              {
                q: 'Do I need to install anything or create an account?',
                a: 'No installation and no account are required for any tool. Open the page and start creating instantly — nothing is uploaded to a server, so your images and text stay on your device.',
              },
              {
                q: 'Which tool should I start with?',
                a: 'If you just want a quick animated story, start with the Instagram Story Maker. For a trip recap, use the Travel Route Video Maker. For a birthday surprise, use the Birthday Gift Maker. Planning a feed post or carousel first? The Grid & Slide Planner is built for exactly that.',
              },
              {
                q: 'Do these tools work on mobile?',
                a: 'Yes — every tool is fully responsive and built to work on a phone browser, since that\'s where most creators actually plan and export content.',
              },
              {
                q: 'What are the Link in Bio, Media Kit, and Rate Calculator tools for?',
                a: 'They cover the parts of creator life that usually send people to a different paid site: a Linktree-style bio page, a downloadable stats sheet for brand pitches, and a quick way to sanity-check what a sponsored post is worth before replying to a brand.',
              },
            ]}
          />

          <article className="max-w-3xl mx-auto px-1 space-y-4">
            <h2 className="text-2xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
              Built for creators who post often
            </h2>
            <p className="text-[#6B665C] leading-relaxed text-sm">
              Each tool exists because a specific step in the content workflow is usually annoying: figuring
              out what part of a vertical clip survives the square profile-grid crop, checking whether a
              multi-slide carousel actually lines up edge to edge, writing an opening line that doesn't sound
              like every other hook on the internet, or scoring a caption before you find out the hard way
              that it flopped. None of that needs a paid subscription or an account — it needs a fast,
              focused tool that does one job well and gets out of your way.
            </p>
            <p className="text-[#6B665C] leading-relaxed text-sm">
              New tools get added to this suite over time, and every one of them follows the same rule as the
              first: it has to run entirely in the browser, with no backend and no login, or it doesn't belong
              here.
            </p>
          </article>
        </div>

        <footer className="text-center text-xs text-[#8A8578] mt-10">
          No backend, no database — everything runs client-side. Deploy straight to Vercel.
        </footer>
      </div>
    </div>
  );
}
