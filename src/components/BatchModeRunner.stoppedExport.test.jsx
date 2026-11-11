import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const runner = vi.hoisted(() => ({ runBatch: vi.fn() }))
const exporter = vi.hoisted(() => ({
  exportBatchAsCSV: vi.fn(),
  exportBatchAsMarkdown: vi.fn(),
}))

vi.mock('../lib/batchRunner', async (importOriginal) => ({
  ...(await importOriginal()),
  runBatch: runner.runBatch,
}))
vi.mock('../lib/exportBatch', () => exporter)

import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'stop-agent',
  name: 'Stop Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
  runner.runBatch.mockReset()
  exporter.exportBatchAsCSV.mockReset()
  exporter.exportBatchAsMarkdown.mockReset()
})

describe('BatchModeRunner stopped rows', () => {
  it('records unfinished rows as stopped and exports that state', async () => {
    let resolveRun
    runner.runBatch.mockImplementation(({ items, onItemUpdate }) => {
      onItemUpdate(0, { status: 'done', output: 'first output' })
      onItemUpdate(1, { status: 'running' })
      expect(items).toHaveLength(3)
      return new Promise((resolve) => {
        resolveRun = resolve
      })
    })

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

    expect(screen.getByText('running')).toBeInTheDocument()
    expect(screen.getByText('waiting')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Stop/ }))

    expect(screen.queryByText('running')).not.toBeInTheDocument()
    expect(screen.queryByText('waiting')).not.toBeInTheDocument()
    expect(screen.getAllByText('stopped')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }))
    expect(exporter.exportBatchAsCSV).toHaveBeenCalledWith('Stop Agent', [
      expect.objectContaining({ status: 'done' }),
      expect.objectContaining({ status: 'stopped' }),
      expect.objectContaining({ status: 'stopped' }),
    ])

    await act(async () => {
      resolveRun()
    })
  })
})
