import type { WebSoftwareConfig } from '../../data/types'

export default function WebSoftwareTech({ data }: { data: WebSoftwareConfig['technologies'] }) {
  if (!data?.items?.length) return null

  const { heading, items } = data
  const track = [...items, ...items]

  return (
    <section className="ws-tech" aria-label="Technologies">
      <div className="ws-tech-inner">
        <h2 className="ws-tech-heading">{heading}</h2>
      </div>

      <div className="ws-tech-marquee" aria-hidden="true">
        <div className="ws-tech-track">
          {track.map((name: string, index: number) => (
            <span key={`${name}-${index}`} className="ws-tech-item">
              {name}
            </span>
          ))}
        </div>
      </div>

      <ul className="visually-hidden">
        {items.map((name: string) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  )
}
