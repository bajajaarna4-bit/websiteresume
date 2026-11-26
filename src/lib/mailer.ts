import 'server-only';
import { getServerEnv } from '@/lib/env';
import type { ContactRequestPayload } from '@/lib/validators/contact';

export interface ContactDeliveryResult {
  delivered: boolean;
  mode: 'resend' | 'dry-run';
  message: string;
}

export async function deliverContactMessage(
  payload: Omit<ContactRequestPayload, 'website'>,
): Promise<ContactDeliveryResult> {
  const env = getServerEnv();

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return {
      delivered: true,
      mode: 'dry-run',
      message:
        'Message validated cleanly (preview dry-run mode — set RESEND_API_KEY and CONTACT_TO_EMAIL on the server for live inbox delivery).',
    };
  }

  const fromAddress = env.CONTACT_FROM_EMAIL ?? 'BAJAJ.OS Contact <onboarding@resend.dev>';
  const textBody = [
    `New BAJAJ.OS Portfolio Inquiry`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${payload.topic}`,
    '',
    payload.message,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: payload.email,
      subject: `[BAJAJ.OS] ${payload.topic}`,
      text: textBody,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error('Upstream email provider returned a non-OK response.');
  }

  return {
    delivered: true,
    mode: 'resend',
    message: 'Message delivered securely to Aarna Bajaj.',
  };
}
