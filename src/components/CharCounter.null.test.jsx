import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CharCounter from './CharCounter'

describe('CharCounter null input handling', () => {
  it('renders a zero count when a cleared field supplies null', () => {
    render(<CharCounter value={null} maxLength={200} />)

    expect(screen.getByText('0 / 200 characters')).toBeInTheDocument()
  })

  it('keeps counting ordinary values after the null case', () => {
    render(<CharCounter value="abc" maxLength={10} />)

    expect(screen.getByText('3 / 10 characters')).toBeInTheDocument()
  })
})
