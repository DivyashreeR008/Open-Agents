import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'select-only-agent',
  name: 'Select Only Agent',
  inputs: [{ id: 'choice', label: 'Choice', type: 'select', options: ['A', 'B'] }],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner without batchable fields', () => {
  it('hides the item editor and keeps the run disabled', () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    expect(screen.getByLabelText('Batch items, one per line')).toBeInTheDocument()
    expect(screen.queryByLabelText('Field that varies per item')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Batch \(0\)/ })).toBeDisabled()
  })
})
