import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorCard from './ErrorCard'

describe('ErrorCard severity treatment', () => {
  it('renders an error as an alert with an explicit error label', () => {
    render(<ErrorCard message="The provider rejected the request." />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-red-500/30')
    expect(alert).toHaveClass('bg-red-500/5')
    expect(screen.getByRole('heading', { name: 'Error' })).toHaveClass('text-red-700')
  })

  it('renders a warning as a status with a distinct warning treatment', () => {
    render(<ErrorCard message="Rate limit reached. Try again shortly." />)

    const status = screen.getByRole('status')
    expect(status).toHaveClass('border-amber-500/30')
    expect(status).toHaveClass('bg-amber-500/5')
    expect(screen.getByRole('heading', { name: 'Warning' })).toHaveClass('text-amber-700')
  })

  it('does not expose the decorative severity icon to assistive technology', () => {
    const { container } = render(<ErrorCard message="Connection reset." />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
