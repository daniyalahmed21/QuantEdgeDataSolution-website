import { HugeiconsIcon } from '@hugeicons/react'
import {
  Target01Icon,
  SourceCodeIcon,
  Idea01Icon,
  Shield01Icon,
} from '@hugeicons/core-free-icons'

const ICONS = [
  <HugeiconsIcon key="w1" icon={Target01Icon} strokeWidth={1.8} aria-hidden="true" />,
  <HugeiconsIcon key="w2" icon={SourceCodeIcon} strokeWidth={1.8} aria-hidden="true" />,
  <HugeiconsIcon key="w3" icon={Idea01Icon} strokeWidth={1.8} aria-hidden="true" />,
  <HugeiconsIcon key="w4" icon={Shield01Icon} strokeWidth={1.8} aria-hidden="true" />,
]

export default function DataWhyChooseUs({ data }) {
  if (!data) return null

  return (
    <section className="ds-why" aria-label={data.heading}>
      <div className="ds-why-inner">
        <header className="ds-why-header">
          <div className="ds-why-heading-block">
            <p className="ds-overline">{data.overline}</p>
            <h2>{data.heading}</h2>
          </div>
        </header>

        <div className="ds-why-cards">
          {data.cards.map((card, index) => (
            <article key={card.title} className="ds-why-card">
              <span className="ds-why-icon" aria-hidden="true">
                {ICONS[index]}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
