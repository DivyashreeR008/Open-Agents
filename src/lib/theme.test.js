import { describe, expect, it, vi } from 'vitest'
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  readThemeMode,
  resolveThemeMode,
  systemPrefersDark,
  writeThemeMode,
} from './theme'

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem: vi.fn((key) => (values.has(key) ? values.get(key) : null)),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
    removeItem: vi.fn((key) => values.delete(key)),
  }
}

describe('theme preference resolution', () => {
  it('defaults to system for missing and unknown stored values', () => {
    expect(readThemeMode(createStorage())).toBe('system')
    expect(readThemeMode(createStorage({ [THEME_STORAGE_KEY]: 'sepia' }))).toBe('system')
  })

  it('keeps explicit light and dark preferences', () => {
    expect(readThemeMode(createStorage({ [THEME_STORAGE_KEY]: 'light' }))).toBe('light')
    expect(readThemeMode(createStorage({ [THEME_STORAGE_KEY]: 'dark' }))).toBe('dark')
  })

  it('treats blocked storage as no saved preference', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('blocked')
      }),
    }

    expect(readThemeMode(storage)).toBe('system')
  })

  it('persists explicit modes and removes the key for system', () => {
    const storage = createStorage()

    writeThemeMode('dark', storage)
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark')

    writeThemeMode('light', storage)
    expect(storage.setItem).toHaveBeenLastCalledWith(THEME_STORAGE_KEY, 'light')

    writeThemeMode('system', storage)
    expect(storage.removeItem).toHaveBeenCalledWith(THEME_STORAGE_KEY)
  })

  it('ignores unknown modes and storage write failures', () => {
    const storage = createStorage()

    writeThemeMode('sepia', storage)
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(storage.removeItem).not.toHaveBeenCalled()

    expect(() =>
      writeThemeMode('dark', {
        setItem: () => {
          throw new Error('quota')
        },
      })
    ).not.toThrow()
  })

  it('lets explicit choices override the system preference', () => {
    expect(resolveThemeMode('light', true)).toBe('light')
    expect(resolveThemeMode('dark', false)).toBe('dark')
    expect(resolveThemeMode('system', true)).toBe('dark')
    expect(resolveThemeMode('system', false)).toBe('light')
  })

  it('reads the system preference and falls back safely', () => {
    expect(systemPrefersDark(() => ({ matches: true }))).toBe(true)
    expect(systemPrefersDark(() => ({ matches: false }))).toBe(false)
    expect(systemPrefersDark(() => undefined)).toBe(false)
    expect(
      systemPrefersDark(() => {
        throw new Error('unsupported')
      })
    ).toBe(false)
  })

  it('applies the resolved theme to the root element', () => {
    const root = document.documentElement
    root.classList.remove('dark')

    applyResolvedTheme('dark', root)
    expect(root).toHaveClass('dark')

    applyResolvedTheme('light', root)
    expect(root).not.toHaveClass('dark')
  })
})
