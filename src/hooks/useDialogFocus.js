import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusable = (root) =>
  [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true')

const focusWithoutScroll = (element) => {
  if (!element) return
  try {
    element.focus({ preventScroll: true })
  } catch {
    element.focus()
  }
}

/**
 * Focus handling for a modal overlay.
 * While `active` is true it moves focus into `containerRef` (an element marked
 * `data-autofocus` wins, otherwise the first focusable one, otherwise the
 * container itself), keeps Tab and Shift+Tab inside it, calls `onClose` on
 * Escape, and puts focus back on whatever had it before the overlay opened.
 */
export function useDialogFocus(containerRef, { active = true, onClose } = {}) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!active) return undefined
    const container = containerRef.current
    if (!container) return undefined

    const opener = document.activeElement
    if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1')

    if (!container.contains(document.activeElement)) {
      const target = container.querySelector('[data-autofocus]') || getFocusable(container)[0] || container
      focusWithoutScroll(target)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = getFocusable(container)
      if (!focusable.length) {
        event.preventDefault()
        focusWithoutScroll(container)
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === first || current === container || !container.contains(current))) {
        event.preventDefault()
        focusWithoutScroll(last)
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault()
        focusWithoutScroll(first)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (opener instanceof HTMLElement && opener !== document.body && opener.isConnected) {
        focusWithoutScroll(opener)
      }
    }
  }, [active, containerRef])
}
