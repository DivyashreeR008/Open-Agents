import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BatchModeRunner from './BatchModeRunner'

const agent = {
  id: 'upload-click-agent',
  name: 'Upload Click Agent',
  inputs: [{ id: 'text', label: 'Text', type: 'text', required: true }],
}

beforeEach(() => {
  localStorage.clear()
})

describe('BatchModeRunner upload button', () => {
  it('opens the hidden file picker when the upload button is clicked', () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
    render(
      <BatchModeRunner
        agent={agent}
        provider="openai"
        apiKey="test-key"
        selectedModel="gpt-4o"
        systemPrompt=""
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Upload \.csv \/ \.txt/ }))

    expect(click).toHaveBeenCalledTimes(1)
    click.mockRestore()
  })
})
