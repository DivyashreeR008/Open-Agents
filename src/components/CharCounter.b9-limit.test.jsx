import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CharCounter from './CharCounter'

describe('CharCounter accessible limit warning', () => {
  it('keeps the visual count out of the accessibility tree and exposes a sentence', () => {
    render(<CharCounter value="hello" maxLength={20} />)

    expect(screen.getByText('5 / 20 characters')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('5 of 20 characters used.')).toHaveClass('sr-only')
  })

  it('announces the limit even when the caller hides the visible limit label', () => {
    render(<CharCounter value="abcde" maxLength={5} />)

    expect(screen.getByRole('status')).toHaveTextContent('Character limit reached.')
    expect(screen.getByRole('status')).toHaveClass('sr-only')
    expect(screen.queryByText('Limit reached')).not.toBeInTheDocument()
  })

  it('shows and announces the limit label when the counter opts in', () => {
    render(<CharCounter value="abcde" maxLength={5} showLimit />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Limit reached')
    expect(status).not.toHaveClass('sr-only')
  })

  it('leaves the live region empty below the limit', () => {
    render(<CharCounter value="abc" maxLength={5} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
