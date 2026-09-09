import type { Metadata } from 'next'
import { SITE } from '../data'
import type { FaqItem } from '../data/types'

export const SITE_URL = SITE.url

// Absolute URL helper for canonical/OG tags.
export function absoluteUrl(path = '/'): string {
  if (!path.startsWith('/')) return path
  return `${SITE_URL}${path}`
}

export interface PageMetaInput {
  title?: string
  description?: string
  path?: string
  image?: string
}

interface JsonLdObject {
  '@context': string
  '@type': string
  [key: string]: unknown
}

const DEFAULT_OG_IMAGE = {
  url: '/assets/data-solutions-hero.png',
  width: 1200,
  height: 630,
  alt: `${SITE.name} | ${SITE.tagline}`,
}

/**
 * Build a Next.js Metadata object for a page.
 * @param {{ title?: string, description?: string, path?: string, image?: string }} opts
 */
export function pageMetadata({ title, description, path = '/', image }: PageMetaInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`
  const desc = description || SITE.description
  const url = absoluteUrl(path)
  const ogImage = image ? { ...DEFAULT_OG_IMAGE, url: image } : DEFAULT_OG_IMAGE

  return {
    // `absolute` bypasses the root layout's "%s | brand" template so the
    // brand name is not appended twice.
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website' as const,
      siteName: SITE.name,
      title: fullTitle,
      description: desc,
      url,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage.url],
    },
  }
}

export function organizationJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE_URL,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    slogan: SITE.tagline,
    logo: absoluteUrl('/favicon.svg'),
    sameAs: [
      'https://x.com',
      'https://www.linkedin.com',
      'https://github.com',
    ],
  }
}

export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE_URL,
  }
}

export function faqJsonLd(faqs: FaqItem[] = []): JsonLdObject | null {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string
  description: string
  path: string
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE_URL,
    },
  }
}

export function JsonLd({ data }: { data: JsonLdObject | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
