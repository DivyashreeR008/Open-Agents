// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveGlobalKeys, getGlobalKeys } from './globalKeys'
import { useApiKey } from './useApiKey'
import { useHistory } from './useHistory'
import { useScheduler } from './useScheduler'
import { createTrace, recordStep, finalizeTrace } from './executionTrace'
import { storeAutomationKey } from './automationsService'
import { exportBatchAsCSV, exportBatchAsMarkdown } from './exportBatch'
import { exportWorkflowAsMarkdown } from './exportMarkdown'

// jsdom has no IndexedDB. The policy under test is that the vault stores only
// ciphertext, so provide a deterministic device key instead of the keystore.
vi.mock('./automationKeyStore', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getOrCreateDeviceKey: vi.fn(() =>
      globalThis.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
        'encrypt',
        'decrypt',
      ])
    ),
  }
})

const SENTINEL = 'sk-policy-sentinel-DO-NOT-PERSIST'
const LEGACY_GLOBAL_KEY = 'OpenAgents_openai_key'
const AUTOMATION_VAULT = 'oa_encrypted_vault_v2'

function localStorageSnapshot() {
  return Object.fromEntries(
    Array.from({ length: localStorage.length }, (_, index) => {
      const key = localStorage.key(index)
      return [key, localStorage.getItem(key)]
    })
  )
}

function expectNoPlaintextInPersistentStorage() {
  expect(JSON.stringify(localStorageSnapshot())).not.toContain(SENTINEL)
}

describe('credential persistence policy', () => {
  let downloads

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    downloads = []
    vi.restoreAllMocks()
    vi.stubGlobal(
      'Blob',
      class PolicyBlob {
        constructor(parts) {
          downloads.push(parts.join(''))
        }
      }
    )
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:policy-test'),
      revokeObjectURL: vi.fn(),
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('keeps global and per-run keys in session storage only', async () => {
    saveGlobalKeys({ openai: SENTINEL })
    expect(sessionStorage.getItem(LEGACY_GLOBAL_KEY)).toContain(SENTINEL)

    localStorage.setItem(LEGACY_GLOBAL_KEY, SENTINEL)
    expect(getGlobalKeys().openai).toBe(SENTINEL)
    expect(localStorage.getItem(LEGACY_GLOBAL_KEY)).toBeNull()

    const { result } = renderHook(() => useApiKey())
    act(() => result.current.setApiKey(SENTINEL))
    act(() => result.current.setSaveForSession(true))

    await waitFor(() => {
      expect(sessionStorage.getItem('oa_apikey_openai')).toContain(SENTINEL)
    })
    expectNoPlaintextInPersistentStorage()
  })

  it('removes credential fields from histories, jobs, and traces', async () => {
    const history = renderHook(() => useHistory())
    act(() =>
      history.result.current.saveRun({
        agentId: 'policy-agent',
        agentName: 'Policy Agent',
        apiKey: SENTINEL,
        inputs: { prompt: 'safe', token: SENTINEL },
        output: 'safe output',
      })
    )

    const scheduler = renderHook(() => useScheduler({ autoRun: false }))
    act(() =>
      scheduler.result.current.addJob({
        agentId: 'policy-agent',
        agentName: 'Policy Agent',
        agentDefinition: { inputs: [] },
        inputs: {},
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: SENTINEL,
        schedule: 'daily',
        label: 'Policy job',
      })
    )

    const trace = createTrace({ workflowId: 'policy-workflow' })
    recordStep(trace, {
      stepName: 'Policy step',
      stepType: 'agent',
      input: 'safe input',
      output: 'safe output',
      durationMs: 1,
      status: 'done',
      apiKey: SENTINEL,
    })
    finalizeTrace(trace, { status: 'done', finalOutput: 'safe output', apiKey: SENTINEL })

    await waitFor(() => expect(localStorage.getItem('oa_scheduled_jobs')).not.toBeNull())
    expect(sessionStorageSnapshot()).toContain(SENTINEL)
    expectNoPlaintextInPersistentStorage()
  })

  it('permits only ciphertext in the reviewed automation-vault exception', async () => {
    await storeAutomationKey('policy-job', SENTINEL)

    const vault = localStorage.getItem(AUTOMATION_VAULT)
    expect(vault).toBeTruthy()
    expect(vault).not.toContain(SENTINEL)
    expectNoPlaintextInPersistentStorage()
  })

  it('excludes credential fields from batch and workflow exports', () => {
    const result = {
      input: 'safe input',
      status: 'done',
      output: 'safe output',
      error: '',
      apiKey: SENTINEL,
      secret: SENTINEL,
    }
    exportBatchAsCSV('Policy Agent', [result])
    exportBatchAsMarkdown('Policy Agent', [result])
    exportWorkflowAsMarkdown('Policy Workflow', [
      {
        status: 'done',
        agentName: 'Policy Agent',
        output: 'safe output',
        apiKey: SENTINEL,
      },
    ])

    expect(downloads).toHaveLength(3)
    expect(downloads.join('\n')).not.toContain(SENTINEL)
  })
})

function sessionStorageSnapshot() {
  return Array.from({ length: sessionStorage.length }, (_, index) =>
    sessionStorage.getItem(sessionStorage.key(index))
  ).join('\n')
}
