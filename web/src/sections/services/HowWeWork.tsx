import type { HowWeWorkData, HeadingPart, NumberedStep } from '../../data/types'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon,
  Notebook01Icon,
  RocketIcon,
  ChartIncreaseIcon,
} from '@hugeicons/core-free-icons'

const STEP_ICONS = [
  <HugeiconsIcon key="s1" icon={Search01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="s2" icon={Notebook01Icon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="s3" icon={RocketIcon} strokeWidth={1.6} aria-hidden="true" />,
  <HugeiconsIcon key="s4" icon={ChartIncreaseIcon} strokeWidth={1.6} aria-hidden="true" />,
]

export default function HowWeWork({ data }: { data: HowWeWorkData }) {
  if (!data) return null

  const { heading, steps, credibility, offer } = data

  return (
    <section className="dg-how" aria-label="How we work">
      <div className="dg-how-inner">
        <div className="dg-how-heading">
          <h2>
            {heading.map((line: HeadingPart) => (
              <span key={line.text} className={line.accent ? 'dg-how-accent' : ''}>
                {line.text}
              </span>
            ))}
          </h2>
        </div>

        <div className="dg-how-steps">
          {steps.map((step: NumberedStep, index: number) => (
            <article key={step.number} className="dg-how-step">
              <span className="dg-how-step-num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="dg-how-step-icon" aria-hidden="true">
                {STEP_ICONS[index]}
              </span>
            </article>
          ))}
        </div>

        <div className="dg-how-bottom">
          <article className="dg-how-credibility">
            <div
              className="dg-how-credibility-media"
              style={{ backgroundImage: `url(${credibility.image})` }}
              aria-hidden="true"
            />
            <div className="dg-how-credibility-overlay" aria-hidden="true" />
            <div className="dg-how-credibility-content">
              <h3>{credibility.heading}</h3>
              <p>{credibility.copy}</p>
              {credibility.cta ? (
                <a href={credibility.ctaHref || '#contact'} className="dg-how-credibility-cta">
                  {credibility.cta}
                </a>
              ) : null}
            </div>
          </article>

          <article className="dg-how-offer">
            <h3>{offer.heading}</h3>
            <p>{offer.copy}</p>
            <a href="#contact" className="btn btn-primary dg-how-offer-btn">
              {offer.cta}
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
