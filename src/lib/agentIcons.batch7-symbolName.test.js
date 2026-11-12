import { describe, expect, it } from 'vitest'
import { Bot } from 'lucide-react'
import { resolveAgentIcon } from './agentIcons'

describe('resolveAgentIcon symbol names', () => {
  it('falls back to Bot instead of throwing for a symbol', () => {
    expect(resolveAgentIcon(Symbol('icon'))).toBe(Bot)
  })
})
