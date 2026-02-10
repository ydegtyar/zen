import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';
import localFont from 'next/font/local';

const workSans = localFont({
  display: 'swap',
  src: [
    { path: './fonts/WorkSans_400Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/WorkSans_600SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/WorkSans_700Bold.ttf', weight: '700', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  title: 'Zen 101',
  description: 'A calm, focused reader for 101 Zen stories.',
  metadataBase: new URL('https://zen-101.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <a className="skipLink" href="#content">
          Skip to content
        </a>
        <div className="container">
          <SiteNav />
          <main id="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
