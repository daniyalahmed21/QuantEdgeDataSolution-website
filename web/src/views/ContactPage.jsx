'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons'
import { CONTACT_DETAILS } from '../data'
import { submitContact } from '../lib/api'
import Toast from '../components/Toast'

const CONTACT_ICONS = {
  email: Mail01Icon,
  phone: Call02Icon,
  location: Location01Icon,
}

function ContactIcon({ name }) {
  const icon = CONTACT_ICONS[name] || Clock01Icon
  return <HugeiconsIcon icon={icon} size={22} strokeWidth={1.7} aria-hidden="true" />
}

export default function ContactPage() {
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    const formEl = event.currentTarget
    const form = new FormData(formEl)
    try {
      await submitContact({
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        phone: form.get('phone'),
        message: form.get('message'),
        company_website: form.get('company_website'),
      })
      formEl.reset()
      setToast('Thanks, we received your message. A teammate will be in touch shortly.')
    } catch (err) {
      setError(err.message || 'Could not send. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-hero" aria-label="Contact Us">
        <img
          className="contact-hero-img"
          src="/assets/contact-us.jpg"
          alt=""
          loading="eager"
        />
        <div className="contact-hero-overlay" aria-hidden="true" />
        <h1 className="contact-hero-title">Contact Us</h1>
      </section>

      <div className="contact-page-inner">
        <div className="contact-page-form-card">
          <form className="contact-page-form" onSubmit={onSubmit}>
              <h2>
                Send us a <span className="contact-page-accent">message</span>.
              </h2>

              <label className="hp-field" aria-hidden="true">
                Company website
                <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
              </label>

              <div className="contact-page-row">
                <label>
                  First name
                  <input name="firstName" type="text" required placeholder="Enter your first name" />
                </label>
                <label>
                  Last name
                  <input name="lastName" type="text" required placeholder="Enter your last name" />
                </label>
              </div>

              <label>
                Email
                <input name="email" type="email" required placeholder="yourname@gmail.com" />
              </label>

              <label>
                Phone number
                <input name="phone" type="tel" required placeholder="+1 234 567 890" />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Enter your message"
                />
              </label>

              {error ? <p className="form-error">{error}</p> : null}

              <button type="submit" className="btn btn-primary contact-page-submit" disabled={pending}>
                {pending ? 'Sending…' : 'Send'}
              </button>
            </form>
        </div>

        <aside className="contact-page-aside" aria-label="Contact details">
          {CONTACT_DETAILS.map((item) => (
            <article key={item.title} className="contact-info-card">
              <div className="contact-info-head">
                <span className="contact-info-icon">
                  <ContactIcon name={item.icon} />
                </span>
                <h2>{item.title}</h2>
              </div>
              {item.href ? (
                <a className="contact-info-value" href={item.href}>
                  {item.value}
                </a>
              ) : (
                <p className="contact-info-value">{item.value}</p>
              )}
              <p className="contact-info-note">{item.note}</p>
            </article>
          ))}
        </aside>
      </div>

      <Toast message={toast} open={Boolean(toast)} onClose={() => setToast('')} />
    </main>
  )
}
