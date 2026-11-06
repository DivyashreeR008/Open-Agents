import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * PageTransition — black-and-white slanted slide transition between pages.
 *
 * When the route changes, a skewed black overlay slides in from the left,
 * covers the viewport, then slides out to the right. Content fades slightly
 * during the transition. Pure CSS — no animation libraries.
 */
export default function PageTransition({ children }) {
  const location = useLocation()
  const prevLocation = useRef(location)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState('next')

  useEffect(() => {
    const prev = prevLocation.current
    prevLocation.current = location

    if (prev.pathname !== location.pathname) {
      // Determine direction based on pathname comparison
      setDirection(location.pathname > prev.pathname ? 'next' : 'prev')
      setIsTransitioning(true)

      const t = setTimeout(() => {
        setIsTransitioning(false)
      }, 650)

      return () => clearTimeout(t)
    }
  }, [location])

  return (
    <div className="relative overflow-hidden">
      {/* Slanted overlay — slides left → right on transition */}
      {isTransitioning && (
        <div
          className={`fixed inset-0 z-50 bg-black pointer-events-none ${
            direction === 'next' ? 'page-transition-overlay-next' : 'page-transition-overlay-prev'
          }`}
        />
      )}

      {/* Page content */}
      <div
        className={`relative z-10 min-h-screen transition-opacity duration-300 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
