import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'max-agent',
  name: 'Max Agent',
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

describe('BatchModeRunner batch size limit', () => {
  it('disables the run above 25 items and enables it at the limit', () => {
    renderRunner()
    const input = screen.getByLabelText('Batch items, one per line')

    fireEvent.change(input, {
      target: { value: Array.from({ length: 26 }, (_, i) => `item ${i}`).join('\n') },
    })
    expect(screen.getByText('26 items detected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(26\)/ })).toBeDisabled()

    fireEvent.change(input, {
      target: { value: Array.from({ length: 25 }, (_, i) => `item ${i}`).join('\n') },
    })
    expect(screen.getByText('25 items detected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(25\)/ })).toBeEnabled()
  })

  it('labels a single item without a plural suffix', () => {
    renderRunner()
    fireEvent.change(screen.getByLabelText('Batch items, one per line'), {
      target: { value: 'only one' },
    })
    expect(screen.getByText('1 item detected')).toBeInTheDocument()
  })
})
