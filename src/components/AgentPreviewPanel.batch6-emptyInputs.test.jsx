import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentPreviewPanel from './AgentPreviewPanel'

describe('AgentPreviewPanel without inputs', () => {
  it('renders the empty input section and keeps the prompt disclosure', () => {
    render(
      <AgentPreviewPanel
        agent={{
          name: 'Empty Agent',
          category: 'Engineering',
          provider: 'openai',
          outputType: 'markdown',
          description: 'No fields yet.',
          icon: 'Bot',
          inputs: [],
          systemPrompt: 'Stay empty.',
        }}
      />
    )

    expect(screen.getByRole('heading', { name: 'Input Fields' })).toBeInTheDocument()
    expect(screen.queryByText(/Placeholder:/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /System Prompt/ })).toBeInTheDocument()
  })
})
