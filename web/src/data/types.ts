// Shared content/data types for the marketing site.

export type ServiceSlug = 'digital-growth' | 'data-solutions' | 'web-software-development'
export type NavIconKey = 'web' | 'data' | 'growth'
export type ContactIconKey = 'email' | 'phone' | 'location'
export type ShowcaseIconKey = 'web' | 'ecommerce' | 'deployment' | 'support' | 'ai'

export interface Site {
  name: string
  shortName: string
  tagline: string
  description: string
  url: string
  email: string
  phone: string
  location: string
}

export interface NavChild {
  label: string
  to: string
  icon?: NavIconKey
  description?: string
}

export interface NavItem {
  label: string
  to?: string
  children?: NavChild[]
}

export interface FooterLink {
  label: string
  to: string
}
export type FooterCols = Record<string, FooterLink[]>

export interface AboutStatement {
  lead: string
  accent: string
  copy: string
}

export interface ContactDetail {
  title: string
  icon: ContactIconKey
  value: string
  href?: string
  note: string
}

export interface Career {
  heading: string
  headingAccent: string
  lead?: string
  image: string
  submitLabel: string
  success: string
}

export interface Pillar {
  title: string
  copy: string
  image?: string
  href?: string
}

export interface JourneyStep {
  title: string
  copy: string
  tag: string
}

export interface Reason {
  title: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface HeadingPart {
  text: string
  accent: boolean
}

export interface NumberedStep {
  number: string
  title: string
  description: string
}

export interface TitledItem {
  title: string
  description: string
}

export interface ServiceHero {
  heading: string
  headingAccent: string
  subtext: string
  cta: string
  ctaHref?: string
  image: string
}

export interface HowWeWorkData {
  heading: HeadingPart[]
  steps: NumberedStep[]
  credibility: {
    image: string
    heading: string
    copy: string
    cta?: string
    ctaHref?: string
  }
  offer: { heading: string; copy: string; cta: string }
}

export interface DigitalGrowthConfig {
  heroLead: [string, string]
  heroCta: string
  heroImage: string
  mainTask: string
  solution: string
  howWeWork: HowWeWorkData
  whatWeCanDo: NumberedStep[]
  whatWeCanDoImage: string
  faqs: FaqItem[]
}

export interface DataSolutionsConfig {
  hero: ServiceHero
  whyChooseUs: { overline: string; heading: string; cards: TitledItem[] }
  whatWeDeliver: { overline: string; heading: string; features: TitledItem[] }
  process: {
    overline: string
    heading: HeadingPart[] | string
    image?: string
    steps: NumberedStep[]
  }
  faqs: FaqItem[]
}

export interface ShowcaseTab {
  id: string
  label: string
  icon: ShowcaseIconKey
  image: string
}

export interface WebSoftwareConfig {
  hero: ServiceHero
  showcaseTabs: ShowcaseTab[]
  technologies: { heading: string; items: string[] }
  process: {
    eyebrow?: string
    heading: HeadingPart[]
    steps: { title: string; description: string }[]
    image: string
  }
  faqs: FaqItem[]
}

export interface ServicePages {
  'digital-growth': DigitalGrowthConfig
  'data-solutions': DataSolutionsConfig
  'web-software-development': WebSoftwareConfig
}
