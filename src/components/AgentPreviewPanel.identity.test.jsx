import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AgentPreviewPanel from './AgentPreviewPanel'

const agent = {
  name: 'Release Planner',
  category: 'Engineering',
  provider: 'openai',
  outputType: 'text',
  description: 'Plans a release.',
  icon: 'GitBranch',
  systemPrompt: 'Plan carefully.',
  inputs: [
    {
      id: 'goal',
      label: 'Goal',
      type: 'select',
      required: true,
      placeholder: 'Ship it',
      options: ['minor', 'major'],
    },
    { id: 'notes', label: 'Notes', type: 'custom' },
  ],
}

describe('AgentPreviewPanel identity and inputs', () => {
  it('renders identity labels, required markers, and input metadata', () => {
    render(<AgentPreviewPanel agent={agent} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Release Planner' })).toBeInTheDocument()
    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
    expect(screen.getByText('text')).toBeInTheDocument()
    expect(screen.getByText('Goal')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Placeholder: "Ship it"')).toBeInTheDocument()
    expect(screen.getByText('Options: minor, major')).toBeInTheDocument()
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.getByText('custom')).toBeInTheDocument()
  })
})
