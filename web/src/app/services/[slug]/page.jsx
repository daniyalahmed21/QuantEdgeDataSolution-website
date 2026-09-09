import { notFound } from 'next/navigation'
import Contact from '../../../sections/shared/Contact'
import Faqs from '../../../sections/shared/Faqs'
import DigitalGrowthHero from '../../../sections/services/DigitalGrowthHero'
import HowWeWork from '../../../sections/services/HowWeWork'
import WhatWeCanDo from '../../../sections/services/WhatWeCanDo'
import DataSolutionsHero from '../../../sections/services/DataSolutionsHero'
import DataWhyChooseUs from '../../../sections/services/DataWhyChooseUs'
import DataWhatWeDeliver from '../../../sections/services/DataWhatWeDeliver'
import DataProcess from '../../../sections/services/DataProcess'
import ServiceShowcaseTabs from '../../../sections/services/ServiceShowcaseTabs'
import WebSoftwareHero from '../../../sections/services/WebSoftwareHero'
import WebSoftwareProcess from '../../../sections/services/WebSoftwareProcess'
import WebSoftwareTech from '../../../sections/services/WebSoftwareTech'
import { SERVICE_PAGES } from '../../../data'
import { pageMetadata, faqJsonLd, serviceJsonLd, JsonLd } from '../../../lib/seo'

const SERVICE_META = {
  'digital-growth': {
    name: 'Digital Growth',
    title: 'Digital Growth: SEO, Paid Media & CRO',
    description:
      'SEO, paid media, and conversion optimization engineered to grow revenue, not vanity metrics. Get a free growth review from QuantEdgeDataSolutions.',
    image: '/assets/digital-marketing-hero.png',
  },
  'data-solutions': {
    name: 'Data Solutions',
    title: 'Data Solutions: Pipelines, Analytics & ML',
    description:
      'Data pipelines, warehousing, dashboards, and machine learning that turn raw data into a competitive advantage you can act on with confidence.',
    image: '/assets/data-solutions-hero.png',
  },
  'web-software-development': {
    name: 'Web & Software Development',
    title: 'Web & Software Development: Custom Platforms',
    description:
      'Custom web platforms, SaaS products, and e-commerce builds that are fast, accessible, SEO-ready, and architected to scale with your business.',
    image: '/assets/web-software-development.png',
  },
}

export function generateStaticParams() {
  return Object.keys(SERVICE_PAGES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const meta = SERVICE_META[slug]
  if (!meta) return {}
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/services/${slug}`,
    image: meta.image,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const service = SERVICE_PAGES[slug]
  const meta = SERVICE_META[slug]

  if (!service || !meta) {
    notFound()
  }

  const structured = (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: meta.name,
          description: meta.description,
          path: `/services/${slug}`,
        })}
      />
      <JsonLd data={faqJsonLd(service.faqs)} />
    </>
  )

  if (slug === 'digital-growth') {
    return (
      <main className="service-page">
        {structured}
        <DigitalGrowthHero service={service} />
        <HowWeWork data={service.howWeWork} />
        <WhatWeCanDo items={service.whatWeCanDo} image={service.whatWeCanDoImage} />
        <Faqs items={service.faqs} />
        <Contact />
      </main>
    )
  }

  if (slug === 'data-solutions') {
    return (
      <main className="service-page">
        {structured}
        <DataSolutionsHero data={service.hero} />
        <DataWhyChooseUs data={service.whyChooseUs} />
        <DataWhatWeDeliver data={service.whatWeDeliver} />
        <DataProcess data={service.process} />
        <Faqs items={service.faqs} />
        <Contact />
      </main>
    )
  }

  return (
    <main className="service-page">
      {structured}
      <WebSoftwareHero data={service.hero} />
      <ServiceShowcaseTabs tabs={service.showcaseTabs} />
      <WebSoftwareTech data={service.technologies} />
      <WebSoftwareProcess data={service.process} />
      <Faqs items={service.faqs} />
      <Contact />
    </main>
  )
}
