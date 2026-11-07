import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import GitHubIcon from './GitHubIcon'

describe('GitHubIcon accessible naming', () => {
  it('becomes a named image when a title is supplied', () => {
    render(<GitHubIcon title="GitHub repository" />)

    const icon = screen.getByRole('img', { name: 'GitHub repository' })
    expect(icon).toHaveAttribute('focusable', 'false')
    expect(icon.querySelector('title')).toHaveTextContent('GitHub repository')
  })

  it('stays decorative when no title is supplied', () => {
    const { container } = render(<GitHubIcon />)
    const icon = container.querySelector('svg')

    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).not.toHaveAttribute('role')
    expect(icon.querySelector('title')).toBeNull()
  })
})
