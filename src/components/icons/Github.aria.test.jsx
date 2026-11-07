import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import Github from './Github'

describe('local Github mark semantics', () => {
  it('stays untitled and unnamed unless the caller supplies attributes', () => {
    const { container } = render(<Github />)
    const svg = container.querySelector('svg')

    expect(svg.querySelector('title')).toBeNull()
    expect(svg).not.toHaveAttribute('role')
    expect(svg).not.toHaveAttribute('aria-label')
  })

  it('accepts caller-supplied naming attributes without changing the geometry', () => {
    const { container } = render(<Github aria-label="GitHub" role="img" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('aria-label', 'GitHub')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg.querySelectorAll('path')).toHaveLength(2)
  })
})
