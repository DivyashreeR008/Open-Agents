import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ScrollRestoration from './ScrollRestoration'

describe('ScrollRestoration without native scrollRestoration', () => {
  it('renders and unmounts without touching an unsupported history property', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window.history, 'scrollRestoration')
    delete window.history.scrollRestoration
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const { unmount } = render(
      <MemoryRouter>
        <ScrollRestoration />
      </MemoryRouter>
    )

    expect(() => unmount()).not.toThrow()
    expect(scrollTo).not.toHaveBeenCalled()

    if (descriptor) Object.defineProperty(window.history, 'scrollRestoration', descriptor)
    scrollTo.mockRestore()
  })
})
