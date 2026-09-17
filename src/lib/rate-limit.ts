/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Deliberately keyed on the anonymous session id (never IP) so we do not
 * collect any network identity. There is also a global bucket to blunt
 * scripted spam. On serverless this is per-instance, which is fine for a
 * site that expects exactly one real visitor; the DB's unique constraint on
 * session_id is the real duplicate guard.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

function take(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_KEYS) buckets.clear();
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) return false;
  bucket.hits.push(now);
  return true;
}

export function allowSubmission(sessionId: string): boolean {
  // Global: at most 30 writes/minute across everyone.
  if (!take("global", 30, 60_000)) return false;
  // Per anonymous session: at most 5 attempts per 10 minutes.
  return take(`s:${sessionId}`, 5, 10 * 60_000);
}

export function allowLoginAttempt(): boolean {
  // Brute-force guard on the admin password: 10 attempts / 15 minutes.
  return take("admin-login", 10, 15 * 60_000);
}
