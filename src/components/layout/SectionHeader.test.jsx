import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionHeader from './SectionHeader'

describe('SectionHeader', () => {
  it('renders a level-two title and the supplied action', () => {
    render(
      <SectionHeader
        title="Featured agents"
        count={12}
        action={<button type="button">Sort</button>}
      />
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Featured agents' })).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument()
  })

  it('omits the count node when the count is not supplied', () => {
    const { container } = render(<SectionHeader title="Agents" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Agents' })).toBeInTheDocument()
    expect(container.querySelector('.font-mono')).toBeNull()
  })

  it('renders a zero count instead of treating it as missing', () => {
    render(<SectionHeader title="Results" count={0} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('appends a custom class without dropping the layout classes', () => {
    const { container } = render(<SectionHeader title="Agents" className="mt-6" />)

    expect(container.firstChild.className).toContain('mt-6')
    expect(container.firstChild.className).toContain('mb-3')
    expect(container.firstChild.className).toContain('flex')
  })

  it('renders without an action wrapper when no action is supplied', () => {
    render(<SectionHeader title="Agents" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
