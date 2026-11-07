import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BatchModeRunner from './BatchModeRunner'
import { runBatch } from '../lib/batchRunner'
import { exportBatchAsCSV, exportBatchAsMarkdown } from '../lib/exportBatch'

vi.mock('../lib/batchRunner', async () => {
  const actual = await vi.importActual('../lib/batchRunner')
  return { ...actual, runBatch: vi.fn() }
})

vi.mock('../lib/exportBatch', () => ({
  exportBatchAsCSV: vi.fn(),
  exportBatchAsMarkdown: vi.fn(),
}))

const simpleAgent = {
  id: 'batch-agent',
  name: 'Batch Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

function renderRunner(agent = simpleAgent) {
  return render(
    <BatchModeRunner
      agent={agent}
      provider="openai"
      apiKey="test-key"
      selectedModel="gpt-4o"
      systemPrompt=""
    />
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  runBatch.mockImplementation(async ({ items, onItemUpdate }) => {
    items.forEach((_, index) => {
      onItemUpdate(index, { status: 'done', output: `output ${index + 1}` })
    })
  })
})

describe('BatchModeRunner CSV and fixed-field policy', () => {
  it('keeps the first CSV row by default and recomputes items when header and column change', async () => {
    const user = userEvent.setup()
    renderRunner({
      id: 'csv-agent',
      name: 'CSV Agent',
      inputs: [{ id: 'text', label: 'Text', type: 'textarea', required: true }],
    })

    const file = new File(['name,notes\nAlice,first\nBob,second\n'], 'items.csv', {
      type: 'text/csv',
    })
    await user.upload(screen.getByLabelText('Upload a CSV or text file of batch items'), file)

    expect(await screen.findByText('3 items detected')).toBeInTheDocument()
    expect(screen.getByText('3 rows will be used as batch items.')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /First row is a header/i })).not.toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: /First row is a header/i }))
    expect(await screen.findByText('2 rows will be used as batch items.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'CSV column to use' }))
    await user.click(screen.getByRole('option', { name: 'notes' }))

    const runButton = await screen.findByRole('button', { name: /Run Batch \(2\)/ })
    expect(runButton).toBeEnabled()
    await user.click(runButton)

    await waitFor(() => expect(runBatch).toHaveBeenCalledTimes(1))
    expect(runBatch.mock.calls[0][0]).toMatchObject({
      items: ['first', 'second'],
      batchFieldId: 'text',
    })
  })

  it('blocks runs above the item cap or while a required shared field is empty', async () => {
    const agent = {
      id: 'fixed-fields-agent',
      name: 'Fixed Fields Agent',
      inputs: [
        { id: 'topic', label: 'Topic', type: 'textarea', required: true },
        {
          id: 'tone',
          label: 'Tone',
          type: 'select',
          required: true,
          defaultValue: 'formal',
          options: [
            { value: 'formal', label: 'Formal' },
            { value: 'casual', label: 'Casual' },
          ],
        },
        { id: 'audience', label: 'Audience', type: 'text', required: true },
        {
          id: 'tags',
          label: 'Tags',
          type: 'multiselect',
          required: true,
          defaultValue: ['A'],
          options: ['A', 'B'],
        },
      ],
    }
    renderRunner(agent)

    const batchInput = screen.getByLabelText('Batch items, one per line')
    const audience = screen.getByLabelText('Audience')

    fireEvent.change(batchInput, { target: { value: 'one' } })
    expect(screen.getByRole('button', { name: /Run Batch \(1\)/ })).toBeDisabled()

    fireEvent.change(audience, { target: { value: 'Newsroom' } })
    expect(screen.getByRole('button', { name: /Run Batch \(1\)/ })).toBeEnabled()

    const tooMany = Array.from({ length: 26 }, (_, index) => `item ${index + 1}`).join('\n')
    fireEvent.change(batchInput, { target: { value: tooMany } })
    expect(screen.getByRole('button', { name: /Run Batch \(26\)/ })).toBeDisabled()

    fireEvent.change(batchInput, { target: { value: 'single item' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(1\)/ }))

    await waitFor(() => expect(runBatch).toHaveBeenCalledTimes(1))
    expect(runBatch.mock.calls[0][0].fixedInputs).toEqual({
      tone: 'formal',
      audience: 'Newsroom',
      tags: ['A'],
    })
  })
})

describe('BatchModeRunner failure and cancellation states', () => {
  it('shows per-item failures and only offers exports when every item settles', async () => {
    runBatch.mockImplementation(async ({ onItemUpdate }) => {
      onItemUpdate(0, { status: 'done', output: 'finished output' })
      onItemUpdate(1, { status: 'failed', error: 'Rate limited by provider' })
    })
    renderRunner()

    fireEvent.change(screen.getByLabelText('Batch items, one per line'), {
      target: { value: 'first\nsecond' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(2\)/ }))

    expect(await screen.findByText('Rate limited by provider')).toBeInTheDocument()
    expect(screen.getByText('2 of 2 complete')).toBeInTheDocument()
    expect(screen.getAllByRole('region')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: /Export CSV/ }))
    fireEvent.click(screen.getByRole('button', { name: /Export Markdown/ }))
    expect(exportBatchAsCSV).toHaveBeenCalledWith('Batch Agent', expect.any(Array))
    expect(exportBatchAsMarkdown).toHaveBeenCalledWith('Batch Agent', expect.any(Array))
  })

  it('aborts the active batch and restores the editor when Stop is pressed', async () => {
    let captured
    runBatch.mockImplementation(
      ({ signal }) =>
        new Promise((resolve) => {
          captured = { signal, resolve }
        })
    )
    renderRunner()

    const batchInput = screen.getByLabelText('Batch items, one per line')
    fireEvent.change(batchInput, { target: { value: 'first\nsecond' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Batch \(2\)/ }))

    expect(batchInput).toBeDisabled()
    expect(screen.getByRole('button', { name: /Upload/ })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /Stop/ }))
    expect(captured.signal.aborted).toBe(true)
    expect(batchInput).toBeEnabled()
    expect(screen.getByRole('button', { name: /Run Batch \(2\)/ })).toBeInTheDocument()

    await act(async () => {
      captured.resolve()
    })
  })
})
