import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const originalMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

describe('Navbar without matchMedia', () => {
  it('renders when the browser cannot report a color scheme preference', () => {
    window.matchMedia = undefined

    expect(() =>
      render(
        <MemoryRouter>
          <Navbar sidebarOpen={false} setSidebarOpen={vi.fn()} />
        </MemoryRouter>
      )
    ).not.toThrow()
  })
})
