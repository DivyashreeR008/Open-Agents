import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'csv-agent',
  name: 'CSV Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
})

function renderRunner() {
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

function uploadCsv(text) {
  const file = new File([text], 'items.csv', { type: 'text/csv' })
  fireEvent.change(screen.getByLabelText('Upload a CSV or text file of batch items'), {
    target: { files: [file] },
  })
}

describe('BatchModeRunner CSV header and column selection', () => {
  it('treats the first row as data by default and switches it to a header', async () => {
    renderRunner()
    uploadCsv('Name,Detail\nAlice,Alpha\nBob,Beta')

    await waitFor(() => {
      expect(screen.getByText('3 items detected')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('First row is a header (not a data item)'))

    await waitFor(() => {
      expect(screen.getByText('2 items detected')).toBeInTheDocument()
    })
    expect(screen.getByText('2 rows will be used as batch items.')).toBeInTheDocument()
  })

  it('uses header labels and switches the selected column', async () => {
    renderRunner()
    uploadCsv('Name,Detail\nAlice,Alpha\nBob,Beta')

    await waitFor(() => {
      expect(screen.getByText('3 items detected')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByLabelText('First row is a header (not a data item)'))

    const columnTrigger = screen.getByRole('button', { name: 'CSV column to use' })
    fireEvent.click(columnTrigger)
    expect(screen.getByRole('option', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Detail' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Detail' }))

    await waitFor(() => {
      expect(screen.getByText('2 items detected')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Batch items, one per line')).toHaveValue('')
  })

  it('falls back to numbered column labels when the first row is data', async () => {
    renderRunner()
    uploadCsv('Alice,Alpha\nBob,Beta')

    await waitFor(() => {
      expect(screen.getByText('2 items detected')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'CSV column to use' }))
    expect(screen.getByRole('option', { name: 'Column 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Column 2' })).toBeInTheDocument()
  })
})
