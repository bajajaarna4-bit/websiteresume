import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getAllowedOrigins(request: NextRequest): Set<string> {
  const allowed = new Set<string>([request.nextUrl.origin]);
  const configuredSiteUrl = process.env.SITE_URL;
  if (configuredSiteUrl) {
    try {
      allowed.add(new URL(configuredSiteUrl).origin);
    } catch {
      // Ignore malformed SITE_URL here; env validator catches it on API execution.
    }
  }
  return allowed;
}

function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = getAllowedOrigins(request);

    if (origin && !allowedOrigins.has(origin)) {
      return NextResponse.json(
        { error: 'Origin not allowed by CORS policy.' },
        {
          status: 403,
          headers: {
            Vary: 'Origin',
          },
        },
      );
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '600',
          Vary: 'Origin',
        },
      });
    }

    const apiResponse = NextResponse.next();
    if (origin) {
      apiResponse.headers.set('Access-Control-Allow-Origin', origin);
    }
    apiResponse.headers.set('Vary', 'Origin');
    apiResponse.headers.set('Cache-Control', 'no-store');
    return apiResponse;
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const isLocal = isLocalHostname(request.nextUrl.hostname);

  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ''}`,
    `style-src-elem 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-inline'" : ''}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data: https://avatars.githubusercontent.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev || isLocal ? [] : ['upgrade-insecure-requests']),
  ];

  const cspHeaderValue = cspDirectives.join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', cspHeaderValue);
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
