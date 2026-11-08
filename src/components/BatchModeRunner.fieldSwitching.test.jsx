import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BatchModeRunner from './BatchModeRunner'
import { runBatch } from '../lib/batchRunner'

vi.mock('../lib/batchRunner', async () => {
  const actual = await vi.importActual('../lib/batchRunner')
  return { ...actual, runBatch: vi.fn() }
})

const agent = {
  id: 'mixed-agent',
  name: 'Mixed Agent',
  inputs: [
    { id: 'prompt', label: 'Prompt', type: 'text', required: true },
    { id: 'code', label: 'Code', type: 'code', required: true },
    { id: 'notes', label: 'Notes', type: 'textarea', required: false },
    {
      id: 'style',
      label: 'Style',
      type: 'select',
      required: false,
      options: [
        { value: 'slow', label: 'Slow' },
        { value: 'fast', label: 'Fast' },
      ],
    },
    { id: 'tags', label: 'Tags', type: 'multiselect', required: false, options: ['A', 'B'] },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  runBatch.mockResolvedValue(undefined)
})

describe('BatchModeRunner fixed-field resolution', () => {
  it('switches the varying field and sends select, multiselect, and blank defaults', async () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Field that varies per item' }))
    fireEvent.click(screen.getByRole('option', { name: 'Code' }))

    fireEvent.change(screen.getByLabelText('Prompt'), {
      target: { value: 'Explain this function' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Style' }))
    fireEvent.click(screen.getByRole('option', { name: 'Fast' }))
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    fireEvent.change(screen.getByLabelText('Batch items, one per line'), {
      target: { value: 'const a = 1\nconst b = 2' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(2\)/ }))

    await waitFor(() => expect(runBatch).toHaveBeenCalledTimes(1))
    expect(runBatch.mock.calls[0][0]).toMatchObject({
      items: ['const a = 1', 'const b = 2'],
      batchFieldId: 'code',
      fixedInputs: {
        prompt: 'Explain this function',
        notes: '',
        style: 'fast',
        tags: ['B'],
      },
    })
  })
})
