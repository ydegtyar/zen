import type { Metadata } from 'next';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://zen-101.vercel.app'
).replace(/\/$/, '');

export const siteName = 'Zen 101';
export const legalLastUpdated = '2026-05-31';

export const siteDescription =
  'A calm, focused reader for 101 Zen stories, short teachings, and daily reflection.';

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString();
}
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
