import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'

describe('PageHeader', () => {
  it('renders a banner landmark and a level-one title', () => {
    render(<PageHeader title="Agent catalogue" />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Agent catalogue' })
    ).toBeInTheDocument()
  })

  it('renders an eyebrow only when one is supplied', () => {
    const { rerender } = render(<PageHeader title="Agents" />)
    expect(screen.queryByText('Workspace')).not.toBeInTheDocument()

    rerender(<PageHeader eyebrow="Workspace" title="Agents" />)
    expect(screen.getByText('Workspace')).toBeInTheDocument()
  })

  it('keeps a zero metadata value and omits a null one', () => {
    const { container, rerender } = render(<PageHeader title="Agents" meta={0} />)
    expect(container.querySelector('.font-mono').textContent).toBe('0')

    rerender(<PageHeader title="Agents" meta={null} />)
    expect(container.querySelector('.font-mono')).toBeNull()
  })

  it('renders the description beside the metadata', () => {
    const { container } = render(
      <PageHeader title="Agents" meta={12} description="Available definitions" />
    )
    const paragraph = container.querySelector('p')

    expect(paragraph).toHaveTextContent('12')
    expect(paragraph).toHaveTextContent('Available definitions')
  })

  it('renders children inside the title block', () => {
    render(
      <PageHeader title="Agents">
        <span>Filtered by category</span>
      </PageHeader>
    )

    expect(screen.getByText('Filtered by category')).toBeInTheDocument()
  })

  it('renders actions in their own cluster only when supplied', () => {
    const { container, rerender } = render(<PageHeader title="Agents" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(
      <PageHeader title="Agents" actions={<button type="button">New collection</button>} />
    )

    const header = screen.getByRole('banner')
    const actionCluster = header.lastElementChild
    expect(actionCluster).toContainElement(
      screen.getByRole('button', { name: 'New collection' })
    )
    expect(container.querySelector('header')).toBe(header)
  })
})
