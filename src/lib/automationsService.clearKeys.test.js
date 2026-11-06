// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { clearAutomationKeys, loadAutomations } from './automationsService'

const AUTOMATIONS_KEY = 'oa_automations_v2'
const VAULT_KEY = 'oa_encrypted_vault_v2'

const automations = [
  { id: 'openai-job', provider: 'openai', hasKey: true },
  { id: 'gemini-job', provider: 'gemini', hasKey: true },
  { id: 'no-key-job', provider: 'openai', hasKey: false },
]

function seedStorage() {
  localStorage.setItem(AUTOMATIONS_KEY, JSON.stringify(automations))
  localStorage.setItem(
    VAULT_KEY,
    JSON.stringify({
      'openai-job': 'encrypted-openai',
      'gemini-job': 'encrypted-gemini',
      orphaned: 'encrypted-orphan',
    })
  )
}

describe('clearAutomationKeys', () => {
  beforeEach(() => {
    localStorage.clear()
    seedStorage()
  })

  it('clears only matching scheduled-job credentials for one provider', async () => {
    await expect(clearAutomationKeys('openai')).resolves.toBe(1)

    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({
      'gemini-job': 'encrypted-gemini',
      orphaned: 'encrypted-orphan',
    })
    expect(loadAutomations()).toEqual([
      { id: 'openai-job', provider: 'openai', hasKey: false },
      { id: 'gemini-job', provider: 'gemini', hasKey: true },
      { id: 'no-key-job', provider: 'openai', hasKey: false },
    ])
  })

  it('clears the complete vault, including orphaned entries', async () => {
    await expect(clearAutomationKeys()).resolves.toBe(2)

    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({})
    expect(loadAutomations().every((automation) => !automation.hasKey)).toBe(true)
  })

  it('tolerates a missing or malformed vault', async () => {
    localStorage.setItem(VAULT_KEY, '{not-json')

    await expect(clearAutomationKeys('openai')).resolves.toBe(1)
    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({})
  })
})
