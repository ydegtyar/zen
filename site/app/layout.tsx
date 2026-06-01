import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';
import { JsonLd } from '@/components/JsonLd';
import { PwaRegister } from '@/components/PwaRegister';
import { absoluteUrl, siteDescription, siteName, siteUrl } from './seo';
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
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} | Calm Reader for 101 Zen Stories`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: `${siteName} | Calm Reader for 101 Zen Stories`,
    description: siteDescription,
    url: absoluteUrl('/'),
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${siteName} | Calm Reader for 101 Zen Stories`,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: '#101010',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: absoluteUrl('/'),
  description: siteDescription,
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: siteName,
    url: absoluteUrl('/'),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={workSans.className}>
        <PwaRegister />
        <JsonLd data={websiteJsonLd} />
        <div className="ambientMotion" aria-hidden="true">
          <span className="ambientCircle ambientCircleOne" />
          <span className="ambientCircle ambientCircleTwo" />
          <span className="ambientCircle ambientCircleThree" />
          <span className="ambientCircle ambientCircleFour" />
        </div>
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
