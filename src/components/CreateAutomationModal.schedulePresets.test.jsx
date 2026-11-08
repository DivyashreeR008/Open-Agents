import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

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

beforeEach(() => {
  vi.clearAllMocks()
  service.createAutomation.mockResolvedValue({})
})

describe('CreateAutomationModal schedule presets', () => {
  it('saves the selected interval and missed-run policy', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Weekly digest' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Every week/ }))
    fireEvent.change(screen.getByLabelText('If runs are missed'), {
      target: { value: 'catch_up' },
    })

    expect(screen.getByText(/Runs the most recent missed runs/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('openai API key'), {
      target: { value: 'sk-test' },
    })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'ops@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({ schedule: 'weekly', missedPolicy: 'catch_up' })
    )
  })
})
