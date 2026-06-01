import type { MetadataRoute } from 'next';
import { absoluteUrl, legalLastUpdated } from './seo';

const routes = ['/', '/privacy', '/terms', '/support'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: legalLastUpdated,
    changeFrequency: route === '/' ? 'monthly' : 'yearly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
