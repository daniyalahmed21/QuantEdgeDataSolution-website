'use client'

import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  WorkflowSquare01Icon,
  Database02Icon,
  DashboardSquare01Icon,
  AiBrain01Icon,
  Shield01Icon,
  Analytics01Icon,
} from '@hugeicons/core-free-icons'

const MOBILE_MQ = '(max-width: 640px)'

const ICONS = [
  <HugeiconsIcon key="d1" icon={WorkflowSquare01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="d2" icon={Database02Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="d3" icon={DashboardSquare01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="d4" icon={AiBrain01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="d5" icon={Shield01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="d6" icon={Analytics01Icon} strokeWidth={1.6} aria-hidden="true" />,
]

function useIsMobile() {
  // Start false so SSR and first client render agree; resolved in effect.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MQ)
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export default function DataWhatWeDeliver({ data }) {
  const isMobile = useIsMobile()
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    if (!isMobile) setOpenIndex(null)
  }, [isMobile])

  if (!data) return null

  const toggle = (index) => {
    if (!isMobile) return
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section className="ds-deliver" aria-label={data.heading}>
      <div className="ds-deliver-inner">
        <header className="ds-deliver-header">
          <p className="ds-overline">{data.overline}</p>
          <h2>{data.heading}</h2>
        </header>

        <div className="ds-deliver-grid">
          {data.features.map((feature, index) => {
            const open = !isMobile || openIndex === index

            return (
              <article
                key={feature.title}
                className={`ds-deliver-item${open && isMobile ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  className="ds-deliver-hit"
                  aria-expanded={open}
                  disabled={!isMobile}
                  onClick={() => toggle(index)}
                >
                  <span className="ds-deliver-icon" aria-hidden="true">
                    {ICONS[index]}
                  </span>
                  <span className="ds-deliver-copy">
                    <span className="ds-deliver-title">{feature.title}</span>
                    <span className={`ds-deliver-desc${open ? ' is-visible' : ''}`}>
                      {feature.description}
                    </span>
                  </span>
                  {isMobile ? (
                    <span
                      className={`ds-deliver-chevron${open ? ' is-open' : ''}`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : null}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}