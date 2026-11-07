import { fireEvent, render, screen } from '@testing-library/react'
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
  inputs: [{ id: 'text', label: 'Text', type: 'textarea', required: true }],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('BatchModeRunner file selection', () => {
  it('ignores an empty picker result and reads a plain text file without CSV controls', async () => {
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

    const upload = screen.getByLabelText('Upload a CSV or text file of batch items')
    fireEvent.change(upload, { target: { files: [] } })
    expect(screen.queryByText(/items? detected/)).not.toBeInTheDocument()

    await user.upload(
      upload,
      new File(['first line\n\nsecond line\n'], 'items.txt', { type: 'text/plain' })
    )

    expect(await screen.findByText('2 items detected')).toBeInTheDocument()
    expect(
      screen.queryByRole('checkbox', { name: /First row is a header/i })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(2\)/ })).toBeEnabled()
  })
})
