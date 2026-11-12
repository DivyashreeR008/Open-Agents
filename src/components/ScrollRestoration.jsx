import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const MAX_RESTORE_FRAMES = 90

function canControlScrollRestoration() {
  return typeof window !== 'undefined' && 'scrollRestoration' in window.history
}

/**
 * Gives client-side navigation the same sense of place as a full page load.
 * Push and replace navigations start at the top, while history traversals
 * return to the offset the user left for that history entry. Offsets are kept
 * per location key and updated while the user scrolls.
 */
export default function ScrollRestoration() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map())
  const activeKey = useRef(location.key)
  const handledKey = useRef(null)
  const previousPath = useRef(location.pathname)
  const previousHash = useRef(location.hash)
  const frame = useRef(0)
  const attempts = useRef(0)

  useEffect(() => {
    if (!canControlScrollRestoration()) return undefined
    const original = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = original
    }
  }, [])

  useEffect(() => {
    const track = () => positions.current.set(activeKey.current, window.scrollY)
    track()
    window.addEventListener('scroll', track, { passive: true })
    return () => window.removeEventListener('scroll', track)
  }, [])

  useLayoutEffect(() => {
    const pathChanged = previousPath.current !== location.pathname
    const hashChanged = previousHash.current !== location.hash
    previousPath.current = location.pathname
    previousHash.current = location.hash

    // StrictMode replays effects for the same entry, so handle each key once.
    if (handledKey.current === location.key) return

    if (activeKey.current !== location.key) {
      // The scroll listener may miss the last pixels before a click, so read
      // the live offset before switching to the incoming entry.
      positions.current.set(activeKey.current, window.scrollY)
    }
    activeKey.current = location.key
    const isFirstEntry = handledKey.current === null
    handledKey.current = location.key

    cancelAnimationFrame(frame.current)
    attempts.current = 0

    if (isFirstEntry) return

    // Leave in-page anchors to the browser so links such as #section still work.
    if (!pathChanged && hashChanged && location.hash) return

    if (navigationType === 'POP') {
      const target = positions.current.get(location.key) ?? 0
      // Lazy pages may still be too short to accept the offset, so try again
      // on the next frames until the content has grown enough.
      const restore = () => {
        window.scrollTo(0, target)
        attempts.current += 1
        if (Math.abs(window.scrollY - target) > 1 && attempts.current < MAX_RESTORE_FRAMES) {
          frame.current = requestAnimationFrame(restore)
        }
      }
      frame.current = requestAnimationFrame(restore)
      return
    }

    positions.current.set(location.key, 0)
    window.scrollTo(0, 0)
  }, [location.key, location.pathname, location.hash, navigationType])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return null
}
