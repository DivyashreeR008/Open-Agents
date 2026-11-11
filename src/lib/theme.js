export const THEME_STORAGE_KEY = 'oa_theme'
export const THEME_MODES = ['system', 'light', 'dark']

function getLocalStorage() {
  try {
    return globalThis.localStorage
  } catch {
    return null
  }
}

export function readThemeMode(storage = getLocalStorage()) {
  try {
    const saved = storage?.getItem(THEME_STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system'
  }
}

export function writeThemeMode(mode, storage = getLocalStorage()) {
  if (!THEME_MODES.includes(mode)) return

  try {
    if (mode === 'system') {
      storage?.removeItem(THEME_STORAGE_KEY)
    } else {
      storage?.setItem(THEME_STORAGE_KEY, mode)
    }
  } catch {
    // A blocked storage API must not stop the theme from changing in this tab.
  }
}

export function resolveThemeMode(mode, prefersDark) {
  if (mode === 'light' || mode === 'dark') return mode
  return prefersDark ? 'dark' : 'light'
}

export function systemPrefersDark(matchMedia = globalThis.matchMedia) {
  try {
    return Boolean(matchMedia?.('(prefers-color-scheme: dark)')?.matches)
  } catch {
    return false
  }
}

export function applyResolvedTheme(theme, root = globalThis.document?.documentElement) {
  if (!root?.classList) return
  root.classList.toggle('dark', theme === 'dark')
}
