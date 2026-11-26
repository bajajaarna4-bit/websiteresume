import 'server-only';
import { z } from 'zod';

const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SITE_URL: z.string().url().optional(),
  GITHUB_USERNAME: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/)
    .default('bajajaarna4-bit'),
  GITHUB_READ_ONLY_TOKEN: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(3).optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const parsed = ServerEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    SITE_URL: process.env.SITE_URL || undefined,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'bajajaarna4-bit',
    GITHUB_READ_ONLY_TOKEN: process.env.GITHUB_READ_ONLY_TOKEN || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
  });

  if (!parsed.success) {
    throw new Error('Invalid server environment configuration.');
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
