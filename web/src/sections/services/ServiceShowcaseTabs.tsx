'use client'

import type { ReactElement } from 'react'
import type { ShowcaseTab, ShowcaseIconKey } from '../../data/types'

import { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  GlobalIcon,
  ShoppingCart01Icon,
  CloudUploadIcon,
  CustomerSupportIcon,
  ArtificialIntelligence04Icon,
} from '@hugeicons/core-free-icons'

const AUTO_MS = 3000
const MOBILE_MQ = '(max-width: 700px)'

const ICONS: Record<ShowcaseIconKey, ReactElement> = {
  web: <HugeiconsIcon icon={GlobalIcon} strokeWidth={1.6} aria-hidden="true" />,
  ecommerce: <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={1.6} aria-hidden="true" />,
  deployment: <HugeiconsIcon icon={CloudUploadIcon} strokeWidth={1.6} aria-hidden="true" />,
  support: <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={1.6} aria-hidden="true" />,
  ai: <HugeiconsIcon icon={ArtificialIntelligence04Icon} strokeWidth={1.6} aria-hidden="true" />,
}

export default function ServiceShowcaseTabs({
  tabs,
  eyebrow = 'What we build',
  intervalMs = AUTO_MS,
}: { tabs: ShowcaseTab[]; eyebrow?: string; intervalMs?: number }) {
  const [active, setActive] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!tabs?.length || tabs.length < 2) return undefined

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % tabs.length)
    }, intervalMs)

    return () => window.clearTimeout(timer)
  }, [active, tabs, intervalMs])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia(MOBILE_MQ).matches) return

    const tab = tabRefs.current[active]
    const nav = navRef.current
    if (!tab || !nav) return

    const tabLeft = tab.offsetLeft
    const tabRight = tabLeft + tab.offsetWidth
    const viewLeft = nav.scrollLeft
    const viewRight = viewLeft + nav.clientWidth
    const pad = 16

    if (tabLeft < viewLeft + pad) {
      nav.scrollTo({ left: Math.max(0, tabLeft - pad), behavior: 'smooth' })
    } else if (tabRight > viewRight - pad) {
      nav.scrollTo({ left: tabRight - nav.clientWidth + pad, behavior: 'smooth' })
    }
  }, [active])

  if (!tabs?.length) return null

  return (
    <section className="ss-tabs" aria-label="Service showcase">
      <div className="ss-tabs-inner">
        {eyebrow ? <p className="ss-tabs-eyebrow">{eyebrow}</p> : null}

        <div className="ss-tabs-frame">
          <div ref={navRef} className="ss-tabs-nav" role="tablist" aria-label="Categories">
            {tabs.map((tab: ShowcaseTab, index: number) => {
              const selected = index === active

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`ss-tab-${tab.id}`}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  aria-selected={selected}
                  aria-controls={`ss-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  className={`ss-tabs-tab${selected ? ' is-active' : ''}`}
                  onClick={() => setActive(index)}
                >
                  <span className="ss-tabs-icon" aria-hidden="true">
                    {ICONS[tab.icon] || ICONS.web}
                  </span>
                  <span className="ss-tabs-label">{tab.label}</span>
                  {selected ? (
                    <span
                      key={`progress-${tab.id}-${active}`}
                      className="ss-tabs-progress"
                      style={{ animationDuration: `${intervalMs}ms` }}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="ss-tabs-stage">
            {tabs.map((tab: ShowcaseTab, index: number) => {
              const selected = index === active

              return (
                <div
                  key={tab.id}
                  id={`ss-panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`ss-tab-${tab.id}`}
                  aria-hidden={!selected}
                  className={`ss-tabs-pane${selected ? ' is-active' : ''}`}
                >
                  <img
                    src={tab.image}
                    alt={`${tab.label} showcase`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}