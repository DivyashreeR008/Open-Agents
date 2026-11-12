import { describe, expect, it } from 'vitest'
import { applyResolvedTheme } from './theme'

describe('applyResolvedTheme root guards', () => {
  it('does nothing when the root has no classList', () => {
    expect(() => applyResolvedTheme('dark', {})).not.toThrow()
  })

  it('does nothing when the root is null', () => {
    expect(() => applyResolvedTheme('light', null)).not.toThrow()
  })
})
