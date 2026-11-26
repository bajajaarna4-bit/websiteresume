import 'server-only';

interface RateLimitBucket {
  timestamps: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const buckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 2000;

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  if (buckets.size > MAX_BUCKETS) {
    for (const [entryKey, bucket] of buckets.entries()) {
      const fresh = bucket.timestamps.filter((ts) => ts > cutoff);
      if (fresh.length === 0) {
        buckets.delete(entryKey);
      } else {
        bucket.timestamps = fresh;
      }
    }
  }

  const existing = buckets.get(key) ?? { timestamps: [] };
  existing.timestamps = existing.timestamps.filter((ts) => ts > cutoff);

  if (existing.timestamps.length >= maxRequests) {
    const oldest = existing.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, existing);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  existing.timestamps.push(now);
  buckets.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - existing.timestamps.length),
    retryAfterSeconds: 0,
  };
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown-client';
}
