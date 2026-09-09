import Link from 'next/link'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="notfound-page">
      <div className="notfound-inner">
        <p className="notfound-code">404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p className="notfound-copy">
          The page you&apos;re looking for may have moved or never existed. Let&apos;s get you
          back on track.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  )
}
