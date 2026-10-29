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
    const md = '## Review\n\nKeep max_retry_count and user_id_list. In C# it is async. Total = 2 * 3 * 4.\n\n---\n\nDone.'
    render(<OutputRenderer content={md} outputType="markdown" agentName="t" />)

    expect(await copied(/Copy as Plain Text/i)).toBe(
      'Review\n\nKeep max_retry_count and user_id_list. In C# it is async. Total = 2 * 3 * 4.\n\nDone.',
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
