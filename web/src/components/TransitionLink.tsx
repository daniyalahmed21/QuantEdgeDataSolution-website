'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { usePageTransition } from '../providers/TransitionProvider'

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

function isModifiedClick(event: MouseEvent): boolean {
  return (
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
  )
}

export default function TransitionLink({ to, onClick, children, ...rest }: TransitionLinkProps) {
  const { transitionTo } = usePageTransition()

  return (
    <Link
      href={to}
      {...rest}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || isModifiedClick(event) || rest.target === '_blank') return
        event.preventDefault()
        event.stopPropagation()
        transitionTo(to)
      }}
    >
      {children}
    </Link>
  )
}
