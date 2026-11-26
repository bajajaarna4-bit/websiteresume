'use client';

import { useState } from 'react';
import { CheckCircle2, FolderGit2, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';
import { DraggableWindow } from '@/components/os/DraggableWindow';
import { cn } from '@/lib/utils';

interface FormState {
  name: string;
  email: string;
  topic: string;
  message: string;
  website: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  topic: 'General Inquiry',
  message: '',
  website: '',
};

export function ContactSection() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    setStatusError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        issues?: Array<{ field: string; message: string }>;
      };

      if (!response.ok) {
        const detail = payload.issues?.[0]?.message;
        setStatusError(detail ?? payload.error ?? `Request failed (${response.status}).`);
        return;
      }

      setStatusMessage(payload.message ?? 'Message transmitted cleanly.');
      setForm(INITIAL_FORM);
    } catch {
      setStatusError('Network error reaching /api/contact.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      data-section-id="contact"
      className="mx-auto max-w-7xl scroll-mt-14 px-4 py-20 sm:px-6"
    >
      {/* 1 Headline & 1 Supporting Line */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-sky-300 uppercase">
            <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" />
            <span>09 // Encrypted Comms</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Start a Conversation
          </h2>
        </div>

        <p className="max-w-md text-sm font-normal text-slate-300">
          Direct encrypted channel for engineering roles, AI builds, and speaking.
        </p>
      </div>

      <DraggableWindow
        title="COMMS // CONTACT TERMINAL"
        pathLabel="~/api/contact"
        badge={
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            ZOD GUARDED
          </span>
        }
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <FolderGit2 className="h-3.5 w-3.5 text-sky-400" />
              bajajaarna4-bit
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              Gurugram, IN
            </span>
          </div>

          <span className="font-mono text-[10px] text-emerald-300">Rate limited · 5 per 15m</span>
        </div>

        {/* 3 Fields + 1 Button */}
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="mx-auto max-w-xl space-y-4"
          noValidate
        >
          {/* Honeypot field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block font-mono text-xs text-slate-300"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Hiring Manager / Builder"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block font-mono text-xs text-slate-300"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={160}
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block font-mono text-xs text-slate-300"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={3}
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="What are we building?"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {statusError ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-400/40 bg-rose-500/15 px-3.5 py-2 font-mono text-xs text-rose-200"
            >
              {statusError}
            </div>
          ) : null}

          {statusMessage ? (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-2 font-mono text-xs text-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          ) : null}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 font-mono text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-60',
              )}
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {submitting ? 'Transmitting...' : 'Send Message'}
            </button>
          </div>
        </form>
      </DraggableWindow>

      <footer className="mt-14 border-t border-slate-800/80 pt-6 text-center font-mono text-xs text-slate-500">
        BAJAJ.OS · Built by Aarna Bajaj (@bajajaarna4-bit)
      </footer>
    </section>
  );
}
