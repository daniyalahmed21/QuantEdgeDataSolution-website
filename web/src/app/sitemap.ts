import { SITE_URL } from '../lib/seo'
import { SERVICE_PAGES } from '../data'

export default function sitemap() {
  const now = new Date()

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/career', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  ]

  const serviceRoutes = Object.keys(SERVICE_PAGES).map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.9,
    changeFrequency: 'monthly',
  }))

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
