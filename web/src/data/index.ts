import type {
  Site, NavItem, FooterCols, AboutStatement, ContactDetail, Career,
  Pillar, JourneyStep, Reason, FaqItem, ServicePages,
} from './types'

// Central content/data source. Every section/page imports named exports from here.

export const BRAND = 'QuantEdgeDataSolutions'

export const SITE: Site = {
  name: BRAND,
  shortName: 'QuantEdge',
  tagline: 'Build. Analyze. Grow.',
  description:
    'QuantEdgeDataSolutions builds custom software, turns raw data into decisions, and drives measurable digital growth as one partner for web, data, and marketing.',
  url: 'https://www.quantedgedatasolutions.com',
  email: 'hello@quantedgedatasolutions.com',
  phone: '+1 (703) 701-9964',
  location: 'Remote-first · Serving clients worldwide',
}

export const NAV: NavItem[] = [
  {
    label: 'Services',
    children: [
      {
        label: 'Digital Growth',
        to: '/services/digital-growth',
        icon: 'growth',
        description: 'SEO, paid media & CRO that compounds revenue.',
      },
      {
        label: 'Data Solutions',
        to: '/services/data-solutions',
        icon: 'data',
        description: 'Pipelines, analytics & ML that inform decisions.',
      },
      {
        label: 'Web & Software',
        to: '/services/web-software-development',
        icon: 'web',
        description: 'Custom platforms and products built to scale.',
      },
    ],
  },
  { label: 'About', to: '/about' },
  { label: 'Career', to: '/career' },
]

export const FOOTER_COLS: FooterCols = {
  Services: [
    { label: 'Digital Growth', to: '/services/digital-growth' },
    { label: 'Data Solutions', to: '/services/data-solutions' },
    { label: 'Web & Software', to: '/services/web-software-development' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Career', to: '/career' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
  ],
}

// About page, accent must be unique (used as React key). First & last render "bleed".
export const ABOUT_STATEMENTS: AboutStatement[] = [
  {
    lead: 'Our mission is to',
    accent: 'solve real problems',
    copy: 'Not vanity metrics, not busywork. We tie every technical decision to your revenue, retention, or operating efficiency, and we can prove the difference it makes.',
  },
  {
    lead: 'We believe in',
    accent: 'direct access',
    copy: 'No layers of account managers between you and the work. You collaborate with the engineers and strategists actually building your product, in plain language.',
  },
  {
    lead: 'Our goal is',
    accent: 'compounding growth',
    copy: 'Software, data, and marketing that reinforce one another, so the systems we ship keep paying off long after launch, and scale with you as you grow.',
  },
]

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    title: 'Email',
    icon: 'email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    note: 'We reply to every message within one business day.',
  },
  {
    title: 'Phone',
    icon: 'phone',
    value: SITE.phone,
    href: 'tel:+17037019964',
    note: 'Available Mon-Fri, 9am-6pm (EST).',
  },
  {
    title: 'Location',
    icon: 'location',
    value: 'Remote-first team',
    note: 'Serving clients across North America, Europe & MENA.',
  },
]

export const CAREER: Career = {
  heading: 'Join the team building the edge in data',
  headingAccent: 'building the edge',
  lead: "We're always looking for engineers, data scientists, and growth strategists who care about outcomes. Tell us what you're great at.",
  image: '/assets/career.png',
  submitLabel: 'Submit Application',
  success:
    "Thanks for applying. We've received your details and will be in touch if there's a fit.",
}

