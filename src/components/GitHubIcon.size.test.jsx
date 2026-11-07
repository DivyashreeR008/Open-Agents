import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import GitHubIcon from './GitHubIcon'

describe('GitHubIcon sizing', () => {
  it('uses the documented default size and scales both dimensions together', () => {
    const { container, rerender } = render(<GitHubIcon />)
    let svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')

    rerender(<GitHubIcon size={36} />)
    svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '36')
    expect(svg).toHaveAttribute('height', '36')
  })
})
