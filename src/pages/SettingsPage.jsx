import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  Trash2,
  ExternalLink,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'
import {
  getGlobalKeys,
  saveGlobalKeys,
  clearGlobalKey,
  clearAllGlobalKeys,
  getAvailableProviders,
} from '../lib/globalKeys'
import { clearAutomationKeys } from '../lib/automationsService'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import openaiLogo from '../assets/openai.svg'
import anthropicLogo from '../assets/anthropic.svg'
import geminiLogo from '../assets/gemini.svg'
import openrouterLogo from '../assets/openrouter.svg'

const PROVIDERS = [
  {
    id: 'openai',
    label: 'OpenAI',
    logo: openaiLogo,
    description: 'Powers GPT-4o and GPT-4o Mini',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyLabel: 'Get your key →',
    placeholder: 'sk-...',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    logo: anthropicLogo,
    description: 'Powers Claude Sonnet and Claude Opus',
    keyUrl: 'https://console.anthropic.com/keys',
    keyLabel: 'Get your key →',
    placeholder: 'sk-ant-...',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    logo: geminiLogo,
    description: 'Powers Gemini 2.5 Flash — free tier available',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyLabel: 'Get free key →',
    placeholder: 'AIza...',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    logo: openrouterLogo,
    description: 'Access 200+ models through one API',
    keyUrl: 'https://openrouter.ai/keys',
    keyLabel: 'Get your key →',
    placeholder: 'sk-or-...',
  },
]

const PROVIDER_LABEL_BY_ID = Object.fromEntries(
  PROVIDERS.map((provider) => [provider.id, provider.label])
)

function formatProviderList(providerIds) {
  return providerIds.map((id) => PROVIDER_LABEL_BY_ID[id] || id).join(', ')
}

