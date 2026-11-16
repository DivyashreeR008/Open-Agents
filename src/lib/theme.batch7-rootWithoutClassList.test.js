import { describe, expect, it } from 'vitest'
import { applyResolvedTheme } from './theme'

describe('applyResolvedTheme root without classList', () => {
  it('does nothing when the root has no classList', () => {
    const root = { id: 'custom-root' }

    expect(() => applyResolvedTheme('dark', root)).not.toThrow()
    expect(() => applyResolvedTheme('light', root)).not.toThrow()
    expect(root).toEqual({ id: 'custom-root' })
    expect(root.classList).toBeUndefined()
  })

  it('does nothing when the root is null or has falsy classList', () => {
    expect(() => applyResolvedTheme('dark', null)).not.toThrow()
    expect(() => applyResolvedTheme('light', null)).not.toThrow()
    expect(() => applyResolvedTheme('dark', { classList: null })).not.toThrow()
    expect(() => applyResolvedTheme('light', { classList: undefined })).not.toThrow()
  })
})
