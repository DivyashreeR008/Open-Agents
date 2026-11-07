import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const service = vi.hoisted(() => ({
  createAutomation: vi.fn(),
  updateAutomation: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useApiKey', () => ({ useApiKey: () => ({ apiKey: '' }) }))
vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  createAutomation: service.createAutomation,
  updateAutomation: service.updateAutomation,
}))

import CreateAutomationModal from './CreateAutomationModal'

const agent = {
  id: 'a1',
  name: 'Summarizer',
  category: 'Writing',
  provider: 'openai',
  systemPrompt: '',
  inputs: [],
}

describe('CreateAutomationModal validation edge cases', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <CreateAutomationModal isOpen={false} onClose={() => {}} preselectedAgent={agent} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('rejects a missing key before it touches the automation service', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Daily digest' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    expect(
      screen.getByText('An API key is required to run background automations.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })

  it('requires a recipient address while email reports are enabled', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Daily digest' },
    })
    fireEvent.change(screen.getByLabelText('openai API key'), {
      target: { value: 'sk-test' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    expect(
      screen.getByText('Please enter a recipient email for execution reports.')
    ).toBeInTheDocument()
    expect(service.createAutomation).not.toHaveBeenCalled()
  })
})
