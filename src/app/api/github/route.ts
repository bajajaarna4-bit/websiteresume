import { NextResponse } from 'next/server';
import { getGitHubOverview } from '@/lib/github';
import { checkRateLimit, extractClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const clientIp = extractClientIp(request);
  const limit = checkRateLimit(`github:${clientIp}`, 30, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please retry shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
        },
      },
    );
  }

  const overview = await getGitHubOverview();
  return NextResponse.json(overview, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
