import { HugeiconsIcon } from '@hugeicons/react'
import {
  NewTwitterIcon,
  Linkedin01Icon,
  GithubIcon,
  DribbbleIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import Logo from './Logo'
import TransitionLink from './TransitionLink'
import { BRAND, SITE, FOOTER_COLS } from '../data'

const SOCIALS = [
  { label: 'X', href: 'https://x.com', icon: NewTwitterIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin01Icon },
  { label: 'GitHub', href: 'https://github.com', icon: GithubIcon },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: DribbbleIcon },
  { label: 'YouTube', href: 'https://youtube.com', icon: YoutubeIcon },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size={34} />
          <p className="footer-tag">
            <span className="accent">{SITE.tagline}</span>
          </p>
          <div className="socials">
            {SOCIALS.map((social) => (
              <a
                className="social"
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <HugeiconsIcon icon={social.icon} size={18} strokeWidth={1.6} aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="copyright">© {new Date().getFullYear()} {BRAND}</p>
        </div>
        <div className="footer-cols">
          {Object.entries(FOOTER_COLS).map(([head, items]) => (
            <div className="footer-col" key={head}>
              <h4>{head}</h4>
              <ul>
                {items.map((item) => (
                  <li key={item.to}>
                    <TransitionLink to={item.to}>{item.label}</TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
