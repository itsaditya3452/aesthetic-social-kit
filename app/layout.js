import "./globals.css";
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
  // Google Search Console — meta tag verification method.
  // Paste the "content" value from your Search Console HTML tag here (just the code, not the whole tag).
  // Leave empty/remove if you're using the HTML file method instead (see /public folder).
  verification: {
    google: '', // e.g. 'aBcD1234EfGh5678...'
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
      'Travel route video maker with GPX/KML/GeoJSON import and video export',
      'Animated birthday eCard maker with a zero-backend shareable link',
      'Viral Reels & TikTok script generator with Hook, Retention, and CTA framework',
      'YouTube Shorts hook generator and A/B thumbnail & title previewer',
      'Instagram grid crop previewer and seamless carousel draft tool',
      'Free link-in-bio page builder',
      'Downloadable influencer media kit generator',
      'Influencer engagement rate and sponsorship rate calculator',
      'Instagram caption formatter with aesthetic line breaks, Unicode fonts, and a live viral potential score',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
