import { describe, expect, it, vi } from 'vitest'

vi.mock('./supabase', () => ({ supabase: { from: vi.fn() } }))

const { estimateCost } = await import('./useAgentRunMetrics')

describe('agent run cost lookup boundaries', () => {
  it('does not treat inherited object keys as priced models', () => {
    for (const model of ['toString', 'constructor', 'hasOwnProperty', '__proto__']) {
      expect(estimateCost(model, 1000, 1000), model).toBeNull()
    }
  })

  it('still prices the documented models', () => {
    expect(estimateCost('gpt-4o', 2000, 1000)).toBeCloseTo(0.025)
    expect(estimateCost('claude-sonnet', 1000, 2000)).toBeCloseTo(0.033)
  })
})
