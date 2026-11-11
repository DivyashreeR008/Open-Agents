import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CharCounter from './CharCounter'

describe('CharCounter', () => {
  it('renders the documented defaults for an empty value', () => {
    render(<CharCounter />)

    expect(screen.getByText('0 / 5000 characters')).toBeInTheDocument()
    expect(screen.getByText('0 / 5000 characters').tagName).toBe('P')
  })

  it('counts the exact supplied value against the supplied maximum', () => {
    render(<CharCounter value={'hello\nworld'} maxLength={20} />)

    expect(screen.getByText('11 / 20 characters')).toBeInTheDocument()
  })

  it('counts spaces rather than trimming the value', () => {
    render(<CharCounter value="  three  " maxLength={9} />)

    expect(screen.getByText('9 / 9 characters')).toBeInTheDocument()
  })

  it('respects an explicit zero maximum', () => {
    render(<CharCounter value="abc" maxLength={0} />)

    expect(screen.getByText('3 / 0 characters')).toBeInTheDocument()
  })

  it('renders a longer value without truncating the count', () => {
    render(<CharCounter value={'x'.repeat(10)} maxLength={5} />)

    expect(screen.getByText('10 / 5 characters')).toBeInTheDocument()
  })

  it('announces the limit only when the counter opts in and the value reaches it', () => {
    const { rerender } = render(<CharCounter value="abc" maxLength={5} showLimit />)
    expect(screen.queryByText('Limit reached')).not.toBeInTheDocument()

    rerender(<CharCounter value="abcde" maxLength={5} showLimit />)
    expect(screen.getByText(/5 \/ 5 characters/)).toBeInTheDocument()
    expect(screen.getByText('Limit reached')).toBeInTheDocument()
  })
})
