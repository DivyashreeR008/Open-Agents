import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Inbox } from 'lucide-react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders a level-three title and the guidance text', () => {
    render(<EmptyState title="No agents yet" description="Add a definition to get started." />)

    expect(screen.getByRole('heading', { level: 3, name: 'No agents yet' })).toBeInTheDocument()
    expect(screen.getByText('Add a definition to get started.')).toBeInTheDocument()
  })

  it('renders a decorative icon at the documented size', () => {
    const { container } = render(<EmptyState icon={Inbox} title="No agents yet" />)
    const icon = container.querySelector('svg')

    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('width', '20')
    expect(icon).toHaveAttribute('height', '20')
    expect(icon).toHaveClass('mb-3')
  })

  it('omits the icon and description when they are not supplied', () => {
    const { container } = render(<EmptyState title="Nothing here" />)

    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('p')).toBeNull()
  })

  it('renders an action in its wrapper', () => {
    render(<EmptyState title="No runs" action={<button type="button">Start a run</button>} />)

    const action = screen.getByRole('button', { name: 'Start a run' })
    expect(action.parentElement).toHaveClass('mt-4')
  })

  it('appends the custom class without dropping the panel treatment', () => {
    const { container } = render(<EmptyState title="Nothing here" className="col-span-2" />)
    const panel = container.firstChild

    expect(panel.className).toContain('col-span-2')
    expect(panel.className).toContain('border-dashed')
    expect(panel.className).toContain('py-16')
  })
})
