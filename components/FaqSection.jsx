import React from 'react';

export default function FaqSection({ heading, intro, items }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-1 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {intro && (
        <article className="space-y-4">
          {intro.map((para, i) => (
            <p key={i} className="text-[#6B665C] leading-relaxed text-sm">{para}</p>
          ))}
        </article>
      )}
      <article className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#2B2A28]" style={{ fontFamily: '"Fraunces", serif' }}>
          {heading || 'Frequently asked questions'}
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <details key={i} className="group rounded-xl border border-[#E4DFD3] bg-white/50 p-4 open:bg-white/70 transition">
              <summary className="cursor-pointer text-sm font-medium text-[#2B2A28] list-none flex justify-between items-center gap-3">
                {item.q}
                <span className="text-[#8A8578] group-open:rotate-45 transition-transform shrink-0">+</span>
              </summary>
              <p className="text-sm text-[#6B665C] leading-relaxed mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </article>
    </div>
  );
}
