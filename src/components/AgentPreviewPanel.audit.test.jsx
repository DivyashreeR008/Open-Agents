import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import AgentPreviewPanel from './AgentPreviewPanel'

const completeAgent = {
  name: 'Release Planner',
  category: 'Engineering',
  provider: 'openrouter',
  outputType: 'markdown',
  description: 'Plans a release.',
  icon: 'GitBranch',
  systemPrompt: 'Plan every release carefully.',
  inputs: [
    {
      id: 'goal',
      label: 'Goal',
      type: 'select',
      required: true,
      placeholder: 'Ship it',
      options: ['minor', 'major'],
    },
    { id: 'notes', label: 'Notes', type: 'text' },
  ],
}

describe('AgentPreviewPanel disclosure and fallbacks', () => {
  it('exposes disclosure state and keeps the full prompt until expanded', () => {
    const { container } = render(<AgentPreviewPanel agent={completeAgent} />)
    const button = screen.getByRole('button', { name: /System Prompt/ })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls')
    expect(screen.queryByText('Plan every release carefully.')).not.toBeInTheDocument()

    fireEvent.click(button)

    const region = screen.getByRole('region', { name: 'System Prompt' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-controls', region.id)
    expect(region).toHaveAttribute('aria-labelledby', button.id)
    expect(within(region).getByText('Plan every release carefully.').tagName).toBe('PRE')

    for (const svg of container.querySelectorAll('svg')) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    }

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region', { name: 'System Prompt' })).not.toBeInTheDocument()
  })

  it('keeps optional input metadata out and labels required fields for assistive technology', () => {
    render(<AgentPreviewPanel agent={completeAgent} />)

    expect(screen.getAllByText('Required field')).toHaveLength(1)
    expect(screen.getByText('Goal')).toBeInTheDocument()
    expect(screen.getByText('Placeholder: "Ship it"')).toBeInTheDocument()
    expect(screen.getByText('Options: minor, major')).toBeInTheDocument()
    expect(screen.getAllByText(/Placeholder:/)).toHaveLength(1)
  })

  it('provides readable fallbacks for a minimal agent with no metadata or inputs', () => {
    render(<AgentPreviewPanel agent={{ icon: 'Bot', systemPrompt: '   ' }} />)

    expect(screen.getByRole('heading', { name: 'Untitled agent' })).toBeInTheDocument()
    expect(screen.getByText('Uncategorized')).toBeInTheDocument()
    expect(screen.getByText('Unknown provider')).toBeInTheDocument()
    expect(screen.getByText('Unknown output')).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.getByText('No input fields defined.')).toBeInTheDocument()
    expect(screen.queryByText('Required field')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /System Prompt/ }))

    const region = screen.getByRole('region', { name: 'System Prompt' })
    expect(
      within(region).getByText('No system prompt provided for this agent.')
    ).toBeInTheDocument()
    expect(region.querySelector('pre')).toBeNull()
  })

  it('shows unknown labels when an input omits its type, label, or placeholder', () => {
    render(
      <AgentPreviewPanel
        agent={{
          name: 'Input Fallbacks',
          inputs: [{ id: 'field', required: false, placeholder: '' }],
          systemPrompt: '',
        }}
      />
    )

    expect(screen.getByText('Untitled field')).toBeInTheDocument()
    expect(screen.getByText('Unknown type')).toBeInTheDocument()
    expect(screen.queryByText(/Placeholder:/)).not.toBeInTheDocument()
  })

  it('renders a long system prompt in full without truncation', () => {
    const longPrompt = Array.from(
      { length: 80 },
      (_, index) => `Instruction ${index + 1}: preserve every line of context.`
    ).join('\n')
    render(<AgentPreviewPanel agent={{ ...completeAgent, systemPrompt: longPrompt }} />)

    fireEvent.click(screen.getByRole('button', { name: /System Prompt/ }))

    const region = screen.getByRole('region', { name: 'System Prompt' })
    expect(region.querySelector('pre').textContent).toBe(longPrompt)
    expect(region.querySelector('pre').textContent.length).toBe(longPrompt.length)
  })
})
