import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'single-row-agent',
  name: 'Single Row Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner single CSV data row', () => {
  it('uses singular wording for one row without a header', async () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    const file = new File(['Only row'], 'one-row.csv', { type: 'text/csv' })
    fireEvent.change(screen.getByLabelText('Upload a CSV or text file of batch items'), {
      target: { files: [file] },
    })

    expect(await screen.findByText('1 row will be used as batch items.')).toBeInTheDocument()
  })
})
