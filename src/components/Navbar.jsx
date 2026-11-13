import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  HelpCircle,
  DollarSign,
  RotateCcw,
  Settings,
  PanelLeft,
  ExternalLink,
} from 'lucide-react'

import GitHubIcon from './GitHubIcon'
import Logo from './Logo'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useSessionSpend } from '../lib/useSessionSpend'
import { formatCost } from '../lib/formatting'
import {
  applyResolvedTheme,
  readThemeMode,
  resolveThemeMode,
  systemPrefersDark,
  writeThemeMode,
} from '../lib/theme'

const THEME_OPTIONS = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

function updateThemeMeta(isDark) {
  if (typeof document === 'undefined') return
  const metaTags = document.querySelectorAll('meta[name="theme-color"]')
  metaTags.forEach((tag) => {
    if (!tag.hasAttribute('media')) {
      tag.setAttribute('content', isDark ? '#000000' : '#ffffff')
    }
  })
}

/**
 * App bar. Deliberately thin (48px) and mostly monochrome: the brand, a
 * global search affordance, and the account/utility actions. Primary
 * navigation lives in the Sidebar so this row never gets crowded.
 */
export default function Navbar({ sidebarOpen, setSidebarOpen, onOpenCommandPalette }) {
  const [themeMode, setThemeMode] = useState(() => readThemeMode())
  const [systemDark, setSystemDark] = useState(() => systemPrefersDark())
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSpendPopup, setShowSpendPopup] = useState(false)
  const themeMenuRef = useRef(null)
  const spendMenuRef = useRef(null)
  const spendToggleRef = useRef(null)
  const { totalSpend, runs, startedAt, clearSession } = useSessionSpend()
  const navigate = useNavigate()

  const resolvedTheme = resolveThemeMode(themeMode, systemDark)
  const darkMode = resolvedTheme === 'dark'

  useKeyboardShortcuts({
    '?': () => setShowShortcuts(true),
  })

  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
    updateThemeMeta(darkMode)
  }, [resolvedTheme, darkMode])

  useEffect(() => {
    if (themeMode !== 'system') return undefined

    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return undefined

    if (typeof media.matches === 'boolean') setSystemDark(media.matches)
    const handleChange = (event) => setSystemDark(event.matches)

    if (media.addEventListener) media.addEventListener('change', handleChange)
    else media.addListener?.(handleChange)

    return () => {
      if (media.removeEventListener) media.removeEventListener('change', handleChange)
      else media.removeListener?.(handleChange)
    }
  }, [themeMode])

  useEffect(() => {
    if (!showSpendPopup) return undefined

    const handlePointerDown = (event) => {
      if (!spendMenuRef.current?.contains(event.target)) setShowSpendPopup(false)
    }
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setShowSpendPopup(false)
      spendToggleRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showSpendPopup])

  useEffect(() => {
    if (!showThemeMenu) return undefined

    const handlePointerDown = (event) => {
      if (!themeMenuRef.current?.contains(event.target)) setShowThemeMenu(false)
    }
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setShowThemeMenu(false)
      document.getElementById('nav-theme-toggle')?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showThemeMenu])

  const chooseTheme = (mode) => {
    if (mode === 'system') setSystemDark(systemPrefersDark())
    setThemeMode(mode)
    writeThemeMode(mode)
    setShowThemeMenu(false)
  }

  const handleSearchClick = () => {
    setMobileMenuOpen(false)
    if (onOpenCommandPalette) {
      onOpenCommandPalette()
      return
    }

    // Fallback: Focus synchronously when the catalogue is already mounted.
    const input = document.getElementById('agent-search')
    if (input) {
      input.focus()
      return
    }

    navigate('/agents', { state: { focusSearch: true } })
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-zinc-200 bg-white/85 backdrop-blur-xl dark:border-border dark:bg-surface/85">
        <div className="mx-auto flex h-full max-w-[1700px] items-center gap-2 px-3 sm:gap-3 sm:px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-icon lg:hidden"
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={17} /> : <PanelLeft size={17} />}
          </button>

          <Link
            to="/"
            aria-label="Open Agents — go to homepage"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center px-1 py-1 transition-opacity hover:opacity-80"
          >
            <Logo height={20} className="text-zinc-900 dark:text-text-primary" />
          </Link>

          <span
            className="mx-1 hidden h-4 w-px shrink-0 bg-zinc-200 dark:bg-border sm:block"
            aria-hidden="true"
          />

          {/* Global search / Command Palette trigger */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="group hidden h-8 min-w-0 flex-1 max-w-xs items-center gap-2 border px-2.5 text-left transition-colors sm:flex border-zinc-200 bg-zinc-50/60 hover:border-zinc-300 hover:bg-white dark:border-border dark:bg-surface-card/60 dark:hover:border-border-light dark:hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
            aria-label="Search agents, workflows, settings (Ctrl+K)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-text-muted"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="truncate text-[13px] text-zinc-400 dark:text-text-muted">
              Jump to agent, workflow…
            </span>
            <span className="kbd ml-auto hidden md:inline-flex font-mono">⌘K</span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <a
              href="https://github.com/DivyashreeR008/Open-Agents"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star Open Agents on GitHub (opens in new tab)"
              className="btn-secondary hidden h-8 sm:inline-flex"
            >
              <GitHubIcon size={14} aria-hidden="true" />
              <span className="hidden lg:inline">Star</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>

            <button
              onClick={() => setShowShortcuts(true)}
              className="btn-icon hidden md:inline-flex"
              aria-label="Keyboard shortcuts"
            >
              <HelpCircle size={16} />
            </button>

            {totalSpend > 0 && (
              <div className="relative hidden md:block" ref={spendMenuRef}>
                <button
                  ref={spendToggleRef}
                  id="nav-spend-toggle"
                  type="button"
                  onClick={() => setShowSpendPopup((p) => !p)}
                  className="inline-flex h-8 items-center gap-1 border px-2 font-mono text-[11px] font-medium tabular-nums transition-colors border-zinc-500/25 bg-zinc-500/10 text-zinc-600 hover:bg-zinc-500/20 dark:text-zinc-400"
                  aria-label="Session spend"
                  aria-haspopup="dialog"
                  aria-expanded={showSpendPopup}
                  aria-controls="nav-spend-details"
                >
                  <DollarSign size={11} />
                  {formatCost(totalSpend, { symbol: false })}
                </button>

                {showSpendPopup && (
                  <div
                    id="nav-spend-details"
                    role="dialog"
                    aria-label="Session spend details"
                    className="absolute right-0 top-full z-50 mt-2 w-64 animate-fade-in border border-zinc-200 bg-white p-3 shadow-pop dark:border-border dark:bg-surface-card"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="eyebrow">Session spend</span>
                      <span className="font-mono text-[10px] text-zinc-400 dark:text-text-muted">
                        {runs.length} run{runs.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="mb-1 font-mono text-lg font-semibold tabular-nums text-zinc-900 dark:text-text-primary">
                      {formatCost(totalSpend)}
                    </div>
                    <p className="mb-2 font-mono text-[10px] text-zinc-500 dark:text-text-muted">
                      {startedAt
                        ? `Tracked since ${new Date(startedAt).toLocaleString()} · persists across reloads`
                        : 'Persists across reloads'}
                    </p>
                    <div className="mb-1 max-h-32 space-y-1 overflow-y-auto">
                      {runs.slice(0, 10).map((run, i) => (
                        <div
                          key={i}
                          className="flex justify-between font-mono text-[10px] text-zinc-400 dark:text-text-muted"
                        >
                          <span className="max-w-[140px] truncate">{run.model || 'Unknown'}</span>
                          <span className="tabular-nums">{formatCost(run.totalCost)}</span>
                        </div>
                      ))}
                    </div>
                    {runs.length > 10 && (
                      <p className="mb-2 font-mono text-[10px] text-zinc-500 dark:text-text-muted">
                        Showing newest 10 of {runs.length} runs
                      </p>
                    )}
                    <button
                      onClick={() => {
                        clearSession()
                        setShowSpendPopup(false)
                      }}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 transition-colors hover:text-black dark:hover:text-white dark:text-text-muted"
                    >
                      <RotateCcw size={10} />
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="relative" ref={themeMenuRef}>
              <button
                id="nav-theme-toggle"
                type="button"
                onClick={() => setShowThemeMenu((open) => !open)}
                className="btn-icon"
                aria-label="Theme settings"
                aria-haspopup="menu"
                aria-expanded={showThemeMenu}
                title={`Theme: ${themeMode}`}
              >
                {themeMode === 'system' ? (
                  <Monitor size={16} />
                ) : darkMode ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                )}
              </button>

              {showThemeMenu && (
                <div
                  role="menu"
                  aria-label="Theme"
                  className="absolute right-0 top-full z-50 mt-2 w-36 animate-fade-in border border-zinc-200 bg-white p-1 shadow-pop dark:border-border dark:bg-surface-card"
                >
                  {THEME_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={themeMode === value}
                      onClick={() => chooseTheme(value)}
                      className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs transition-colors ${
                        themeMode === value
                          ? 'bg-zinc-500/10 font-semibold text-zinc-900 dark:text-text-primary'
                          : 'text-zinc-600 hover:bg-zinc-500/10 dark:text-text-secondary'
                      }`}
                    >
                      <Icon size={13} aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              id="nav-settings-link"
              to="/settings"
              className="btn-icon hidden sm:inline-flex"
              aria-label="Settings"
            >
              <Settings size={16} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="btn-icon sm:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile fallback for the search affordance */}
        <div
          className={`overflow-hidden border-b border-zinc-200 bg-white transition-[max-height,opacity] duration-200 sm:hidden dark:border-border dark:bg-surface ${
            mobileMenuOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-2">
            <button
              type="button"
              onClick={handleSearchClick}
              className="field flex items-center gap-2 text-left text-zinc-400 dark:text-text-muted"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              Jump to agent, workflow…
            </button>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <a
                href="https://github.com/DivyashreeR008/Open-Agents"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <GitHubIcon size={14} aria-hidden="true" />
                Star
                <ExternalLink size={12} aria-hidden="true" />
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <button
                onClick={() => {
                  setShowShortcuts(true)
                  setMobileMenuOpen(false)
                }}
                className="btn-secondary"
              >
                <HelpCircle size={14} />
                Shortcuts
              </button>
            </div>
          </div>
        </div>
      </header>

      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  )
}
