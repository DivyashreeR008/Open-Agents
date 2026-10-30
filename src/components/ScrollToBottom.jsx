import React, { useEffect, useState } from 'react'

export default function ScrollToBottom() {
  const [visible, setVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduceMotion(e.matches)
    setReduceMotion(mq.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    const checkVisibility = () => {
      // Use standard documentElement falling back to body
      const scrollHeight = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0
      )
      const clientHeight = window.innerHeight || document.documentElement?.clientHeight || 0
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement?.scrollTop || 0

      // Check if page is actually scrollable
      const isScrollable = scrollHeight > clientHeight
      // Check if user is not near the bottom (buffer of 50px)
      const isNotNearBottom = scrollY + clientHeight < scrollHeight - 50

      setVisible(isScrollable && isNotNearBottom)
    }

    // Run initial check and defer once to ensure initial elements are measured
    checkVisibility()
    const timeoutId = setTimeout(checkVisibility, 100)

    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    // Observe DOM mutations so streaming tokens or dynamically rendered
    // content updating the DOM immediately triggers visibility recalculation
    // without requiring user interaction (scroll or resize)
    let mutationObserver = null
    if (typeof MutationObserver !== 'undefined' && document.body) {
      mutationObserver = new MutationObserver(() => {
        checkVisibility()
      })
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    // Observe element resizing in case layout heights change during streaming
    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        checkVisibility()
      })
      resizeObserver.observe(document.body)
      if (document.documentElement && document.documentElement !== document.body) {
        resizeObserver.observe(document.documentElement)
      }
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  const handleClick = (e) => {
    // Prevent default form behavior if encapsulated, just in case
    e.preventDefault()

    const maxScroll = Math.max(
      document.documentElement?.scrollHeight || 0,
      document.body?.scrollHeight || 0
    )

    window.scrollTo({
      top: maxScroll,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  const transitionClasses = reduceMotion ? '' : 'transition-all transform duration-300 ease-in-out'
  const visibilityClasses = visible
    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
    : 'opacity-0 translate-y-2 invisible pointer-events-none'

  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      aria-hidden={!visible}
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-20 right-6 z-50 w-10 h-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-offset-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-gray-900 ${transitionClasses} ${visibilityClasses}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-4 h-4 text-gray-700 dark:text-text-primary text-gray-900">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  )
}
