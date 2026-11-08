import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'fixed-agent',
  name: 'Fixed Agent',
  inputs: [
    { id: 'body', label: 'Body', type: 'textarea', required: true },
    { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'shared notes' },
    { id: 'tone', label: 'Tone', type: 'select', required: true },
    { id: 'tags', label: 'Tags', type: 'multiselect', options: ['A', 'B'], defaultValue: ['A'] },
  ],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner fixed field defaults', () => {
  it('shows fixed textareas, empty selects, and default multiselect values', () => {
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    expect(screen.getByLabelText('Notes')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'shared context' } })
    expect(screen.getByLabelText('Notes')).toHaveValue('shared context')

    expect(screen.getByRole('button', { name: 'Tone' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '✓ A' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '✓ A' }))
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(screen.getByRole('button', { name: '✓ A' })).toBeInTheDocument()
  })

  it('keeps the run disabled while a required fixed field is empty', () => {
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
    expect(screen.getByRole('button', { name: /Run Batch \(2\)/ })).toBeDisabled()
  })
})
