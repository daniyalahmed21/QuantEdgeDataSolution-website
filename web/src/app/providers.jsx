'use client'

import { ReactLenis } from 'lenis/react'
import '../lib/gsap'
import TransitionProvider from '../providers/TransitionProvider'
import LenisScrollSync from '../providers/LenisScrollSync'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Providers({ children }) {
  return (
    <TransitionProvider>
      <ReactLenis root options={{ autoRaf: true }}>
        <LenisScrollSync />
        <div className="app">
          <Navbar />
          {children}
          <Footer />
        </div>
      </ReactLenis>
    </TransitionProvider>
  )
}
