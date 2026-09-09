import { SITE } from '../../data'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  path: '/privacy',
  description: `How ${SITE.name} collects, uses, and protects your personal information.`,
})

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-wrap">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2026</p>

        <section>
          <h2>1. Information we collect</h2>
          <p>
            We collect information you provide directly, such as your name, email, phone
            number, and any details you include when submitting a form on this website.
          </p>
        </section>

        <section>
          <h2>2. How we use your information</h2>
          <p>
            We use your information to respond to your enquiry, deliver the services you
            request, and communicate with you about your project. We do not sell your personal
            data to third parties.
          </p>
        </section>

        <section>
          <h2>3. Data retention</h2>
          <p>
            We retain personal information only for as long as necessary to fulfil the purposes
            described in this policy or as required by law.
          </p>
        </section>

        <section>
          <h2>4. Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p>
            For any privacy-related questions, email{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