export const WHAT_WE_DO: Pillar[] = [
  {
    title: 'Digital Growth',
    copy: 'SEO, paid media, and conversion optimization engineered to grow revenue, not just traffic. Every campaign is measured against the metrics that matter.',
    image: '/assets/digital-solutions-card.png',
    href: '/services/digital-growth',
  },
  {
    title: 'Data Solutions',
    copy: 'Data pipelines, warehouses, dashboards, and ML models that turn scattered information into decisions you can act on with confidence.',
    image: '/assets/data-solutions-card.png',
    href: '/services/data-solutions',
  },
  {
    title: 'Web & Software',
    copy: 'Custom web platforms, SaaS products, and e-commerce builds that are fast, accessible, and architected to scale with your business.',
    image: '/assets/web-software-development.png',
    href: '/services/web-software-development',
  },
  {
    title: 'Consulting & Support',
    copy: 'Fractional technical leadership, architecture reviews, and ongoing support so your team keeps momentum long after launch.',
    image: '/assets/consultancy.png',
    href: '/contact',
  },
]

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: 'Discovery call',
    copy: 'We dig into your goals, constraints, and current stack to understand exactly what success looks like.',
    tag: 'Week 1',
  },
  {
    title: 'Strategy & scope',
    copy: 'You get a clear plan: what we build, the timeline, the milestones, and how we measure the outcome.',
    tag: 'Week 1-2',
  },
  {
    title: 'Build & iterate',
    copy: 'We ship in tight loops with regular demos, so you see progress and steer the work as it takes shape.',
    tag: '4-12 weeks',
  },
  {
    title: 'Launch & grow',
    copy: 'We monitor, optimize, and scale, turning the launch into a foundation for compounding results.',
    tag: 'Ongoing',
  },
]

export const REASONS: Reason[] = [
  {
    title: 'Unified expertise',
    text: 'Web, data, and growth under one roof, with no finger-pointing between vendors and no context lost in translation.',
  },
  {
    title: 'Outcome-driven',
    text: 'Every engagement is tied to measurable KPIs. If it does not move the number, we do not ship it.',
  },
  {
    title: 'Transparent communication',
    text: 'Regular demos, honest updates, and plain language so you always know where the project stands.',
  },
  {
    title: 'Built to scale',
    text: 'We architect systems for where you are going, not just where you are, so growth never means a rebuild.',
  },
  {
    title: 'Direct access',
    text: 'You work with the builders and decision-makers, not a relay of account managers.',
  },
  {
    title: 'Proven delivery',
    text: 'A track record of shipping on time and iterating fast, from early-stage startups to established teams.',
  },
]

export const FAQS: FaqItem[] = [
  {
    q: 'What does a typical project timeline look like?',
    a: 'Most engagements run 4-12 weeks depending on scope. After the discovery call we give you a milestone-based timeline so there are no surprises.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer retainers for maintenance, optimization, and continuous improvement, plus fractional technical leadership if you need it.',
  },
  {
    q: 'How is pricing structured?',
    a: 'We scope each project after understanding your goals and provide a fixed or milestone-based estimate. No open-ended hourly surprises.',
  },
  {
    q: 'Can you work alongside our existing team?',
    a: 'Absolutely. We routinely augment in-house teams or take full ownership of a workstream, whichever gets you the best outcome.',
  },
  {
    q: 'What if we are not technical?',
    a: 'That is exactly who we build for. We explain every decision in plain language and make sure you understand the trade-offs and the impact.',
  },
]

