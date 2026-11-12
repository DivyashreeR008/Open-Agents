import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import HighlightedText from './HighlightedText'

describe('HighlightedText missing query values', () => {
  it('returns the original text for undefined and null queries', () => {
    const { container, rerender } = render(<HighlightedText text="Alpha Agent" />)
    expect(container).toHaveTextContent('Alpha Agent')
    expect(container.querySelector('mark')).toBeNull()

    rerender(<HighlightedText text="Alpha Agent" query={null} />)
    expect(container).toHaveTextContent('Alpha Agent')
    expect(container.querySelector('mark')).toBeNull()
  })

  it('trims a whitespace-only query without marking anything', () => {
    const { container } = render(<HighlightedText text="Alpha Agent" query="   " />)

    expect(container).toHaveTextContent('Alpha Agent')
    expect(container.querySelector('mark')).toBeNull()
  })
})
