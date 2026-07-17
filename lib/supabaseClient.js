import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// If the env vars aren't set (e.g. a fresh clone before the owner configures
// Supabase), every consumer of this checks `supabase` for null and shows a
// friendly "not configured yet" state instead of crashing.
export const supabase = url && key ? createClient(url, key) : null;

export const RESERVED_USERNAMES = new Set([
  'api', 'admin', 'bio', 'www', 'app', 'null', 'undefined', 'true', 'false',
  'instagram-story-maker', 'travel-video-maker', 'birthday-gift-maker',
  'reels-script-generator', 'instagram-caption-generator', 'youtube-hook-generator',
  'instagram-grid-planner', 'bio-link-builder', 'media-kit-generator',
  'rate-calculator', 'sitemap', 'robots', 'icon', 'opengraph-image',
]);

export function isValidUsername(username) {
  return /^[a-z0-9-]{3,30}$/.test(username) && !RESERVED_USERNAMES.has(username);
}
