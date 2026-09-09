import { SITE } from '../../data'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Terms & Conditions',
  path: '/terms',
  description: `The terms and conditions governing your use of the ${SITE.name} website and services.`,
})

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-wrap">
        <h1>Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: January 2026</p>

        <section>
          <h2>1. Acceptance of terms</h2>
          <p>
            By accessing or using the {SITE.name} website, you agree to be bound by these
            terms. If you do not agree with any part of the terms, please do not use the site.
          </p>
        </section>

        <section>
          <h2>2. Services</h2>
          <p>
            {SITE.name} provides web and software development, data solutions, and digital
            growth services. The scope, deliverables, and timelines of any engagement are
            defined in a separate written agreement between you and {SITE.name}.
          </p>
        </section>

        <section>
          <h2>3. Intellectual property</h2>
          <p>
            All content on this website, including text, graphics, logos, and code, is the
            property of {SITE.name} unless otherwise stated, and is protected by applicable
            intellectual property laws.
          </p>
        </section>

        <section>
          <h2>4. Limitation of liability</h2>
          <p>
            This website is provided on an &ldquo;as is&rdquo; basis. {SITE.name} is not liable
            for any indirect or consequential loss arising from your use of the site or reliance
            on its content.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p>
            Questions about these terms? Email us at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
