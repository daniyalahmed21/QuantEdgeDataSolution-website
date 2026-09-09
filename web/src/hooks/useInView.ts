import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export default function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  const { threshold = 0.2, rootMargin = '0px', once = true } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        if (once) io.disconnect()
      },
      { threshold, rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}
