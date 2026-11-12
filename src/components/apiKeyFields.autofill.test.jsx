import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agentsState = vi.hoisted(() => ({ agents: [] }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentsState.agents, loading: false }),
}))

vi.mock('../lib/useApiKey', () => ({
  useApiKey: () => ({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: '',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  }),
}))

vi.mock('../lib/automationsService', async (importOriginal) => ({
  ...(await importOriginal()),
  clearAutomationKeys: vi.fn(),
  createAutomation: vi.fn(),
  updateAutomation: vi.fn(),
}))

import ApiKeyBar from './ApiKeyBar'
import CreateAutomationModal from './CreateAutomationModal'
import ScheduleAgentModal from './ScheduleAgentModal'
import BattleModeSetup from '../pages/BattleModeSetup'
import SettingsPage from '../pages/SettingsPage'

const agent = {
  id: 'autofill-agent',
  name: 'Autofill Agent',
  category: 'Test',
  provider: 'openai',
  systemPrompt: 'Test the field.',
  inputs: [{ id: 'topic', label: 'Topic', type: 'text' }],
}

function expectApiKeyHints(input, name) {
  expect(input).toHaveAttribute('name', name)
  expect(input).toHaveAttribute('autocomplete', 'new-password')
  expect(input).toHaveAttribute('autocapitalize', 'none')
  expect(input).toHaveAttribute('autocorrect', 'off')
  expect(input).toHaveAttribute('spellcheck', 'false')
  expect(input).toHaveAttribute('data-1p-ignore', 'true')
  expect(input).toHaveAttribute('data-lpignore', 'true')
  expect(input).toHaveAttribute('data-bwignore', 'true')
  expect(input).toHaveAttribute('data-form-type', 'other')
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  agentsState.agents = [agent]
})

describe('API key fields keep credential managers out', () => {
  it('marks every provider row on the settings page', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    )

    const providers = [
      ['OpenAI API key', 'api-key-openai'],
      ['Anthropic API key', 'api-key-anthropic'],
      ['Google Gemini API key', 'api-key-gemini'],
      ['OpenRouter API key', 'api-key-openrouter'],
    ]

    for (const [label, name] of providers) {
      expectApiKeyHints(screen.getByLabelText(label), name)
    }
  })

  it('marks the runner API key field with the active provider name', () => {
    render(
      <MemoryRouter>
        <ApiKeyBar
          provider="openai"
          setProvider={vi.fn()}
          apiKey=""
          setApiKey={vi.fn()}
          saveForSession={false}
          setSaveForSession={vi.fn()}
          agentProvider="any"
          model="gpt-4o"
          setModel={vi.fn()}
        />
      </MemoryRouter>
    )

    expectApiKeyHints(screen.getByLabelText('API key'), 'api-key-openai')
  })

  it('marks every battle mode key field', () => {
    render(
      <MemoryRouter>
        <BattleModeSetup />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Autofill Agent/ }))

    const fields = [
      ['OpenAI API Key', 'api-key-openai'],
      ['Anthropic API Key', 'api-key-anthropic'],
      ['Gemini API Key', 'api-key-gemini'],
      ['OpenRouter API Key', 'api-key-openrouter'],
    ]

    for (const [label, name] of fields) {
      expectApiKeyHints(screen.getByLabelText(label), name)
    }
  })

  it('marks the session key field in the schedule modal', () => {
    render(
      <ScheduleAgentModal
        agent={agent}
        inputs={{}}
        provider="openai"
        apiKey=""
        onSchedule={vi.fn()}
        onClose={vi.fn()}
      />
    )

    expectApiKeyHints(screen.getByLabelText('Provider API key'), 'scheduled-run-api-key')
  })

  it('marks the encrypted key field in the automation modal', () => {
    render(<CreateAutomationModal isOpen onClose={vi.fn()} preselectedAgent={agent} />)

    expectApiKeyHints(screen.getByLabelText('openai API key'), 'automation-api-key-openai')
  })
})
