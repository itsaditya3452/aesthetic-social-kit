import React from 'react';
import ToolNav from './ToolNav';

export default function ToolPageLayout({ eyebrow, title, subtitle, children, seoContent }) {
  return (
    <div
      className="min-h-screen w-full bg-[#F5F1E8]"
      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#E4DFD3] px-4 py-1.5 mb-4 shadow-sm">
            <span className="text-xs font-medium text-[#5B6B57] tracking-wide">
              {eyebrow || 'PRO SUITE · ZERO BACKEND · RUNS FULLY IN-BROWSER'}
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-[#2B2A28] tracking-tight"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-[#6B665C] mt-2 max-w-xl mx-auto sm:mx-0">{subtitle}</p>}
        </header>

        <ToolNav />

        <main className="bg-white/40 backdrop-blur-sm border border-[#E4DFD3] rounded-3xl p-5 sm:p-8 shadow-sm">
          {children}
        </main>

        {seoContent && <div className="mt-14">{seoContent}</div>}

        <footer className="text-center text-xs text-[#8A8578] mt-10">
          No backend, no database — everything runs client-side. Deploy straight to Vercel.
        </footer>
      </div>
    </div>
  );
}
