import ContactPage from '../../views/ContactPage'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Contact',
  path: '/contact',
  description:
    'Get in touch with QuantEdgeDataSolutions. Tell us about your web, data, or growth project and a teammate will respond within one business day.',
  image: '/assets/contact-us.jpg',
})

export default function Page() {
  return <ContactPage />
}
