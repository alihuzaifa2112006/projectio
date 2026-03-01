'use client'

import React, { useEffect, useRef } from 'react'
import Home from './Home'
import MainLanding from './MainLanding'

const Landing = () => {
  const mainRef = useRef(null)

  useEffect(() => {
    // Lock scroll for 2 seconds - user must see Home (Projectio + laptop)
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }
    const unlockScroll = () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }

    lockScroll()

    const timer = setTimeout(() => {
      unlockScroll()
      // Small delay so browser can reflow after overflow change
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mainRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        })
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      unlockScroll()
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Section 1: Home (Projectio + laptop) - shows for 2 sec, then user can scroll up to see again */}
      <section id="home" className="min-h-screen">
        <Home />
      </section>

      {/* Section 2: MainLanding + Features + Customer + Pricing + Blog - all stacked, auto-scrolls here after 2 sec */}
      <section ref={mainRef}>
        <MainLanding />
      </section>
    </div>
  )
}

export default Landing
