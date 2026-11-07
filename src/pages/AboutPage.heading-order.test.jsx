import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], catalogSize: 1 }) }))

import AboutPage from './AboutPage'

describe('AboutPage heading order', () => {
  it('starts with one h1 and points every labelled section at an existing heading', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    )

    const headings = [...container.querySelectorAll('h1, h2, h3')]
    expect(headings.filter((node) => node.tagName === 'H1')).toHaveLength(1)
    expect(headings[0].tagName).toBe('H1')

    const labelled = [...container.querySelectorAll('[aria-labelledby]')]
    expect(labelled.length).toBeGreaterThanOrEqual(6)
    for (const node of labelled) {
      const id = node.getAttribute('aria-labelledby')
      expect(container.querySelector(`#${id}`), id).not.toBeNull()
    }
  })
})
