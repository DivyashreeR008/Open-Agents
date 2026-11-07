import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

describe('SectionHeader count presence', () => {
  it('does not render an empty count chip for an empty string', () => {
    const { container } = render(<SectionHeader title="Agents" count="" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Agents' })).toBeInTheDocument()
    expect(container.querySelector('span')).toBeNull()
  })

  it('renders zero and long counts without hiding them', () => {
    const { rerender } = render(<SectionHeader title="Agents" count={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()

    rerender(<SectionHeader title="Agents" count="1,204" />)
    expect(screen.getByText('1,204')).toBeInTheDocument()
  })
})
