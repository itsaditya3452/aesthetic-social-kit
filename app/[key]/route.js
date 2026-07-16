import { NextResponse } from 'next/server';
import { INDEXNOW_KEY } from '../../lib/indexNowConfig';

// A single dynamic segment captures the WHOLE path segment, dots included —
// so a request for /ea7a587bf0d4aa44bea0e98e94b7c4b8.txt arrives here with
// params.key === "ea7a587bf0d4aa44bea0e98e94b7c4b8.txt", no ambiguity.
//
// This route only ever responds to the exact "<INDEXNOW_KEY>.txt" filename;
// every other single-segment path falls through to a 404 here, which is
// correct — Next.js still prefers any matching static route (like
// /instagram-story-maker) over this dynamic catch-all at the same level.

export async function GET(request, { params }) {
  const expectedFilename = `${INDEXNOW_KEY}.txt`;

  if (params.key !== expectedFilename) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(INDEXNOW_KEY, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
