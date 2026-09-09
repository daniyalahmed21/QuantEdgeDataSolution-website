'use client'

import {
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'
import SplitText from 'gsap/SplitText'
import { BRAND } from '../data'

gsap.registerPlugin(CustomEase, SplitText)
if (!CustomEase.get?.('hop')) {
  CustomEase.create('hop', '0.9, 0, 0.1, 1')
}

const ROWS = 4
const TransitionContext = createContext(null)

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) {
    throw new Error('usePageTransition must be used within TransitionProvider')
  }
  return ctx
}

function splitTarget(to) {
  const hashIndex = to.indexOf('#')
  if (hashIndex === -1) return { path: to, hash: '' }
  return { path: to.slice(0, hashIndex) || '/', hash: to.slice(hashIndex) }
}

export default function TransitionProvider({ children }) {
  const gridRef = useRef(null)
  const textRef = useRef(null)
  const blocksRef = useRef([])
  const headingRef = useRef(null)
  const wordsRef = useRef([])
  const splitRef = useRef(null)
  const busyRef = useRef(false)
  const pendingRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!headingRef.current) return undefined

    splitRef.current = new SplitText(headingRef.current, {
      type: 'words',
      wordsClass: 'word',
      mask: 'words',
    })

    wordsRef.current = splitRef.current.words
    gsap.set(wordsRef.current, { y: '100%' })

    return () => splitRef.current?.revert()
  }, [])

  const animateIn = useCallback((onComplete) => {
    const blocks = blocksRef.current.filter(Boolean)
    const words = wordsRef.current
    const tl = gsap.timeline({ onComplete })

    tl.set(gridRef.current, { pointerEvents: 'all' })
    tl.set(textRef.current, { autoAlpha: 1 })
    tl.set(blocks, { transformOrigin: 'left center', scaleX: 0 })
    if (words?.length) tl.set(words, { y: '100%' })

    tl.to(blocks, {
      scaleX: 1,
      duration: 0.5,
      ease: 'hop',
      stagger: 0.05,
    })

    if (words?.length) {
      tl.to(
        words,
        {
          y: '0%',
          duration: 0.5,
          ease: 'power4.out',
          stagger: 0.06,
        },
        '-=0.35',
      )
    }

    return tl
  }, [])

  const animateOut = useCallback((onComplete) => {
    const blocks = blocksRef.current.filter(Boolean)
    const words = wordsRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(gridRef.current, { pointerEvents: 'none' })
        gsap.set(textRef.current, { autoAlpha: 0 })
        onComplete?.()
      },
    })

    tl.set(blocks, { transformOrigin: 'right center', scaleX: 1 })

    if (words?.length) {
      tl.to(words, {
        y: '100%',
        duration: 0.35,
        ease: 'power4.out',
        stagger: 0.05,
      })
    }

    // Hide the text layer while the blocks still fully cover the screen, so the
    // brand text can never flash over the freshly revealed page as the wipe opens.
    tl.set(textRef.current, { autoAlpha: 0 })

    tl.to(blocks, {
      scaleX: 0,
      duration: 0.45,
      ease: 'hop',
      stagger: 0.05,
    })

    return tl
  }, [])

  // When navigation completes and the new pathname is applied, reveal the page.
  useEffect(() => {
    if (!busyRef.current) return
    const pending = pendingRef.current
    if (!pending || pending.path !== pathname) return

    pendingRef.current = null
    window.scrollTo(0, 0)

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (pending.hash) {
          document.querySelector(pending.hash)?.scrollIntoView()
        }
        animateOut(() => {
          busyRef.current = false
        })
      }),
    )
  }, [pathname, animateOut])

  const transitionTo = useCallback(
    (to) => {
      if (busyRef.current) return

      const { path, hash } = splitTarget(String(to))

      // Same page, just handle in-page hash scrolling.
      if (path === pathname) {
        if (hash) {
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }

      busyRef.current = true
      pendingRef.current = { path, hash }

      animateIn(() => {
        router.push(path + hash)
      })
    },
    [pathname, router, animateIn],
  )

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div ref={gridRef} className="transition-grid" aria-hidden="true">
        {Array.from({ length: ROWS }).map((_, i) => (
          <div
            key={i}
            className="transition-block"
            ref={(el) => {
              blocksRef.current[i] = el
            }}
          />
        ))}
      </div>

      <div ref={textRef} className="transition-text" aria-hidden="true">
        <span className="transition-brand">{BRAND}.</span>
      </div>

      {children}
    </TransitionContext.Provider>
  )
}
