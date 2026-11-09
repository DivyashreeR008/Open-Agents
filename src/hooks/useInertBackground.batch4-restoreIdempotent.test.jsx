import { describe, expect, it } from 'vitest'
import { inertBackground } from './useInertBackground'

describe('inert background cleanup', () => {
  it('can be called twice without changing the restored attributes', () => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      '<div id="panel"><button type="button">Dialog action</button></div>',
      '<div id="sibling"><button type="button">Page action</button></div>',
    ].join('')
    document.body.appendChild(wrapper)

    const panel = wrapper.querySelector('#panel')
    const sibling = wrapper.querySelector('#sibling')

    try {
      const restore = inertBackground(panel)
      expect(sibling).toHaveAttribute('inert')
      expect(sibling).toHaveAttribute('aria-hidden', 'true')

      restore()
      expect(sibling).not.toHaveAttribute('inert')
      expect(sibling).not.toHaveAttribute('aria-hidden')

      expect(() => restore()).not.toThrow()
      expect(sibling).not.toHaveAttribute('inert')
      expect(sibling).not.toHaveAttribute('aria-hidden')
    } finally {
      wrapper.remove()
    }
  })
})
