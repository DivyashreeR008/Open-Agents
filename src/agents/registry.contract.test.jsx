import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/ApiKeyInfo', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: () => null }))
vi.mock('../components/VoiceInput', () => ({ default: () => null }))
vi.mock('../components/RunRating', () => ({ default: () => null }))
vi.mock('../components/SuggestedChainPills', () => ({ default: () => null }))
vi.mock('../components/CostEstimator', () => ({ default: () => null }))
vi.mock('../components/TokenCounter', () => ({ default: () => null }))
vi.mock('../components/BatchModeRunner', () => ({ default: () => null }))
vi.mock('../components/AgentPreviewPanel', () => ({ default: () => null }))
vi.mock('../components/PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('../components/ScheduleAgentModal', () => ({ default: () => null }))
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

import AgentRunner from '../components/AgentRunner'
import { AGENT_COUNT } from './registry'

const rawModules = import.meta.glob('./definitions/*.js', { eager: true })
const SUPPORTED_INPUT_TYPES = new Set(['text', 'textarea', 'code', 'select', 'multiselect'])

function moduleEntries() {
  return Object.entries(rawModules).map(([path, module]) => ({
    path,
    agent: module.default,
  }))
}

afterEach(cleanup)

describe('raw agent-definition contract', () => {
  it('validates every module before registry normalization can drop it', () => {
    const errors = []
    const seenAgentIds = new Map()

    expect(Object.keys(rawModules)).toHaveLength(AGENT_COUNT)

    for (const { path, agent } of moduleEntries()) {
      if (!agent || typeof agent !== 'object') {
        errors.push(`${path}: missing default object export`)
        continue
      }

      const identity = agent.id || path
      for (const field of ['id', 'name', 'description', 'systemPrompt']) {
        if (typeof agent[field] !== 'string' || !agent[field].trim()) {
          errors.push(`${identity}: ${field} must be a non-empty string`)
        }
      }
      if (!Array.isArray(agent.inputs)) {
        errors.push(`${identity}: inputs must be an array`)
        continue
      }

      if (agent.id) {
        const firstPath = seenAgentIds.get(agent.id)
        if (firstPath) errors.push(`${identity}: duplicate id in ${firstPath} and ${path}`)
        else seenAgentIds.set(agent.id, path)
      }

      const inputIds = new Set()
      for (const [index, input] of agent.inputs.entries()) {
        const inputName = `${identity}.inputs[${index}]`
        if (!input || typeof input !== 'object') {
          errors.push(`${inputName}: must be an object`)
          continue
        }
        if (typeof input.id !== 'string' || !input.id.trim()) {
          errors.push(`${inputName}: id must be a non-empty string`)
        } else if (inputIds.has(input.id)) {
          errors.push(`${identity}: duplicate input id "${input.id}"`)
        } else {
          inputIds.add(input.id)
        }
        if (typeof input.label !== 'string' || !input.label.trim()) {
          errors.push(`${inputName}: label must be a non-empty string`)
        }
        if (!SUPPORTED_INPUT_TYPES.has(input.type)) {
          errors.push(`${inputName}: unsupported type "${input.type}"`)
        }
        if (['select', 'multiselect'].includes(input.type) &&
            (!Array.isArray(input.options) || input.options.length === 0)) {
          errors.push(`${inputName}: ${input.type} requires non-empty options`)
        } else if (['select', 'multiselect'].includes(input.type)) {
          input.options.forEach((option, optionIndex) => {
            const validString = typeof option === 'string' && option.trim()
            const validObject = option && typeof option === 'object' &&
              typeof option.value === 'string' && option.value.trim() &&
              typeof option.label === 'string' && option.label.trim()
            if (!validString && !validObject) {
              errors.push(`${inputName}.options[${optionIndex}]: must be a non-empty string or a value/label object`)
            }
          })
        }
      }

      if (agent.exampleInputs != null) {
        if (typeof agent.exampleInputs !== 'object' || Array.isArray(agent.exampleInputs)) {
          errors.push(`${identity}: exampleInputs must be an object`)
        } else {
          for (const key of Object.keys(agent.exampleInputs)) {
            if (!inputIds.has(key)) errors.push(`${identity}: exampleInputs has unknown key "${key}"`)
          }
        }
      }
    }

    expect(errors, errors.join('\n')).toEqual([])
  }, 30_000)

  it('mounts every raw definition through AgentRunner', () => {
    for (const { path, agent } of moduleEntries()) {
      let mounted
      try {
        mounted = render(
          <MemoryRouter>
            <AgentRunner agent={agent} />
          </MemoryRouter>
        )
        expect(mounted.container.firstChild, `${agent?.id || path} rendered nothing`).not.toBeNull()
      } catch (error) {
        throw new Error(`${agent?.id || path} failed to render: ${error.message}`, { cause: error })
      } finally {
        mounted?.unmount()
      }
    }
  }, 180_000)
})
