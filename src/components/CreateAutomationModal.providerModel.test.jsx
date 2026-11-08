import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MODELS } from '../lib/resolveAgentModel'

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

describe('CreateAutomationModal provider and model pairing', () => {
  it('switches the model list and default when the provider changes', () => {
    render(<CreateAutomationModal isOpen onClose={() => {}} preselectedAgent={agent} />)

    fireEvent.change(screen.getByLabelText('Model provider'), { target: { value: 'gemini' } })

    const model = screen.getByLabelText('Model')
    expect(model).toHaveValue(MODELS.gemini[0].value)
    expect(Array.from(model.options).map((option) => option.value)).toEqual(
      MODELS.gemini.map((entry) => entry.value)
    )
  })
})
