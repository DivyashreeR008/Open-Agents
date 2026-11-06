import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const writeText = vi.fn(() => Promise.resolve())

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
})

const copied = async (name) => {
  fireEvent.click(screen.getByRole('button', { name }))
  await Promise.resolve()
  return writeText.mock.calls[0][0]
}

describe('OutputRenderer Copy as Plain Text', () => {
  it('keeps snake_case, C# and multiplication in markdown output', async () => {
    const md =
      '## Review\n\nKeep max_retry_count and user_id_list. In C# it is async. Total = 2 * 3 * 4.\n\n---\n\nDone.'
    render(<OutputRenderer content={md} outputType="markdown" agentName="t" />)

    expect(await copied(/Copy as Plain Text/i)).toBe(
      'Review\n\nKeep max_retry_count and user_id_list. In C# it is async. Total = 2 * 3 * 4.\n\nDone.'
    )
  })

  it('copies non-markdown output unchanged', async () => {
    const text = 'user_id: a_b_c\n# comment\n--- keep ---\n* star *'
    render(<OutputRenderer content={text} outputType="text" agentName="t" />)

    expect(await copied(/Copy as Plain Text/i)).toBe(text)
  })

  it('copies json output as valid json', async () => {
    const obj = { user_id: 'a_b_c', note: '2 * 3' }
    render(<OutputRenderer content={JSON.stringify(obj)} outputType="json" agentName="t" />)

    expect(JSON.parse(await copied(/Copy as Plain Text/i))).toEqual(obj)
  })
})

describe('OutputRenderer scrollable code regions', () => {
  it('exposes fenced code blocks as named, focusable scroll containers', () => {
    const md = '```js\nconst retryCount = 3\nconst userIdList = [1, 2, 3]\n```'
    render(<OutputRenderer content={md} outputType="markdown" agentName="t" />)

    const region = screen.getByRole('region', { name: 'js code block, scrollable' })
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveClass('overflow-x-auto')
    expect(region).toHaveTextContent('const retryCount = 3')

    region.focus()
    expect(region).toHaveFocus()
  })

  it('keeps inline code out of the region landmarks', () => {
    render(
      <OutputRenderer content="Use `retryCount` in the loop." outputType="markdown" agentName="t" />
    )

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByText('retryCount')).toBeInTheDocument()
  })
})
