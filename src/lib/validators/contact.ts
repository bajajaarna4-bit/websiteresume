import { z } from 'zod';

export const ContactRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter at least 2 characters.')
      .max(80, 'Name must be 80 characters or fewer.'),
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address.')
      .max(160, 'Email must be 160 characters or fewer.'),
    topic: z
      .string()
      .trim()
      .min(2, 'Please enter a short subject.')
      .max(120, 'Subject must be 120 characters or fewer.'),
    message: z
      .string()
      .trim()
      .min(10, 'Message must be at least 10 characters.')
      .max(2000, 'Message must be 2000 characters or fewer.'),
    website: z.string().max(120).optional(),
  })
  .strict();

export type ContactRequestPayload = z.infer<typeof ContactRequestSchema>;
