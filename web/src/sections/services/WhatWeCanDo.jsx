'use client'

import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Megaphone02Icon,
  Target01Icon,
  Mail01Icon,
  Analytics01Icon,
} from '@hugeicons/core-free-icons'

const DESKTOP_MQ = '(min-width: 1024px)'

const ICONS = [
  <HugeiconsIcon key="i1" icon={Search01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="i2" icon={Megaphone02Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="i3" icon={Target01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="i4" icon={Mail01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="i5" icon={Analytics01Icon} strokeWidth={1.6} aria-hidden="true" />,
]

function useIsDesktop() {
  // Start false so server and first client render agree (no hydration mismatch);
  // the real value is resolved in the effect after mount.
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ)
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

export default function WhatWeCanDo({ items, image }) {
  const isDesktop = useIsDesktop()
  const [active, setActive] = useState(null)

  useEffect(() => {
    setActive(isDesktop ? 0 : null)
  }, [isDesktop])

  if (!items?.length) return null

  const activate = (index) => {
    if (isDesktop) {
      setActive(index)
      return
    }
    setActive((current) => (current === index ? null : index))
  }

  return (
    <section className="wwcd" aria-label="What we can do">
      <div className="wwcd-visual" aria-hidden="true">
        <img
          className="wwcd-visual-img"
          src={image || '/assets/marketing-asset-2.png'}
          alt=""
          loading="lazy"
        />
        <div className="wwcd-visual-mask" />
      </div>

      <div className="wwcd-shell">
        <div className="wwcd-main">
          <header className="wwcd-header">
            <p className="wwcd-eyebrow">( Services )</p>
            <h2>What we can do</h2>
          </header>

          <div className="wwcd-list">
            {items.map((item, index) => {
              const open = active === index

              return (
                <article
                  key={item.number}
                  className={`wwcd-row${open ? ' is-open' : ''}`}
                  onMouseEnter={() => {
                    if (isDesktop) setActive(index)
                  }}
                >
                  <div
                    className="wwcd-hit"
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    onClick={() => activate(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        activate(index)
                      }
                    }}
                  >
                    <div className="wwcd-meta">
                      <span className="wwcd-num">{item.number}</span>
                    </div>

                    <div className="wwcd-body">
                      <div className="wwcd-title-row">
                        <span className="wwcd-icon">{ICONS[index]}</span>
                        <h3 className="wwcd-title">{item.title}</h3>
                        {!isDesktop ? (
                          <span
                            className={`wwcd-chevron${open ? ' is-open' : ''}`}
                            aria-hidden="true"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : null}
                      </div>
                      <div className="wwcd-copy-wrap">
                        <p className="wwcd-copy">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="wwcd-final-cta">
            <a href="#contact" className="btn btn-primary wwcd-cta-btn">
              Ready to grow? Let&apos;s talk
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}