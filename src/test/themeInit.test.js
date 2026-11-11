import fs from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ROOT_DIR = process.cwd()
const THEME_INIT_PATH = path.join(ROOT_DIR, 'public', 'theme-init.js')
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html')
const themeInitScript = fs.readFileSync(THEME_INIT_PATH, 'utf8')

function runThemeInit() {
  new Function('window', 'document', themeInitScript)(window, document)
}

function mockSystemDark(matches) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('pre-paint theme initialization', () => {
  it('loads the initializer from the head before the app body', () => {
    const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8')

    expect(html).toContain('src="/theme-init.js"')
    expect(html.indexOf('theme-init.js')).toBeLessThan(html.indexOf('<body'))
    expect(html).not.toMatch(/<html[^>]*class="[^"]*\bdark\b/)
  })

  it('applies a saved dark preference before the app mounts', () => {
    localStorage.setItem('oa_theme', 'dark')
    mockSystemDark(false)

    runThemeInit()

    expect(document.documentElement).toHaveClass('dark')
  })

  it('keeps a saved light preference even when the system is dark', () => {
    localStorage.setItem('oa_theme', 'light')
    mockSystemDark(true)

    runThemeInit()

    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('follows the system when no preference is saved', () => {
    mockSystemDark(true)

    runThemeInit()

    expect(document.documentElement).toHaveClass('dark')
  })

  it('follows the system when storage access is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    mockSystemDark(true)

    runThemeInit()

    expect(document.documentElement).toHaveClass('dark')
  })
})
