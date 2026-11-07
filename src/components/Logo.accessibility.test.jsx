import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Logo from './Logo'

describe('Logo accessibility and sizing', () => {
  it('exposes one named image with the default height', () => {
    render(<Logo />)

    const logo = screen.getByRole('img', { name: 'Open Agents' })
    expect(logo).toHaveAttribute('height', '28')
    expect(logo).toHaveAttribute('viewBox', '0 0 320 48')
    expect(logo).toHaveTextContent('Open Agents')
  })

  it('honours a custom height and class name', () => {
    render(<Logo height={40} className="nav-logo" />)

    const logo = screen.getByRole('img', { name: 'Open Agents' })
    expect(logo).toHaveAttribute('height', '40')
    expect(logo).toHaveClass('nav-logo')
  })
})
