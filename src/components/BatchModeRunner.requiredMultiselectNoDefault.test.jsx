import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'multiselect-default-agent',
  name: 'Multiselect Default Agent',
  inputs: [
    { id: 'text', label: 'Text', type: 'text', required: true },
    {
      id: 'tags',
      label: 'Tags',
      type: 'multiselect',
      required: true,
      options: ['A', 'B'],
    },
  ],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner required multiselect without a default', () => {
  it('starts with no selected options and blocks the run until one is chosen', () => {
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
      target: { value: 'first' },
    })

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(1\)/ })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'A' }))

    expect(screen.getByRole('button', { name: '✓ A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(1\)/ })).toBeEnabled()
  })
})