export const SERVICE_PAGES: ServicePages = {
  'digital-growth': {
    heroLead: [
      'We turn attention into revenue with SEO, paid media, and conversion optimization,',
      'engineered around the metrics that actually move your business.',
    ],
    heroCta: 'Get a Growth Review',
    heroImage: '/assets/digital-marketing-hero.png',
    mainTask:
      'Grow qualified pipeline and revenue without wasting spend on channels and creative that do not convert.',
    solution:
      'An integrated growth engine across search, paid, and CRO, instrumented with clean analytics so every dollar is accountable to a result.',
    howWeWork: {
      heading: [
        { text: 'How we ', accent: false },
        { text: 'drive growth', accent: true },
      ],
      steps: [
        {
          number: '01',
          title: 'Audit & research',
          description:
            'We analyze your funnel, competitors, and analytics to find the highest-leverage opportunities first.',
        },
        {
          number: '02',
          title: 'Strategy & plan',
          description:
            'A prioritized roadmap across SEO, paid, and CRO, mapped to revenue targets, not vanity metrics.',
        },
        {
          number: '03',
          title: 'Launch & optimize',
          description:
            'We ship campaigns and experiments fast, then double down on what the data says is working.',
        },
        {
          number: '04',
          title: 'Report & scale',
          description:
            'Transparent reporting tied to KPIs, and a compounding plan to scale the winners.',
        },
      ],
      credibility: {
        image: '/assets/marketing-asset-1.png',
        heading: 'Growth that stands up to scrutiny',
        copy: 'Clean attribution, honest reporting, and a relentless focus on the numbers that matter to your P&L.',
        cta: 'See how we measure success',
        ctaHref: '#contact',
      },
      offer: {
        heading: 'Free 30-minute growth review',
        copy: 'Bring your goals and current metrics. We will map the fastest path to more qualified revenue.',
        cta: 'Book your review',
      },
    },
    whatWeCanDo: [
      {
        number: '01',
        title: 'SEO & content',
        description:
          'Technical SEO, content strategy, and authority building that grows durable organic traffic.',
      },
      {
        number: '02',
        title: 'Paid media',
        description:
          'Google, Meta, and LinkedIn campaigns managed to CPA and ROAS targets, not impressions.',
      },
      {
        number: '03',
        title: 'Conversion optimization',
        description:
          'Landing pages and funnels tested continuously to lift conversion rate and lower acquisition cost.',
      },
      {
        number: '04',
        title: 'Lifecycle & email',
        description:
          'Automated nurture and retention flows that increase lifetime value from the traffic you already have.',
      },
      {
        number: '05',
        title: 'Analytics & attribution',
        description:
          'Clean tracking and dashboards so you can trust every number and know what is actually working.',
      },
    ],
    whatWeCanDoImage: '/assets/marketing-asset-2.png',
    faqs: [
      {
        q: 'How soon will we see results?',
        a: 'Paid channels can show signal within weeks; SEO compounds over months. We prioritize quick wins first while building durable growth.',
      },
      {
        q: 'Do you require long contracts?',
        a: 'No. We work on flexible monthly retainers and earn the renewal with results, not lock-in.',
      },
      {
        q: 'Who owns the accounts and data?',
        a: 'You do, always. Every ad account, analytics property, and asset stays under your ownership.',
      },
      {
        q: 'Can you work with our existing marketing team?',
        a: 'Yes. We frequently plug into in-house teams to add specialist firepower where it is needed most.',
      },
    ],
  },

  'data-solutions': {
    hero: {
      heading: 'Turn your data into a competitive advantage',
      headingAccent: 'competitive advantage',
      subtext:
        'From pipelines to dashboards to machine learning, we build the data foundation that lets you decide with confidence.',
      cta: 'Start Your Data Project',
      ctaHref: '#contact',
      image: '/assets/data-solutions-hero.png',
    },
    whyChooseUs: {
      overline: 'WHY QUANTEDGE',
      heading: 'We speak both data and business',
      cards: [
        {
          title: 'Strategy first',
          description:
            'We align every data initiative with a business question worth answering rather than dashboards for their own sake.',
        },
        {
          title: 'Engineering rigor',
          description:
            'Reliable, tested pipelines and well-modeled warehouses you can trust as a single source of truth.',
        },
        {
          title: 'Actionable insight',
          description:
            'Analytics and models designed to change a decision, not just to look impressive in a slide.',
        },
        {
          title: 'Built to last',
          description:
            'Documented, maintainable systems your team can own and extend long after we hand them over.',
        },
      ],
    },
    whatWeDeliver: {
      overline: 'CAPABILITIES',
      heading: 'What we deliver',
      features: [
        {
          title: 'Data pipelines & ETL',
          description:
            'Automated, monitored ingestion from every source into a clean, query-ready warehouse.',
        },
        {
          title: 'Data warehousing',
          description:
            'Well-modeled warehouses on BigQuery, Snowflake, or Postgres that are fast, governed, and cost-aware.',
        },
        {
          title: 'BI & dashboards',
          description:
            'Self-serve dashboards that put trustworthy metrics in front of the people who need them.',
        },
        {
          title: 'Machine learning',
          description:
            'Forecasting, segmentation, and recommendation models shipped into production, not notebooks.',
        },
        {
          title: 'Data quality & governance',
          description:
            'Testing, lineage, and documentation so you can trust the numbers and stay compliant.',
        },
        {
          title: 'Embedded analytics',
          description:
            'Analytics baked directly into your product so your customers get insight, too.',
        },
      ],
    },
    process: {
      overline: 'OUR APPROACH',
      heading: [
        { text: 'How we ', accent: false },
        { text: 'build data solutions', accent: true },
      ],
      image: '/assets/data-solutions-asset-1.png',
      steps: [
        {
          number: '01',
          title: 'Assess',
          description:
            'We audit your sources, tooling, and the decisions you want data to drive.',
        },
        {
          number: '02',
          title: 'Design',
          description:
            'We architect the pipeline, model, and metrics layer around those decisions.',
        },
        {
          number: '03',
          title: 'Build',
          description:
            'We implement tested, monitored pipelines and the dashboards or models on top.',
        },
        {
          number: '04',
          title: 'Operationalize',
          description:
            'We hand over documented systems and train your team to own and extend them.',
        },
      ],
    },
    faqs: [
      {
        q: 'Which data stack do you work with?',
        a: 'We are tool-agnostic and work across BigQuery, Snowflake, Postgres, dbt, Airflow, Looker, Power BI, and more. We choose what fits your scale and budget.',
      },
      {
        q: 'Can you fix our existing messy data?',
        a: 'Yes. A lot of our work is untangling brittle pipelines and inconsistent metrics into a clean, trustworthy foundation.',
      },
      {
        q: 'Do you build machine learning models?',
        a: 'We do, but only where they change a decision. We start with the business problem, then choose the simplest approach that solves it.',
      },
      {
        q: 'Will our team be able to maintain it?',
        a: 'That is the point. We document everything and train your team so you are never dependent on us to keep the lights on.',
      },
    ],
  },

  'web-software-development': {
    hero: {
      heading: 'Custom software that scales with your business',
      headingAccent: 'scales with your business',
      subtext:
        'From marketing sites to complex SaaS platforms, we design and build fast, accessible, maintainable products.',
      cta: "Let's Build Together",
      ctaHref: '#contact',
      image: '/assets/web-software-development.png',
    },
    showcaseTabs: [
      { id: 'web', label: 'Web Platforms', icon: 'web', image: '/assets/web.png' },
      {
        id: 'ecommerce',
        label: 'E-Commerce',
        icon: 'ecommerce',
        image: '/assets/e-commerce.png',
      },
      {
        id: 'deployment',
        label: 'Cloud & DevOps',
        icon: 'deployment',
        image: '/assets/deployment.png',
      },
      {
        id: 'support',
        label: 'IT Support',
        icon: 'support',
        image: '/assets/it-support.png',
      },
      {
        id: 'ai',
        label: 'AI Automation',
        icon: 'ai',
        image: '/assets/ai-automation.png',
      },
    ],
    technologies: {
      heading: 'A modern stack, chosen for your problem',
      items: [
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'Python',
        'PostgreSQL',
        'GraphQL',
        'AWS',
        'Docker',
        'Tailwind CSS',
      ],
    },
    process: {
      eyebrow: 'OUR PROCESS',
      heading: [
        { text: 'Discover. ', accent: false },
        { text: 'Build. ', accent: false },
        { text: 'Launch.', accent: true },
      ],
      steps: [
        {
          title: 'Discover',
          description:
            'We map requirements, users, and constraints into a clear technical plan and architecture.',
        },
        {
          title: 'Build',
          description:
            'We develop in tight, demo-driven sprints with automated testing and continuous feedback.',
        },
        {
          title: 'Launch',
          description:
            'We deploy on reliable cloud infrastructure and support you through launch and beyond.',
        },
      ],
      image: '/assets/software-development-asset.png',
    },
    faqs: [
      {
        q: 'Do you design as well as build?',
        a: 'Yes. We handle UX and UI design through to production code, so the experience and the engineering stay in sync.',
      },
      {
        q: 'Can you take over an existing codebase?',
        a: 'We can. We start with an audit, stabilize what matters, and set a pragmatic path forward.',
      },
      {
        q: 'How do you handle hosting and maintenance?',
        a: 'We deploy to modern cloud platforms and offer ongoing support retainers, or hand off clean docs so your team can run it.',
      },
      {
        q: 'What about performance and SEO?',
        a: 'Every build ships fast, accessible, and SEO-ready, with server rendering, image optimization, and clean semantics by default.',
      },
    ],
  },
}
