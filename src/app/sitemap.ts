import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora-dns-p943.vercel.app';
  const now = new Date();

  const routes: Array<{
    url: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/store', priority: 0.9, changeFrequency: 'daily' },
    { url: '/setup-guides', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/setup-guides/android', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/setup-guides/ios', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/setup-guides/windows', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/setup-guides/console', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/compare', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/compatibility', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/how-it-works', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/troubleshoot', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/faq', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/ping-test', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/track-order', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
