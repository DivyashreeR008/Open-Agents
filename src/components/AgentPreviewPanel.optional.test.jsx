import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentPreviewPanel from './AgentPreviewPanel'

describe('AgentPreviewPanel optional input detail', () => {
  it('omits placeholder and options lines and keeps a raw provider value', () => {
    const agent = {
      name: 'Minimal Agent',
      category: 'Design',
      provider: 'local-model',
      outputType: 'code',
      description: 'Minimal details.',
      icon: 'Palette',
      systemPrompt: '',
      inputs: [{ id: 'message', label: 'Message', type: 'text' }],
    }

    const { container } = render(<AgentPreviewPanel agent={agent} />)

    expect(screen.getByText('local-model')).toBeInTheDocument()
    expect(screen.queryByText(/Placeholder:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Options:/)).not.toBeInTheDocument()
    expect(container.querySelectorAll('input, textarea, select')).toHaveLength(0)
  })
})
