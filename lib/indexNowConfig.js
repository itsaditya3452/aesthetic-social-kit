// IndexNow verification key.
//
// This key is NOT a secret — it's designed to be publicly readable (that's the
// whole verification mechanism: search engines fetch it from your own domain to
// confirm you control the site). Treat it like a site ID, not a password.
//
// A working key ships here by default so IndexNow works out of the box. To use
// your own, generate one and set it as an env var instead of editing this file:
//   node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
// then add to .env.local (and to your Vercel project's Environment Variables):
//   INDEXNOW_KEY=your-generated-key
//
// The key must be 8–128 characters, using only letters, digits, and hyphens.
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'ea7a587bf0d4aa44bea0e98e94b7c4b8';
