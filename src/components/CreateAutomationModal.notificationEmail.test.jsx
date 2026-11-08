import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

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
})

describe('CreateAutomationModal notification email visibility', () => {
  it('hides and restores the recipient field with the email toggle', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    const toggle = document.querySelector('input[type="checkbox"].sr-only')
    expect(toggle).not.toBeNull()
    expect(screen.getByLabelText('Recipient email address')).toBeInTheDocument()

    fireEvent.click(toggle)
    expect(screen.queryByLabelText('Recipient email address')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    const email = screen.getByLabelText('Recipient email address')
    fireEvent.change(email, { target: { value: 'ops@example.com' } })
    expect(email).toHaveValue('ops@example.com')
  })
})
