import ToolPageLayout from '../../components/ToolPageLayout';
import TravelRouteAnimator from '../../components/TravelRouteAnimator';
import FaqSection from '../../components/FaqSection';
import { SITE_URL, TOOL_PAGES } from '../../lib/siteConfig';

const page = TOOL_PAGES.routeAnimator;

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
      eyebrow="FREE · NO LOGIN · REAL MAP DATA"
      title="Travel Route Video Maker"
      subtitle="Animate your trip on a real map and export a video — inspired by mult.dev, built free."
      seoContent={
        <FaqSection
          heading="Free travel route video maker — how it works"
          intro={[
            'Add stops by typing a place name (free lookup via OpenStreetMap) or import a real GPX, KML, or GeoJSON track exported from Strava, Komoot, Gaia GPS, or Google My Maps. Pick a transport mode per leg — plane, train, car, walk, bike, or boat — and each one gets its own path style and marker. Attach a photo to any stop and it fades in as the route arrives there. Then export a real video using your browser\'s built-in recorder, no paid rendering service involved.',
          ]}
          items={[
            {
              q: 'Is this a free alternative to mult.dev?',
              a: 'It covers the core idea — an animated route on a real map with transport icons, photos, and video export — for free, with no per-video credits. It doesn\'t include mult.dev\'s AI route assistant, since that requires a paid API call.',
            },
            {
              q: 'What video format do I get?',
              a: 'A WebM video, recorded natively in your browser. It plays in Chrome, Firefox, and Edge, and uploads fine to Instagram, TikTok, and YouTube.',
            },
            {
              q: 'What file formats can I import?',
              a: '.gpx, .kml, and .geojson files are all supported — the common formats exported by most fitness and mapping apps.',
            },
          ]}
        />
      }
    >
      <TravelRouteAnimator />
    </ToolPageLayout>
  );
}
