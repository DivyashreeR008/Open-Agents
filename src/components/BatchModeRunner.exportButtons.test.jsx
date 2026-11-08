import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  id: 'export-agent',
  name: 'Export Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
  runner.runBatch.mockReset()
  exporter.exportBatchAsCSV.mockReset()
  exporter.exportBatchAsMarkdown.mockReset()
  runner.runBatch.mockImplementation(async ({ items, onItemUpdate }) => {
    items.forEach((item, index) => {
      onItemUpdate(index, { status: 'done', output: `output ${item}` })
    })
  })
})

describe('BatchModeRunner export actions', () => {
  it('offers both export formats once every item finishes', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('2 of 2 complete')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }))
    expect(exporter.exportBatchAsCSV).toHaveBeenCalledWith(
      'Export Agent',
      expect.arrayContaining([expect.objectContaining({ status: 'done' })])
    )

    fireEvent.click(screen.getByRole('button', { name: /Export Markdown/i }))
    expect(exporter.exportBatchAsMarkdown).toHaveBeenCalledWith(
      'Export Agent',
      expect.arrayContaining([expect.objectContaining({ status: 'done' })])
    )
  })
})
