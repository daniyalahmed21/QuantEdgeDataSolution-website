import CareerPage from '../../views/CareerPage'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Careers',
  path: '/career',
  description:
    'Join QuantEdgeDataSolutions. We hire engineers, data scientists, and growth strategists who care about real outcomes. Send us your details.',
  image: '/assets/career.png',
})

export default function Page() {
  return <CareerPage />
}
