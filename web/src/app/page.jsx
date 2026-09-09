import Hero from '../sections/home/Hero'
import WhatWeDo from '../sections/home/WhatWeDo'
import HowWeHelp from '../sections/home/HowWeHelp'
import WhyChooseUs from '../sections/home/WhyChooseUs'
import Faqs from '../sections/shared/Faqs'
import Contact from '../sections/shared/Contact'
import { FAQS } from '../data'
import { pageMetadata, faqJsonLd, JsonLd } from '../lib/seo'

export const metadata = pageMetadata({
  path: '/',
  description:
    'One partner for web & software development, data solutions, and digital growth. QuantEdgeDataSolutions builds, analyzes, and grows your digital business.',
})

export default function HomePage() {
  return (
    <main>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero />
      <WhatWeDo />
      <HowWeHelp />
      <WhyChooseUs />
      <Faqs />
      <Contact />
    </main>
  )
}
