import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BatchModeRunner from './BatchModeRunner'
import { runBatch } from '../lib/batchRunner'

vi.mock('../lib/batchRunner', async () => {
  const actual = await vi.importActual('../lib/batchRunner')
  return { ...actual, runBatch: vi.fn() }
})

const agent = {
  id: 'batch-agent',
  name: 'Batch Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  vi.clearAllMocks()
  runBatch.mockImplementation(async ({ items, onItemUpdate }) => {
    items.forEach((_, index) => {
      onItemUpdate(index, {
        status: 'done',
        output: 'A long batch result that is taller than its container.\n'.repeat(20),
      })
    })
  })
})

describe('BatchModeRunner result regions', () => {
  it('makes each completed result a named keyboard-scrollable region', async () => {
    const user = userEvent.setup()
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    await user.type(screen.getByLabelText('Batch items, one per line'), 'first\nsecond')
    await user.click(screen.getByRole('button', { name: /Run Batch \(2\)/ }))

    const first = await screen.findByRole('region', {
      name: 'Batch result 1 output, scrollable',
    })
    const second = screen.getByRole('region', {
      name: 'Batch result 2 output, scrollable',
    })

    expect(first).toHaveAttribute('tabindex', '0')
    expect(second).toHaveAttribute('tabindex', '0')
    expect(first).toHaveClass('overflow-y-auto')

    first.focus()
    expect(first).toHaveFocus()
    second.focus()
    expect(second).toHaveFocus()
  })
})
