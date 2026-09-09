import TransitionLink from '../../components/TransitionLink'
import { WHAT_WE_DO } from '../../data'

function PillarCard({ title, copy, image, href, index }) {
  return (
    <div className="card" id={`card-${index + 1}`} style={{ '--card-i': index }}>
      <div className="card-inner">
        <div className="card-content">
          <div className="card-head">
            <span className="card-num">0{index + 1}</span>
            <h2>{title}</h2>
          </div>
          <p>{copy}</p>
          {href ? (
            <TransitionLink to={href} className="btn btn-primary card-cta">
              Learn more
            </TransitionLink>
          ) : (
            <button type="button" className="btn btn-primary card-cta">
              Learn more
            </button>
          )}
        </div>
        {image ? (
          <div className="card-img">
            <img src={image} alt={`${title} illustration`} loading="lazy" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function WhatWeDo() {
  return (
    <section className="pillars-section" id="services">
      <div className="intro">
        <p className="eyebrow">WHAT WE DO</p>
        <h2>
          Four pillars.<br />One partner.
        </h2>
      </div>

      <div className="cards">
        {WHAT_WE_DO.map((card, index) => (
          <PillarCard key={card.title} {...card} index={index} />
        ))}
      </div>
    </section>
  )
}
