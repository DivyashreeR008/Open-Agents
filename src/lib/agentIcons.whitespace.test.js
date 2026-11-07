import { describe, expect, it } from 'vitest'
import * as LucideIcons from 'lucide-react'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'

describe('agent icon whitespace names', () => {
  it('does not trim unknown whitespace into a real icon', () => {
    expect(resolveAgentIcon(' Bot ')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon(' Bot ')).toBe(false)
  })

  it('still resolves the exact GitHub alias', () => {
    expect(isKnownAgentIcon('Github')).toBe(true)
    expect(resolveAgentIcon('GitHub')).not.toBe(LucideIcons.Bot)
  })
})
