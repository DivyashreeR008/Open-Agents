import { useEffect } from 'react'

const NON_RENDERED_ELEMENTS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TEMPLATE'])
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'

/**
 * Remove everything outside a modal panel from the accessibility tree for as
 * long as the panel is active.
 *
 * `aria-modal` tells assistive technology that a dialog is modal, but support
 * is uneven and it does not stop virtual-cursor navigation in every browser.
 * The `inert` attribute removes the background from hit testing, focus, and
 * accessibility APIs. Walking up from the panel and marking each level's
 * siblings keeps the panel and its ancestors reachable while covering portals
 * as well as panels rendered inline in the page.
 *
 * @param {HTMLElement | null | undefined} container
 * @returns {() => void} restores the attributes this call changed
 */
export function inertBackground(container) {
  if (!container) return () => {}

  const changed = []
  let node = container

  while (node?.parentElement) {
    const parent = node.parentElement

    for (const sibling of parent.children) {
      if (sibling === node || sibling.contains(container)) continue
      if (NON_RENDERED_ELEMENTS.has(sibling.tagName)) continue

      // A deliberately hidden layer, such as a dialog backdrop, is already
      // outside the accessibility tree. Leave it interactive so clicking it
      // can still dismiss the dialog; only hidden layers with focusable
      // content need inert applied.
      const alreadyHidden = sibling.getAttribute('aria-hidden') === 'true'
      const hasFocusableContent =
        sibling.matches(FOCUSABLE) || Boolean(sibling.querySelector(FOCUSABLE))
      if (alreadyHidden && !hasFocusableContent) continue

      changed.push({
        element: sibling,
        hadInert: sibling.hasAttribute('inert'),
        ariaHidden: sibling.getAttribute('aria-hidden'),
      })
      sibling.setAttribute('inert', '')
      sibling.setAttribute('aria-hidden', 'true')
    }

    if (parent === document.body) break
    node = parent
  }

  return () => {
    for (const { element, hadInert, ariaHidden } of changed) {
      if (!hadInert) element.removeAttribute('inert')
      if (ariaHidden === null) element.removeAttribute('aria-hidden')
      else element.setAttribute('aria-hidden', ariaHidden)
    }
  }
}

/**
 * @param {{ current: HTMLElement | null }} containerRef
 * @param {boolean} active
 */
export function useInertBackground(containerRef, active = true) {
  useEffect(() => {
    if (!active) return undefined
    return inertBackground(containerRef.current)
  }, [active, containerRef])
}
