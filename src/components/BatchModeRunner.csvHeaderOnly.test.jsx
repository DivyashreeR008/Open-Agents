import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'header-only-agent',
  name: 'Header Only Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner header-only CSV', () => {
  it('reports zero data rows and keeps the batch disabled', async () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    const file = new File(['Name,Detail'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(screen.getByLabelText('Upload a CSV or text file of batch items'), {
      target: { files: [file] },
    })

    await waitFor(() => expect(screen.getByText('1 item detected')).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('First row is a header (not a data item)'))

    expect(await screen.findByText('0 rows will be used as batch items.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(0\)/ })).toBeDisabled()
  })
})
