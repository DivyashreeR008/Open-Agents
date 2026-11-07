import { act, fireEvent, render, screen } from '@testing-library/react'
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

describe('BatchModeRunner live item states', () => {
  it('shows one running item beside a waiting sibling until the batch settles', async () => {
    let finish
    runBatch.mockImplementation(
      ({ onItemUpdate }) =>
        new Promise((resolve) => {
          onItemUpdate(0, { status: 'running' })
          finish = () => {
            onItemUpdate(0, { status: 'done', output: 'first output' })
            onItemUpdate(1, { status: 'done', output: 'second output' })
            resolve()
          }
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
      target: { value: 'first\nsecond' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(2\)/ }))

    expect(await screen.findByText('running')).toBeInTheDocument()
    expect(screen.getByText('waiting')).toBeInTheDocument()
    expect(screen.getByText('0 of 2 complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Stop/ })).toBeInTheDocument()

    await act(async () => {
      finish()
    })

    expect(await screen.findByText('2 of 2 complete')).toBeInTheDocument()
    expect(screen.getAllByText('done')).toHaveLength(2)
    expect(screen.queryByText('running')).not.toBeInTheDocument()
    expect(screen.queryByText('waiting')).not.toBeInTheDocument()
  })
})
