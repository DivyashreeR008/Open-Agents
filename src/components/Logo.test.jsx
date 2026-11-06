import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Logo from './Logo'

describe('Logo', () => {
  it('exposes a stable accessible name and image role', () => {
    render(<Logo />)

    const logo = screen.getByRole('img', { name: 'Open Agents' })
    expect(logo).toHaveAttribute('aria-label', 'Open Agents')
    expect(logo).toHaveAttribute('viewBox', '0 0 320 48')
  })

  it('uses the documented default height and honours an override', () => {
    const { rerender } = render(<Logo />)
    expect(screen.getByRole('img', { name: 'Open Agents' })).toHaveAttribute('height', '28')

    rerender(<Logo height={40} />)
    expect(screen.getByRole('img', { name: 'Open Agents' })).toHaveAttribute('height', '40')
  })

  it('renders the wordmark inside the SVG', () => {
    const { container } = render(<Logo />)
    const wordmark = container.querySelector('text')

    expect(wordmark).not.toBeNull()
    expect(wordmark.textContent).toBe('Open Agents')
    expect(wordmark).toHaveAttribute('fill', 'currentColor')
  })

  it('applies a custom class without removing the SVG contract', () => {
    const { container } = render(<Logo className="shrink-0" />)
    const logo = container.querySelector('svg')

    expect(logo).toHaveClass('shrink-0')
    expect(logo).toHaveAttribute('role', 'img')
  })
})