export default function SettingsPage() {
  useDocumentTitle('Settings')

  // ── Form state
  const [keys, setKeys] = useState({ openai: '', anthropic: '', gemini: '', openrouter: '' })
  const [defaultProvider, setDefaultProvider] = useState('')
  const [showKey, setShowKey] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
    openrouter: false,
  })
  const [savedStatus, setSavedStatus] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
    openrouter: false,
  })
  const [saveMessage, setSaveMessage] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [confirmClearProvider, setConfirmClearProvider] = useState(null)
  const messageTimer = useRef(null)
  const clearAllTriggerRef = useRef(null)
  const clearAllConfirmRef = useRef(null)
  const restoreClearAllFocus = useRef(false)

  const showMessage = (message) => {
    if (messageTimer.current) clearTimeout(messageTimer.current)
    setAnnouncement(message)
    setSaveMessage(message)
    messageTimer.current = setTimeout(() => {
      setSaveMessage('')
      messageTimer.current = null
    }, 5000)
  }

  useEffect(
    () => () => {
      if (messageTimer.current) clearTimeout(messageTimer.current)
    },
    []
  )

  useEffect(() => {
    if (confirmClearAll) {
      clearAllConfirmRef.current?.focus()
    } else if (restoreClearAllFocus.current) {
      restoreClearAllFocus.current = false
      clearAllTriggerRef.current?.focus()
    }
  }, [confirmClearAll])

  const closeClearAll = () => {
    restoreClearAllFocus.current = true
    setConfirmClearAll(false)
  }

  // ── Load from localStorage on mount
  useEffect(() => {
    const stored = getGlobalKeys()
    setKeys({
      openai: stored.openai || '',
      anthropic: stored.anthropic || '',
      gemini: stored.gemini || '',
      openrouter: stored.openrouter || '',
    })
    setDefaultProvider(stored.defaultProvider || '')
    setSavedStatus({
      openai: !!stored.openai,
      anthropic: !!stored.anthropic,
      gemini: !!stored.gemini,
      openrouter: !!stored.openrouter,
    })
  }, [])

  const availableForDefault = getAvailableProviders()

  const handleSave = () => {
    try {
      const { stored, skipped } = saveGlobalKeys({ ...keys, defaultProvider })
      // Refresh saved status from the storage layer so the badges reflect what
      // was actually written, not what the form happened to contain.
      const current = getGlobalKeys()
      setSavedStatus({
        openai: !!current.openai,
        anthropic: !!current.anthropic,
        gemini: !!current.gemini,
        openrouter: !!current.openrouter,
      })

      const parts = []
      if (stored.length > 0) {
        parts.push(`Saved keys for ${formatProviderList(stored)}.`)
      } else {
        parts.push('No keys were saved. Enter a key for at least one provider.')
      }
      if (skipped.length > 0) {
        parts.push(`Skipped empty fields: ${formatProviderList(skipped)}.`)
      }
      showMessage(parts.join(' '))
    } catch {
      showMessage('Keys could not be saved. Check that browser storage is available and try again.')
    }
  }

  const handleClearKey = async (provider) => {
    clearGlobalKey(provider)
    setKeys((prev) => ({ ...prev, [provider]: '' }))
    setSavedStatus((prev) => ({ ...prev, [provider]: false }))
    setConfirmClearProvider(null)
    // clearGlobalKey already removes a preference that pointed at this
    // provider; mirror that in the form state.
    if (defaultProvider === provider) {
      setDefaultProvider('')
    }

    try {
      const clearedJobs = await clearAutomationKeys(provider)
      showMessage(
        clearedJobs > 0
          ? `Key and ${clearedJobs} scheduled job ${clearedJobs === 1 ? 'copy' : 'copies'} cleared.`
          : 'Key cleared.'
      )
    } catch {
      showMessage('Key cleared, but scheduled job credentials could not be removed.')
    }
  }

  const handleClearAll = async () => {
    clearAllGlobalKeys()
    setKeys({ openai: '', anthropic: '', gemini: '', openrouter: '' })
    setDefaultProvider('')
    setSavedStatus({ openai: false, anthropic: false, gemini: false, openrouter: false })
    setConfirmClearProvider(null)
    closeClearAll()

    try {
      const clearedJobs = await clearAutomationKeys()
      showMessage(
        clearedJobs > 0
          ? `All saved keys and ${clearedJobs} scheduled job ${clearedJobs === 1 ? 'copy' : 'copies'} cleared.`
          : 'All saved keys and the default provider preference cleared.'
      )
    } catch {
      showMessage('All saved keys cleared, but scheduled job credentials could not be removed.')
    }
  }

  const toggleShow = (provider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
          <Settings size={20} className="text-zinc-600 dark:text-zinc-300" />
        </div>
        <div>
          <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
            Settings
          </h1>
          <p className="text-xs dark:text-text-secondary text-gray-500">
            Manage your API keys and preferences
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────── */}
      {/* SECTION 1 — API Keys                        */}
      {/* ─────────────────────────────────────────── */}
      <section className="mb-8 border dark:bg-surface-card dark:border-border bg-white border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b dark:border-border border-gray-100">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-zinc-600 dark:text-zinc-300" />
            <h2 className="text-sm font-bold dark:text-text-primary text-gray-900">API Keys</h2>
          </div>
          <p className="text-xs dark:text-text-secondary text-gray-500 mt-0.5">
            Add keys for the providers you use. You only need one to get started.
          </p>
        </div>

        <div className="divide-y dark:divide-border divide-gray-100">
          {PROVIDERS.map((p) => (
            <div key={p.id} className="px-5 py-4">
              {/* Provider name row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={p.logo}
                    alt={p.label}
                    className={
                      p.id === 'openrouter'
                        ? 'w-5 h-5 flex-shrink-0 invert dark:invert-0'
                        : 'w-5 h-5 flex-shrink-0'
                    }
                  />
                  <span className="text-sm font-semibold dark:text-text-primary text-gray-800">
                    {p.label} API Key
                  </span>
                  {savedStatus[p.id] && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                      <Check size={9} strokeWidth={3} />
                      Saved
                    </span>
                  )}
                </div>
                {savedStatus[p.id] &&
                  (confirmClearProvider === p.id ? (
                    <div
                      className="flex flex-wrap items-center justify-end gap-1.5"
                      role="group"
                      aria-label={`Confirm clearing ${p.label} key`}
                    >
                      <span className="text-[10px] font-medium text-zinc-500">Clear key?</span>
                      <button
                        onClick={() => handleClearKey(p.id)}
                        aria-label={`Yes, clear ${p.label} key`}
                        className="px-2 py-1 text-[10px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-500/10 dark:text-zinc-200"
                      >
                        Yes, clear
                      </button>
                      <button
                        onClick={() => setConfirmClearProvider(null)}
                        aria-label={`Cancel clearing ${p.label} key`}
                        className="px-2 py-1 text-[10px] font-medium text-zinc-500 transition-colors hover:bg-zinc-500/10"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClearProvider(p.id)}
                      aria-label={`Clear ${p.label} key`}
                      className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 transition-colors hover:bg-zinc-500/10 hover:text-zinc-500 px-2 py-1"
                    >
                      <X size={11} />
                      Clear
                    </button>
                  ))}
              </div>

              {/* Input row */}
              <div className="relative">
                <input
                  id={`api-key-${p.id}`}
                  aria-label={`${p.label} API key`}
                  type={showKey[p.id] ? 'text' : 'password'}
                  value={keys[p.id]}
                  onChange={(e) => setKeys((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  placeholder={savedStatus[p.id] ? '••••••••••••••••••••••••' : p.placeholder}
                  className="w-full h-9 pl-3 pr-10 text-xs font-mono transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(p.id)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label={`Show ${p.label} API key`}
                  aria-pressed={showKey[p.id]}
                  aria-controls={`api-key-${p.id}`}
                  title={showKey[p.id] ? `Hide ${p.label} API key` : `Show ${p.label} API key`}
                >
                  {showKey[p.id] ? (
                    <EyeOff size={14} aria-hidden="true" />
                  ) : (
                    <Eye size={14} aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Description + link */}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] dark:text-text-muted text-gray-400">
                  {p.description}
                </span>
                <a
                  href={p.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-zinc-900 dark:text-white hover:underline transition-colors"
                >
                  {p.keyLabel}
                  <ExternalLink size={10} aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="px-5 py-4 border-t dark:border-border border-gray-100 flex items-center justify-between">
          {saveMessage ? (
            <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
              <Check size={13} />
              {saveMessage}
            </span>
          ) : (
            <span />
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all duration-150 active:scale-[0.97]"
          >
            Save Keys
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SECTION 2 — Default Provider                */}
      {/* ─────────────────────────────────────────── */}
      <section className="mb-8 border dark:bg-surface-card dark:border-border bg-white border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b dark:border-border border-gray-100">
          <h2 className="text-sm font-bold dark:text-text-primary text-gray-900">
            Default Provider
          </h2>
          <p className="text-xs dark:text-text-secondary text-gray-500 mt-0.5">
            This provider is pre-selected on every agent. You can still switch per agent.
          </p>
        </div>

        <div className="px-5 py-4">
          {availableForDefault.length === 0 ? (
            <p className="text-xs dark:text-text-muted text-gray-400">
              Save at least one API key above to set a default provider.
            </p>
          ) : (
            <select
              aria-label="Default provider"
              value={defaultProvider}
              onChange={(e) => {
                const val = e.target.value
                setDefaultProvider(val)
                saveGlobalKeys({ defaultProvider: val })
                showMessage(
                  val
                    ? `Default provider set to ${PROVIDER_LABEL_BY_ID[val] || val}.`
                    : 'Default provider cleared.'
                )
              }}
              className="w-full sm:w-64 h-9 px-3 text-sm transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary bg-gray-50 border border-gray-200 text-gray-900 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
            >
              <option value="">Select a default provider...</option>
              {availableForDefault.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────── */}
      {/* SECTION 3 — Privacy                         */}
      {/* ─────────────────────────────────────────── */}
      <section className=" border dark:bg-surface-card dark:border-border bg-white border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b dark:border-border border-gray-100">
          <h2 className="text-sm font-bold dark:text-text-primary text-gray-900">Privacy</h2>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-start gap-3 mb-5 p-3 dark:bg-surface-hover bg-gray-50">
            <ShieldCheck size={16} className="text-zinc-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs dark:text-text-secondary text-gray-600 leading-relaxed">
              Saved provider keys stay in this browser session. Scheduled jobs keep a separate,
              encrypted browser copy (and a synced copy when cloud storage is configured). Clearing
              a key here also removes the matching scheduled-job credentials.
            </p>
          </div>

          {confirmClearAll ? (
            <div
              id="clear-all-confirmation"
              role="group"
              aria-label="Confirm clearing all saved keys"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  closeClearAll()
                }
              }}
              className="flex flex-col gap-3 p-3 border border-zinc-500/20 bg-zinc-500/5"
            >
              <p className="text-xs font-medium text-zinc-500">
                Are you sure? This removes all saved provider keys, every credential copy held by
                scheduled jobs, and your default provider preference. Scheduled jobs will stop
                authenticating until a new key is added.
              </p>
              <div className="flex items-center gap-2">
                <button
                  ref={clearAllConfirmRef}
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white bg-zinc-500 hover:bg-zinc-600 transition-colors"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  Yes, clear all
                </button>
                <button
                  onClick={closeClearAll}
                  className="h-8 px-3 text-xs font-medium transition-colors dark:text-text-secondary dark:hover:bg-surface-hover text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              ref={clearAllTriggerRef}
              onClick={() => setConfirmClearAll(true)}
              aria-expanded={confirmClearAll}
              className="flex items-center gap-2 h-8 px-3 text-sm font-medium transition-colors text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500/10"
            >
              <Trash2 size={15} aria-hidden="true" />
              Clear All Keys
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
