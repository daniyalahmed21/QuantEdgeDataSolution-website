import type { WebSoftwareConfig, HeadingPart } from '../../data/types'

import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon, SourceCodeIcon, RocketIcon } from '@hugeicons/core-free-icons'

const STEP_ICONS = [
  <HugeiconsIcon key="p1" icon={Search01Icon} strokeWidth={1.7} aria-hidden="true" />,
  <HugeiconsIcon key="p2" icon={SourceCodeIcon} strokeWidth={1.7} aria-hidden="true" />,
  <HugeiconsIcon key="p3" icon={RocketIcon} strokeWidth={1.7} aria-hidden="true" />,
]

export default function WebSoftwareProcess({ data }: { data: WebSoftwareConfig['process'] }) {
  if (!data) return null

  const { eyebrow, heading, steps, image } = data

  return (
    <section className="ws-process" aria-label="Our process">
      <div className="ws-process-inner">
        <header className="ws-process-header">
          {eyebrow ? <p className="ws-process-eyebrow">{eyebrow}</p> : null}
          <h2>
            {heading.map((part: HeadingPart) => (
              <span key={part.text} className={part.accent ? 'ws-process-accent' : undefined}>
                {part.text}
              </span>
            ))}
          </h2>
        </header>

        <div className="ws-process-grid">
          <div className="ws-process-steps">
            {steps.map((step: { title: string; description: string }, index: number) => (
              <article key={step.title} className="ws-process-card">
                <span className="ws-process-icon" aria-hidden="true">
                  {STEP_ICONS[index]}
                </span>
                <div className="ws-process-card-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ws-process-media">
            <img src={image} alt="" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}
