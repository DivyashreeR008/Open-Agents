import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { AgentsProvider } from '../lib/useAgents'
import { loadAllAgents } from '../agents/registry'

// Stub the LLM provider interface so no real API keys or networks are required.
vi.mock('../lib/llmAdapter', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    streamAgent: vi.fn(async ({ onChunk, userMessage }) => {
      const content = `Smoke Test Output: Analysis complete. Result: ${userMessage.slice(0, 30)}`
      onChunk?.(content)
      return {
        content,
        duration: 120,
      }
    }),
  }
})

describe('End-to-End Application Smoke Path', () => {
  // Preload agent definitions and page chunks into memory so route transitions resolve immediately
  beforeAll(async () => {
    await loadAllAgents()
    await import('../pages/HomePage')
    await import('../pages/AgentPage')
    await import('../components/AgentRunner')
  }, 120000)

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    // Configure stubbed provider credentials so the agent can execute without real keys
    sessionStorage.setItem('OpenAgents_anthropic_key', 'stubbed-test-key')
    sessionStorage.setItem(
      'oa_apikey_anthropic',
      JSON.stringify({
        key: 'stubbed-test-key',
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      })
    )
    sessionStorage.setItem('OpenAgents_openai_key', 'stubbed-test-key')
    sessionStorage.setItem(
      'oa_apikey_openai',
      JSON.stringify({
        key: 'stubbed-test-key',
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      })
    )
  })

  it('completes the core user journey: load catalogue -> open agent -> run against stubbed provider -> see output -> find in history', async () => {
    const user = userEvent.setup()

    // 1. Render the application starting at the catalogue
    render(
      <MemoryRouter initialEntries={['/agents']}>
        <AgentsProvider>
          <App />
        </AgentsProvider>
      </MemoryRouter>
    )

    // 2. Load the catalogue: agents should load and be visible in the catalogue view
    const agentTitle = await screen.findByText('A/B Test Analyzer', {}, { timeout: 15000 })
    expect(agentTitle).toBeInTheDocument()

    const agentLink = agentTitle.closest('a')
    expect(agentLink).toBeTruthy()

    // 3. Open an agent: click the agent card link to navigate to the runner
    await user.click(agentLink)

    // Wait for the agent runner view to load
    const heading = await screen.findByRole(
      'heading',
      { name: /a\/b test analyzer/i },
      { timeout: 15000 }
    )
    expect(heading).toBeInTheDocument()

    const inputArea = await screen.findByPlaceholderText(
      /control and variant sample sizes/i,
      {},
      { timeout: 15000 }
    )
    expect(inputArea).toBeInTheDocument()

    // 4. Run against a stubbed provider: fill in required input and trigger run
    fireEvent.change(inputArea, {
      target: { value: 'Control: 100 visitors, 10 signups. Variant: 100 visitors, 20 signups.' },
    })

    const runButton = screen.getByRole('button', { name: /run agent/i })
    expect(runButton).not.toBeDisabled()

    await user.click(runButton)

    // 5. See output: verify output renders on screen
    const outputElement = await screen.findByText(
      /smoke test output: analysis complete/i,
      {},
      { timeout: 15000 }
    )
    expect(outputElement).toBeInTheDocument()

    // 6. Find it in history: verify stored in localStorage and visible in recent history
    const savedHistoryRaw = localStorage.getItem('OpenAgents_history')
    expect(savedHistoryRaw).toBeTruthy()
    const savedHistory = JSON.parse(savedHistoryRaw)
    expect(savedHistory.length).toBeGreaterThan(0)
    expect(savedHistory[0].agentName).toBe('A/B Test Analyzer')
    expect(savedHistory[0].output).toContain('Smoke Test Output')

    // Navigate back to the catalogue using the back link
    const backLink = screen.getByRole('link', { name: /← all agents/i })
    await user.click(backLink)

    // Verify catalogue is reloaded and the run is present in Recent Runs
    await screen.findByText('Recent runs', {}, { timeout: 15000 })
    expect(screen.getByRole('heading', { level: 3, name: 'A/B Test Analyzer' })).toBeInTheDocument()
    expect(screen.getByText(/smoke test output: analysis complete/i)).toBeInTheDocument()
  }, 45000)
})
