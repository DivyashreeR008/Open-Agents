import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'

describe('PageHeader metadata presence', () => {
  it('does not render a metadata line for empty string metadata', () => {
    const { container } = render(<PageHeader title="Settings" meta="" description="" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
    expect(container.querySelector('p')).toBeNull()
  })

  it('still renders numeric zero metadata', () => {
    render(<PageHeader title="Runs" meta={0} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
