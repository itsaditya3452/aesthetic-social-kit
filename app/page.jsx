import AestheticSocialKitApp from '../components/AestheticSocialKitApp';

export default function Page() {
  return (
    <>
      <AestheticSocialKitApp />

      {/* Server-rendered, crawlable SEO content. Kept visually minimal and placed
          below the interactive app so it doesn't compete with the product UI. */}
      <section className="bg-[#F5F1E8] pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          <article className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
              A free Instagram story maker, Reels script generator, and caption studio in one place
            </h2>
            <p className="text-[#6B665C] leading-relaxed text-sm">
              Aesthetic Social Kit is a free, no-login Instagram story maker built for creators who want
              polished, on-trend content without opening five different apps. Design an animated birthday
              story, a minimalist quote template, or a travel-vibe cover with a moving Ken Burns effect —
              then export it as an HD JPG in one click. Every template runs on an HTML5 canvas directly in
              your browser, so there's nothing to install and nothing ever leaves your device.
            </p>
            <p className="text-[#6B665C] leading-relaxed text-sm">
              Need Reels or TikTok ideas? The built-in viral video script generator turns any topic into a
              timestamped, shot-by-shot storyboard using a Hook–Retention–CTA framework, with a multi-hook
              matrix, b-roll cues, on-screen text overlays, and audio/SFX notes for four tones: Controversial
              Hook, Storytelling/POV, Educational/Value Bomb, and Productivity Hack.
            </p>
            <p className="text-[#6B665C] leading-relaxed text-sm">
              Finally, the caption studio doubles as a full engagement dashboard: format captions with
              aesthetic line breaks and fancy Unicode fonts (Serif Bold, Sans-Serif Slanted, Double-Struck),
              generate a niche hashtag stack, preview platform-specific presets for Instagram Reels, TikTok,
              and YouTube Shorts, and get a live Viral Potential Score with concrete tips before you post.
            </p>
          </article>

          <article className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              <details className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center">
                  Is Aesthetic Social Kit really free to use?
                  <span className="text-[#8A8578] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#6B665C] leading-relaxed mt-3">
                  Yes. Every feature — the animated story generator, the Reels script builder, and the
                  caption studio — runs entirely in your browser with no login, no signup, and no hidden
                  paywalls.
                </p>
              </details>
              <details className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center">
                  Do I need to install anything or create an account?
                  <span className="text-[#8A8578] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#6B665C] leading-relaxed mt-3">
                  No installation and no account are required. Open the site and start creating instantly —
                  nothing is uploaded to a server, so your images and captions stay on your device.
                </p>
              </details>
              <details className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center">
                  What story templates are available?
                  <span className="text-[#8A8578] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#6B665C] leading-relaxed mt-3">
                  Three animated templates are included: Birthday Bash (a floating polaroid frame with
                  sparkle particles), Minimalist Quote (a cinematic typewriter fade-in with a pulsing
                  vignette), and Travel Vibe (a Ken Burns zoom-and-pan effect with a sliding location tag).
                </p>
              </details>
              <details className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center">
                  Can it write a full Reels or TikTok script for me?
                  <span className="text-[#8A8578] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#6B665C] leading-relaxed mt-3">
                  Yes. Enter any topic and choose a tone — Controversial Hook, Storytelling/POV,
                  Educational/Value Bomb, or Productivity Hack — to get a timestamped, shot-by-shot script
                  with a multi-hook matrix, a b-roll storyboard, and a conversion CTA matrix.
                </p>
              </details>
              <details className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
                <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center">
                  How does the Viral Potential Score work?
                  <span className="text-[#8A8578] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#6B665C] leading-relaxed mt-3">
                  The caption studio analyzes length, emoji density, line breaks, hook strength, CTA
                  placement, and hashtag count in real time, then gives you a percentage score with specific
                  tips to improve it before you post.
                </p>
              </details>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
