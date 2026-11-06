import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorCard from './ErrorCard'

describe('ErrorCard', () => {
  it('renders a generic string as an error', () => {
    render(<ErrorCard message="The provider rejected the request." />)

    expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument()
    expect(screen.getByText('The provider rejected the request.')).toBeInTheDocument()
  })

  it('classifies a rate-limit message as a warning', () => {
    render(<ErrorCard message="Rate limit reached. Try again shortly." />)

    expect(screen.getByRole('heading', { name: 'Warning' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Error' })).not.toBeInTheDocument()
  })

  it('classifies a quota message without regard to case', () => {
    render(<ErrorCard message="QUOTA USED UP for this key" />)

    expect(screen.getByRole('heading', { name: 'Warning' })).toBeInTheDocument()
  })

  it('classifies connection failures as a warning', () => {
    render(<ErrorCard message="The connection was reset." />)

    expect(screen.getByRole('heading', { name: 'Warning' })).toBeInTheDocument()
  })

  it('classifies reachability failures as a warning', () => {
    render(<ErrorCard message="The service is unreachable." />)

    expect(screen.getByRole('heading', { name: 'Warning' })).toBeInTheDocument()
  })

  it('renders a non-string payload without calling string methods on it', () => {
    render(<ErrorCard message={<span>Structured provider error</span>} />)

    expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument()
    expect(screen.getByText('Structured provider error')).toBeInTheDocument()
  })

  it('preserves line breaks in a string message', () => {
    const { container } = render(<ErrorCard message={'first line\nsecond line'} />)
    const message = container.querySelector('p')

    expect(message).toHaveClass('whitespace-pre-wrap')
    expect(message.textContent).toBe('first line\nsecond line')
  })

  it('does not throw when the message is missing', () => {
    render(<ErrorCard />)

    expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument()
  })
})
