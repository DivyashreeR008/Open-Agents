import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'empty-header-agent',
  name: 'Empty Header Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner CSV column labels', () => {
  it('numbers an empty header cell instead of rendering a blank option', async () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    const file = new File([',Detail\nAlice,Alpha\nBob,Beta'], 'items.csv', { type: 'text/csv' })
    fireEvent.change(screen.getByLabelText('Upload a CSV or text file of batch items'), {
      target: { files: [file] },
    })

    await waitFor(() => expect(screen.getByText('2 items detected')).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('First row is a header (not a data item)'))
    fireEvent.click(screen.getByRole('button', { name: 'CSV column to use' }))

    expect(screen.getByRole('option', { name: 'Column 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Detail' })).toBeInTheDocument()
  })
})
