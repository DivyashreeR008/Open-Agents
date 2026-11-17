import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  readThemeMode,
  systemPrefersDark,
  writeThemeMode,
} from './theme'

const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

afterEach(() => {
  if (originalLocalStorage) {
    Object.defineProperty(globalThis, 'localStorage', originalLocalStorage)
  } else {
    delete globalThis.localStorage
  }
  vi.restoreAllMocks()
})

describe('theme persistence edge states', () => {
  it('treats an explicitly stored system preference as the default mode', () => {
    const storage = {
      getItem: (key) => (key === THEME_STORAGE_KEY ? 'system' : null),
    }

    expect(readThemeMode(storage)).toBe('system')
  })

  it('survives a localStorage getter that throws during startup', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Access denied', 'SecurityError')
      },
    })

    expect(readThemeMode()).toBe('system')
  })

  it('does not propagate failures while clearing the stored mode', () => {
    expect(() =>
      writeThemeMode('system', {
        removeItem: () => {
          throw new Error('storage disabled')
        },
      })
    ).not.toThrow()
  })

  it('ignores a missing root element and matchMedia implementation', () => {
    expect(() => applyResolvedTheme('dark', null)).not.toThrow()
    expect(systemPrefersDark(undefined)).toBe(false)
  })
})
