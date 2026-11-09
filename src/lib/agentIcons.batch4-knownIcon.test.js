import { describe, expect, it } from 'vitest'
import * as LucideIcons from 'lucide-react'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'

describe('agent icon known lookup', () => {
  it('returns the matching lucide component for a real export', () => {
    expect(resolveAgentIcon('Bot')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon('Bot')).toBe(true)
  })
})
