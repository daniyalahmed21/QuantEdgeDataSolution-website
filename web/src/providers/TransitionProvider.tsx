'use client'

import {
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'
import { BRAND } from '../data'

gsap.registerPlugin(CustomEase)
if (!CustomEase.get?.('hop')) {
  CustomEase.create('hop', '0.9, 0, 0.1, 1')
}

const ROWS = 4

interface TransitionContextValue {
  transitionTo: (to: string) => void
}

interface PendingTarget {
  path: string
  hash: string
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function usePageTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) {
    throw new Error('usePageTransition must be used within TransitionProvider')
  }
  return ctx
}

function splitTarget(to: string): PendingTarget {
  const hashIndex = to.indexOf('#')
  if (hashIndex === -1) return { path: to, hash: '' }
  return { path: to.slice(0, hashIndex) || '/', hash: to.slice(hashIndex) }
}

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const blocksRef = useRef<Array<HTMLDivElement | null>>([])
  const busyRef = useRef(false)
  const pendingRef = useRef<PendingTarget | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const animateIn = useCallback((onComplete?: () => void) => {
    const blocks = blocksRef.current.filter(Boolean) as HTMLDivElement[]
    const tl = gsap.timeline({ onComplete })

    tl.set(gridRef.current, { pointerEvents: 'all' })
    tl.set(blocks, { transformOrigin: 'left center', scaleX: 0 })

    tl.to(blocks, { scaleX: 1, duration: 0.4, ease: 'hop', stagger: 0.04 })

    // Reveal the brand text only once the blocks have fully covered the screen,
    // so the text never appears over the page before the wipe completes.
    tl.set(textRef.current, { autoAlpha: 1 })

    return tl
  }, [])

  const animateOut = useCallback((onComplete?: () => void) => {
    const blocks = blocksRef.current.filter(Boolean) as HTMLDivElement[]

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(gridRef.current, { pointerEvents: 'none' })
        gsap.set(textRef.current, { autoAlpha: 0 })
        onComplete?.()
      },
    })

    tl.set(blocks, { transformOrigin: 'right center', scaleX: 1 })

    // Hide the text layer while the blocks still fully cover the screen, so the
    // brand text can never flash over the freshly revealed page as the wipe opens.
    tl.set(textRef.current, { autoAlpha: 0 })

    tl.to(blocks, { scaleX: 0, duration: 0.35, ease: 'hop', stagger: 0.04 })

    return tl
  }, [])

  // Open the wipe and reveal the destination. Guarded so it only runs once per
  // navigation, whether triggered by the pathname flip or the safety-net timeout.
  const reveal = useCallback(
    (pending: PendingTarget) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
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
    },
    [animateOut],
  )

  // When navigation completes and the new pathname is applied, reveal the page.
  useEffect(() => {
    if (!busyRef.current) return
    const pending = pendingRef.current
    if (!pending || pending.path !== pathname) return
    reveal(pending)
  }, [pathname, reveal])

  useEffect(() => () => clearTimeout(timeoutRef.current ?? undefined), [])

  const transitionTo = useCallback(
    (to: string) => {
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

      // Start fetching the destination now so it resolves underneath the wipe-in
      // instead of adding dead time after it — keeps the covered phase consistent
      // across light and heavy routes.
      router.prefetch(path)

      animateIn(() => {
        router.push(path + hash)

        // Safety net: if the route stalls and the pathname never flips, reveal
        // anyway so the cover can never get stuck over the screen.
        timeoutRef.current = setTimeout(() => {
          const pending = pendingRef.current
          if (busyRef.current && pending) reveal(pending)
        }, 600)
      })
    },
    [pathname, router, animateIn, reveal],
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
