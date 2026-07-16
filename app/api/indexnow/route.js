import { NextResponse } from 'next/server';
import { INDEXNOW_KEY } from '../../../lib/indexNowConfig';
import { SITE_URL } from '../../../lib/siteConfig';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_SUBMISSION = 10000;

// Optional shared-secret gate. Set INDEXNOW_SUBMIT_SECRET in your env vars and
// send it back as the `x-indexnow-secret` header to use this route. If the env
// var isn't set, the route stays open (fine for local testing, NOT recommended
// for production — see the README section on setting this up).
function isAuthorized(request) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET;
  if (!secret) return true;
  return request.headers.get('x-indexnow-secret') === secret;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const urls = body?.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: '"urls" must be a non-empty array of full, absolute URLs' },
      { status: 400 }
    );
  }
  if (urls.length > MAX_URLS_PER_SUBMISSION) {
    return NextResponse.json(
      { error: `IndexNow accepts a maximum of ${MAX_URLS_PER_SUBMISSION} URLs per submission` },
      { status: 400 }
    );
  }

  const siteHost = new URL(SITE_URL).host;
  const malformedOrWrongHost = urls.filter((url) => {
    try {
      return new URL(url).host !== siteHost;
    } catch (e) {
      return true;
    }
  });
  if (malformedOrWrongHost.length > 0) {
    return NextResponse.json(
      {
        error: `Every URL must be a valid, absolute URL on this site's host (${siteHost})`,
        invalidUrls: malformedOrWrongHost,
      },
      { status: 400 }
    );
  }

  const payload = {
    host: siteHost,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  let indexNowResponse;
  try {
    indexNowResponse = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    console.error('[IndexNow] Network error while submitting URLs:', networkError);
    return NextResponse.json({ error: 'Network error while contacting IndexNow' }, { status: 502 });
  }

  const status = indexNowResponse.status;

  if (status === 200 || status === 202) {
    console.log(`[IndexNow] Submitted ${urls.length} URL(s) successfully (status ${status}).`);
    return NextResponse.json({ success: true, submittedCount: urls.length, indexNowStatus: status });
  }

  const responseText = await indexNowResponse.text().catch(() => '');

  if (status === 400) {
    console.error('[IndexNow] 400 Bad Request — payload was rejected:', responseText);
    return NextResponse.json(
      { error: 'IndexNow rejected the request as malformed', details: responseText },
      { status: 400 }
    );
  }

  if (status === 403) {
    console.error('[IndexNow] 403 Forbidden — key verification failed:', responseText);
    return NextResponse.json(
      {
        error:
          'IndexNow could not verify your key file. Confirm ' +
          `${SITE_URL}/${INDEXNOW_KEY}.txt is publicly reachable and returns the raw key as plain text.`,
        details: responseText,
      },
      { status: 403 }
    );
  }

  if (status === 422) {
    console.error('[IndexNow] 422 Unprocessable Entity — URL/key/host mismatch:', responseText);
    return NextResponse.json(
      { error: 'One or more URLs do not match the submitted host or key', details: responseText },
      { status: 422 }
    );
  }

  if (status === 429) {
    console.error('[IndexNow] 429 Too Many Requests — rate limited:', responseText);
    return NextResponse.json({ error: 'Rate limited by IndexNow — try again later' }, { status: 429 });
  }

  console.error(`[IndexNow] Unexpected response status ${status}:`, responseText);
  return NextResponse.json(
    { error: `Unexpected response from IndexNow: ${status}`, details: responseText },
    { status: 502 }
  );
}

// A GET to this endpoint isn't part of the IndexNow protocol — return a small
// hint instead of a confusing 405 with no body, in case someone opens it in a browser.
export async function GET() {
  return NextResponse.json(
    { message: 'POST an array of URLs as { "urls": ["https://...", ...] } to submit them to IndexNow.' },
    { status: 405 }
  );
}
