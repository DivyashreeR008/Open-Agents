import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import HighlightedText from './HighlightedText'

describe('HighlightedText', () => {
  it('returns plain text when there is no query', () => {
    const { container } = render(<HighlightedText text="Alpha Agent" query="" />)

    expect(container).toHaveTextContent('Alpha Agent')
    expect(container.querySelector('mark')).toBeNull()
  })

  it('marks every case-insensitive occurrence and preserves the original casing', () => {
    const { container } = render(<HighlightedText text="Agent agent AGENT" query="agent" />)
    const marks = [...container.querySelectorAll('mark')]

    expect(marks.map((mark) => mark.textContent)).toEqual(['Agent', 'agent', 'AGENT'])
  })

  it('treats regular-expression characters as literal text', () => {
    const { container } = render(<HighlightedText text="C++ Helper and C++ Tools" query="C++" />)
    const marks = [...container.querySelectorAll('mark')]

    expect(marks.map((mark) => mark.textContent)).toEqual(['C++', 'C++'])
  })

  it('does not alter text when the query is absent', () => {
    const { container } = render(<HighlightedText text="Alpha Agent" query="missing" />)

    expect(container).toHaveTextContent('Alpha Agent')
    expect(container.querySelector('mark')).toBeNull()
  })
})
