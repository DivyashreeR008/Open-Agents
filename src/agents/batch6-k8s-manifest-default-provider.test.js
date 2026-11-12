import { describe, expect, it } from 'vitest'
import agent from './definitions/k8s-manifest-generator'

describe('Kubernetes manifest generator provider', () => {
  it('defaults the any-provider agent to a provider that owns its model', () => {
    expect(agent.defaultProvider).toBe('gemini')
    expect(agent.model).toBe('gemini-2.5-flash')
  })
})
