import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
})

describe('BatchModeRunner cancellation recovery', () => {
  it('marks in-flight rows cancelled and retries only unfinished inputs', async () => {
    runBatch.mockImplementationOnce(
      ({ onItemUpdate, signal }) =>
        new Promise((resolve) => {
          onItemUpdate(0, { status: 'done', output: 'first output' })
          onItemUpdate(1, { status: 'running' })
          signal.addEventListener('abort', () => {
            onItemUpdate(1, { status: 'cancelled' })
            resolve()
          })
        })
    )

    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    fireEvent.change(screen.getByLabelText('Batch items, one per line'), {
      target: { value: 'first\nsecond\nthird' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(3\)/ }))

    expect(await screen.findByText('first output')).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Stop/ }))
    })

    expect(await screen.findByText('cancelled')).toBeInTheDocument()
    expect(screen.getByText('waiting')).toBeInTheDocument()
    expect(screen.getByText('Retry unfinished (2)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Export Markdown' })).toBeInTheDocument()

    let retriedItems
    runBatch.mockImplementationOnce(async ({ items, onItemUpdate }) => {
      retriedItems = items
      onItemUpdate(0, { status: 'done', output: 'second output' })
      onItemUpdate(1, { status: 'done', output: 'third output' })
    })

    fireEvent.click(screen.getByRole('button', { name: 'Retry unfinished (2)' }))

    await waitFor(() => expect(screen.getByText('3 of 3 complete')).toBeInTheDocument())
    expect(retriedItems).toEqual(['second', 'third'])
    expect(screen.getByText('first output')).toBeInTheDocument()
    expect(screen.getAllByText('done')).toHaveLength(3)
    expect(screen.queryByText('cancelled')).not.toBeInTheDocument()
    expect(screen.queryByText('waiting')).not.toBeInTheDocument()
  })
})
