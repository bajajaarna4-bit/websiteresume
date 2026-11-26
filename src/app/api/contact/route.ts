import { NextResponse } from 'next/server';
import { deliverContactMessage } from '@/lib/mailer';
import { checkRateLimit, extractClientIp } from '@/lib/rate-limit';
import { ContactRequestSchema } from '@/lib/validators/contact';

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json.' },
      { status: 415 },
    );
  }

  const clientIp = extractClientIp(request);
  const limit = checkRateLimit(`contact:${clientIp}`, 5, 15 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many contact requests. Please wait before trying again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(limit.retryAfterSeconds),
        },
      },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body.' }, { status: 400 });
  }

  const parsed = ContactRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed. Please review your input fields.',
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  // Silent honeypot drop for automated spam submissions.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json(
      {
        ok: true,
        mode: 'accepted',
        message: 'Inquiry received.',
      },
      { status: 200 },
    );
  }

  try {
    const result = await deliverContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      topic: parsed.data.topic,
      message: parsed.data.message,
    });

    return NextResponse.json(
      {
        ok: true,
        mode: result.mode,
        message: result.message,
      },
      { status: result.mode === 'resend' ? 200 : 202 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Unable to deliver message right now. Please try again later.' },
      { status: 502 },
    );
  }
}
