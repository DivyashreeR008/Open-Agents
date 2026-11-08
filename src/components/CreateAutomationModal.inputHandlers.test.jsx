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
  inputs: [
    { id: 'topic', label: 'Topic', type: 'textarea', placeholder: 'Enter topic' },
    { id: 'tone', label: 'Tone', type: 'text', placeholder: 'Enter tone' },
    {
      id: 'channels',
      label: 'Channels',
      type: 'multiselect',
      options: ['Email', 'Slack'],
    },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  service.createAutomation.mockResolvedValue({})
})

describe('CreateAutomationModal dynamic input handlers', () => {
  it('updates text fields and toggles multiselect values in the saved payload', async () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    fireEvent.change(screen.getByLabelText('Automation name'), {
      target: { value: 'Daily digest' },
    })
    fireEvent.change(screen.getByLabelText('Topic'), { target: { value: 'AI safety' } })
    fireEvent.change(screen.getByLabelText('Tone'), { target: { value: 'formal' } })

    fireEvent.click(screen.getByRole('button', { name: /Email/ }))
    fireEvent.click(screen.getByRole('button', { name: /Slack/ }))
    fireEvent.click(screen.getByRole('button', { name: /Email/ }))

    fireEvent.change(screen.getByLabelText('openai API key'), {
      target: { value: 'sk-test' },
    })
    fireEvent.change(screen.getByLabelText('Recipient email address'), {
      target: { value: 'ops@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))

    await waitFor(() => expect(service.createAutomation).toHaveBeenCalledTimes(1))
    expect(service.createAutomation).toHaveBeenCalledWith(
      expect.objectContaining({
        inputs: {
          topic: 'AI safety',
          tone: 'formal',
          channels: ['Slack'],
        },
      })
    )
  })
})
