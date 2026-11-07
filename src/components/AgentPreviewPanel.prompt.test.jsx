import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AgentPreviewPanel from './AgentPreviewPanel'

const agent = {
  name: 'Prompt Agent',
  category: 'Engineering',
  provider: 'anthropic',
  outputType: 'text',
  description: 'Shows a prompt.',
  icon: 'Bot',
  systemPrompt: 'You are a careful reviewer.',
  inputs: [],
}

describe('AgentPreviewPanel system prompt disclosure', () => {
  it('keeps the prompt collapsed until the disclosure button is used', () => {
    const { container } = render(<AgentPreviewPanel agent={agent} />)

    expect(screen.queryByText('You are a careful reviewer.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /System Prompt/ }))

    const prompt = screen.getByText('You are a careful reviewer.')
    expect(prompt.tagName).toBe('PRE')
    expect(container.querySelector('svg')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /System Prompt/ }))
    expect(screen.queryByText('You are a careful reviewer.')).not.toBeInTheDocument()
  })
})
