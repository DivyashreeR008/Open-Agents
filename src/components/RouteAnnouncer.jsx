import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MAIN_CONTENT_ID } from './SkipToMainContentLink'

const POLL_MS = 100
const MAX_POLLS = 20

function isRendered(el) {
  for (let node = el; node; node = node.parentElement) {
    if (getComputedStyle(node).display === 'none') return false
  }
  return true
}

// While a lazy page is loading, React keeps the previous tree hidden, so only
// trust the main landmark and its heading once they are actually rendered.
function resolvePage() {
  const main = document.getElementById(MAIN_CONTENT_ID)
  if (!main || !isRendered(main)) return { main: null, name: '' }
  const heading = [...main.querySelectorAll('h1')].find((h) => isRendered(h))
  return { main, name: heading?.textContent?.trim() || '' }
}

/**
 * Moves focus to the main landmark and announces the destination page after a
 * route change (push, replace, or browser back/forward). The initial load and
 * hash-only changes are left alone so the skip link and anchors still work.
 */
export default function RouteAnnouncer() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    // Pages are lazy-loaded, so wait briefly for the new heading to render.
    let polls = 0
    let timer
    const announce = () => {
      const { main, name } = resolvePage()
      if (name || polls >= MAX_POLLS) {
        main?.focus({ preventScroll: true })
        const fallback = document.title || pathname
        setMessage(`Navigated to ${name || fallback}`)
        return
      }
      polls += 1
      timer = setTimeout(announce, POLL_MS)
    }
    announce()

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}
