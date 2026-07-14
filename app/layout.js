import "./globals.css";
import Script from "next/script"; // 1. Google Analytics ke liye Next.js Script engine import kiya
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, KEYWORDS } from "../lib/siteConfig";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/icon',
  },
};

export const viewport = {
  themeColor: '#F5F1E8',
  width: 'device-width',
  initialScale: 1,
};

function JsonLd() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (runs in browser)',
    description: SITE_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Animated Instagram/Facebook story generator with Birthday, Quote, and Travel templates',
      'HD JPG export of story assets',
      'Viral Reels & TikTok script generator with Hook, Retention, and CTA framework',
      'Multiple script tones: Controversial, Storytelling, Educational, Productivity',
      'Instagram caption formatter with aesthetic line breaks and Unicode fonts',
      'Live engagement / viral potential score predictor',
      'Niche hashtag stack generator',
      'Platform-specific caption presets for Instagram, TikTok, and YouTube Shorts',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Aesthetic Social Kit really free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every feature — the animated story generator, the Reels script builder, and the caption studio — runs entirely in your browser with no login, no signup, and no hidden paywalls.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install anything or create an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No installation and no account are required. Open the site and start creating instantly — nothing is uploaded to a server, so your images and captions stay on your device.',
        },
      },
      {
        '@type': 'Question',
        name: 'What story templates are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Three animated templates are included: Birthday Bash (a floating polaroid frame with sparkle particles), Minimalist Quote (a cinematic typewriter fade-in with a pulsing vignette), and Travel Vibe (a Ken Burns zoom-and-pan effect with a sliding location tag).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can it write a full Reels or TikTok script for me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Enter any topic and choose a tone — Controversial Hook, Storytelling/POV, Educational/Value Bomb, or Productivity Hack — to get a timestamped, shot-by-shot script with a multi-hook matrix, a b-roll storyboard, and a conversion CTA matrix.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the Viral Potential Score work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The caption studio analyzes length, emoji density, line breaks, hook strength, CTA placement, and hashtag count in real time, then gives you a percentage score with specific tips to improve it before you post.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 2. Safe Google Analytics Integration bina layout ko chhede */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZF1TZYM4KT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZF1TZYM4KT');
          `}
        </Script>
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}