import type { MetadataRoute } from 'next';
import { siteDescription, siteName } from './seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} - 101 Zen Stories`,
    short_name: siteName,
    description: siteDescription,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f6f5f1',
    theme_color: '#101010',
    categories: ['books', 'education', 'lifestyle'],
    icons: [
      {
        src: '/icons/zen-101-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/zen-101-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/zen-101-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/zen-101-home-screenshot.png',
        sizes: '1320x2868',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Zen 101 story list',
      },
      {
        src: '/zen-101-story-screenshot.png',
        sizes: '1320x2868',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Zen 101 reading view',
      },
    ],
  };
}
