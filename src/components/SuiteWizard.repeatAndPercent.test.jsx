import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AgentsContext } from '../lib/useAgents'
import SuiteWizard from './SuiteWizard'

const suite = {
  id: 'custom-suite',
  name: 'Custom Suite',
  icon: 'Code2',
  color: '#111111',
  agents: ['agent-a', 'agent-b'],
  quiz: {
    questions: [
      { id: 'q1', question: 'Choose a stack', options: [{ label: 'React', tags: ['agent-a'] }] },
      { id: 'q2', question: 'Choose a level', options: [{ label: 'Senior', tags: ['agent-a'] }] },
      { id: 'q3', question: 'Choose a goal', options: [{ label: 'Ship', tags: ['agent-b'] }] },
    ],
  },
}

const agents = [
  { id: 'agent-a', name: 'Agent A', description: 'First agent', category: 'Engineering' },
  { id: 'agent-b', name: 'Agent B', description: 'Second agent', category: 'Engineering' },
]

function renderWizard() {
  return render(
    <MemoryRouter initialEntries={['/suites']}>
      <AgentsContext.Provider
        value={{
          agents,
          loading: false,
          error: null,
          reloadAgents: vi.fn(),
          catalogSize: agents.length,
        }}
      >
        <SuiteWizard suite={suite} onBack={vi.fn()} />
      </AgentsContext.Provider>
    </MemoryRouter>
  )
}

function answer(label) {
  fireEvent.click(screen.getByText(label))
  fireEvent.click(screen.getByRole('button', { name: /Next/ }))
}

describe('SuiteWizard repeated Enter and mid-range match badges', () => {
  it('ignores a held Enter key repeat on the selected option', () => {
    renderWizard()
    fireEvent.click(screen.getByText('React'))

    const selected = screen.getByText('React').closest('button')
    selected.focus()
    fireEvent.keyDown(window, { key: 'Enter', repeat: true })

    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(screen.getByText('Question 2 of 3')).toBeInTheDocument()
  })

  it('shows a 60-79 percent badge for an agent tagged by two of three answers', () => {
    renderWizard()
    answer('React')
    answer('Senior')
    answer('Ship')

    expect(screen.getByText('67%').className).toContain('bg-zinc-100')
    expect(screen.getByText('33%').className).toContain('bg-gray-100')
  })
})
