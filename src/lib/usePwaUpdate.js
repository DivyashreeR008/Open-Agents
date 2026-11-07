import { useCallback, useEffect, useState } from 'react'

/**
 * Hook to manage PWA Service Worker lifecycle, registration, and update notifications.
 * Tells users when a new version is available and lets them activate it immediately.
 */
export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Do not auto-register in test runner unless explicitly mocked
    if (import.meta.env?.MODE === 'test') {
      return
    }

    let refreshing = false
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    const onRegistrationSuccess = (registration) => {
      // If a worker is already waiting to activate
      if (registration.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting)
        setUpdateAvailable(true)
      }

      // Listen for incoming new service workers
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker)
            setUpdateAvailable(true)
          }
        })
      })
    }

    const registerWorker = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(onRegistrationSuccess)
        .catch(() => {
          // SW registration failed (e.g. file protocol or blocked by browser)
        })
    }

    if (document.readyState === 'complete') {
      registerWorker()
    } else {
      window.addEventListener('load', registerWorker)
      return () => {
        window.removeEventListener('load', registerWorker)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      }
    }

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    } else if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [waitingWorker])

  const dismiss = useCallback(() => {
    setDismissed(true)
  }, [])

  return {
    updateAvailable: updateAvailable && !dismissed,
    applyUpdate,
    dismiss,
    waitingWorker,
  }
}

export default usePwaUpdate
