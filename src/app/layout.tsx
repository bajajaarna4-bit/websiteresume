import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import localFont from 'next/font/local';
import { AppProviders } from '@/components/motion/AppProviders';
import './globals.css';

const spaceGrotesk = localFont({
  src: '../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  variable: '--font-space-grotesk',
  weight: '300 700',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains-mono',
  weight: '100 800',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BAJAJ.OS — Aarna Bajaj (bajajaarna4-bit) | Builder Portfolio',
  description:
    'Futuristic macOS-meets-JARVIS personal portfolio OS for Aarna Bajaj (bajajaarna4-bit): live GitHub telemetry, architecture deep-dives, AI Lab, Startup concept, Stage & Security Lab.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'BAJAJ.OS — Aarna Bajaj (bajajaarna4-bit)',
    description:
      'A dumb who tries beats a genius who only thinks of doing. Explore live GitHub projects, architecture deep-dives, and the interactive Attack vs Defend Security Lab.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#06080d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-[#06080d] font-sans text-slate-100 selection:bg-sky-400/30 selection:text-sky-100">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AppProviders nonce={nonce}>{children}</AppProviders>
      </body>
    </html>
  );
}
