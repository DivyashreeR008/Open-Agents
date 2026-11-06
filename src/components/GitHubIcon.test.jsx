import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import GitHubIcon from './GitHubIcon'

describe('GitHubIcon', () => {
  it('hides the SVG from assistive technology when it has no title', () => {
    const { container } = render(<GitHubIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('exposes an image role and accessible name when a title is supplied', () => {
    render(<GitHubIcon title="Project repository" />)

    const image = screen.getByRole('img', { name: 'Project repository' })
    expect(image.querySelector('title').textContent).toBe('Project repository')
    expect(image).not.toHaveAttribute('aria-hidden')
  })

  it('sets both dimensions from the size prop', () => {
    const { container } = render(<GitHubIcon size={32} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
  })

  it('forwards a class name and additional SVG attributes', () => {
    const { container } = render(
      <GitHubIcon className="text-zinc-500" data-testid="brand-mark" />
    )
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('text-zinc-500')
    expect(svg).toHaveAttribute('data-testid', 'brand-mark')
  })

  it('treats an empty title as decorative', () => {
    const { container } = render(<GitHubIcon title="" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.querySelector('title')).toBeNull()
  })
})
