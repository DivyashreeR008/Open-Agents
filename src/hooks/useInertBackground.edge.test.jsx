import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { inertBackground, useInertBackground } from './useInertBackground'

function ToggleHarness({ active }) {
  const panelRef = useRef(null)
  useInertBackground(panelRef, active)

  return (
    <div>
      <button type="button">Page action</button>
      <section ref={panelRef} aria-label="Dialog panel">
        <button type="button">Dialog action</button>
      </section>
    </div>
  )
}

describe('useInertBackground edge cases', () => {
  it('accepts a missing panel and returns a harmless cleanup', () => {
    const button = document.createElement('button')
    document.body.appendChild(button)

    try {
      const restore = inertBackground(null)
      expect(typeof restore).toBe('function')
      expect(() => restore()).not.toThrow()
      expect(button).not.toHaveAttribute('inert')
    } finally {
      button.remove()
    }
  })

  it('skips non-rendered elements and restores pre-existing inert state', () => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      '<script></script>',
      '<div id="panel"><button type="button">Dialog action</button></div>',
      '<div id="preserved" inert aria-hidden="false"><button type="button">Preserved</button></div>',
      '<div id="hidden-layer" aria-hidden="true">Backdrop</div>',
    ].join('')
    document.body.appendChild(wrapper)

    const panel = wrapper.querySelector('#panel')
    const script = wrapper.querySelector('script')
    const preserved = wrapper.querySelector('#preserved')
    const hiddenLayer = wrapper.querySelector('#hidden-layer')

    try {
      const restore = inertBackground(panel)

      expect(script).not.toHaveAttribute('inert')
      expect(script).not.toHaveAttribute('aria-hidden')
      expect(panel).not.toHaveAttribute('inert')
      expect(preserved).toHaveAttribute('inert')
      expect(preserved).toHaveAttribute('aria-hidden', 'true')
      expect(hiddenLayer).not.toHaveAttribute('inert')
      expect(hiddenLayer).toHaveAttribute('aria-hidden', 'true')

      restore()

      expect(preserved).toHaveAttribute('inert')
      expect(preserved).toHaveAttribute('aria-hidden', 'false')
      expect(hiddenLayer).toHaveAttribute('aria-hidden', 'true')
      expect(script).not.toHaveAttribute('inert')
    } finally {
      wrapper.remove()
    }
  })

  it('restores the page and keeps focus inside the panel when deactivated', () => {
    const { rerender } = render(<ToggleHarness active />)

    const pageAction = screen.getByText('Page action').closest('button')
    const dialogAction = screen.getByText('Dialog action').closest('button')

    dialogAction.focus()
    expect(pageAction).toHaveAttribute('inert')
    expect(document.activeElement).toBe(dialogAction)

    rerender(<ToggleHarness active={false} />)

    expect(pageAction).not.toHaveAttribute('inert')
    expect(pageAction).not.toHaveAttribute('aria-hidden')
    expect(document.activeElement).toBe(dialogAction)
  })
})
