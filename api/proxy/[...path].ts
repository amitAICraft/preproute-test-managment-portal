import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless API Proxy  —  /api/proxy/[...path]
 *
 * WHY THIS EXISTS:
 *   The Railway backend does not have our Vercel deployment domain in its CORS
 *   allowlist. Browser requests from https://*.vercel.app are therefore blocked
 *   at the preflight stage. Server-side requests are not subject to CORS, so
 *   this proxy acts as a transparent relay: the browser talks to Vercel, and
 *   Vercel talks to Railway.
 *
 * HOW REQUESTS ARE FORWARDED:
 *   /api/proxy/<anything>  →  https://...railway.app/api/<anything>
 *   All HTTP methods, headers (including Authorization), query parameters, and
 *   request bodies are forwarded verbatim. Response status, headers, and body
 *   are forwarded back unchanged.
 *
 * FUTURE SAFETY:
 *   If Railway later adds our Vercel domain to its CORS allowlist, this proxy
 *   continues to work correctly — it simply adds one extra hop.
 */

/** Railway backend — target for every proxied request */
const BACKEND_BASE_URL =
process.env.BACKEND_API_URL ||
'https://admin-moderator-backend-staging.up.railway.app/api';

/**
 * Disable Vercel's automatic body parsing.
 * We need the raw byte stream so we can forward it unmodified.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── 1. Build the target URL ──────────────────────────────────────────────

  // The catch-all `path` param holds the path segments after /api/proxy/
  const { path: pathParam, ...remainingQuery } = req.query as Record<
    string,
    string | string[]
  >;

  const segments = Array.isArray(pathParam)
    ? pathParam
    : pathParam
      ? [pathParam]
      : [];

  // Re-build query string from everything except the catch-all segments
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(remainingQuery)) {
    searchParams.append(key, Array.isArray(val) ? val.join(',') : val);
  }

  const qs = searchParams.toString();
  const targetUrl = `${BACKEND_BASE_URL}/${segments.join('/')}${qs ? `?${qs}` : ''}`;

  // ── 2. Build forwarded headers ───────────────────────────────────────────

  // Exclude 'host' — it must match the backend's hostname, not ours.
  const forwardHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (key.toLowerCase() === 'host') continue;
    forwardHeaders[key] = Array.isArray(value) ? value.join(', ') : (value ?? '');
  }

  // ── 3. Read raw request body (bodyParser is off) ─────────────────────────

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string));
  }
  const rawBody = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

  // ── 4. Forward request to Railway ───────────────────────────────────────

  const backendResponse = await fetch(targetUrl, {
    method: req.method ?? 'GET',
    headers: forwardHeaders,
    body: rawBody && rawBody.length > 0 ? rawBody : undefined,
  });

  // ── 5. Forward response back to the browser ──────────────────────────────

  // Skip hop-by-hop headers that Vercel manages itself
  const skipResponseHeaders = new Set([
    'transfer-encoding',
    'connection',
    'keep-alive',
  ]);

  backendResponse.headers.forEach((value, key) => {
    if (!skipResponseHeaders.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });

  const responseBody = await backendResponse.arrayBuffer();
  res.status(backendResponse.status).send(Buffer.from(responseBody));
}
