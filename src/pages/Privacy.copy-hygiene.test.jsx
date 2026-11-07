import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import Privacy from './Privacy'

describe('Privacy policy copy hygiene', () => {
  it('ships no placeholder markers or template artifacts', () => {
    const { container } = render(<Privacy />)
    const text = container.textContent

    expect(text).not.toMatch(/lorem ipsum/i)
    expect(text).not.toMatch(/\bTODO\b/)
    expect(text).not.toContain('example.com')
    expect(text).not.toContain('[insert')
  })
})
