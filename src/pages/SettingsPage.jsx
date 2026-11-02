import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings, Eye, EyeOff, Check, X,
  Trash2, ExternalLink, ShieldCheck, KeyRound,
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
import openaiLogo   from '../assets/openai.svg'
import anthropicLogo from '../assets/anthropic.svg'
import geminiLogo    from '../assets/gemini.svg'
import openrouterLogo from '../assets/openrouter.svg'

const PROVIDERS = [
  {
    id:          'openai',
    label:       'OpenAI',
    logo:        openaiLogo,
    description: 'Powers GPT-4o and GPT-4o Mini',
    keyUrl:      'https://platform.openai.com/api-keys',
    keyLabel:    'Get your key →',
    placeholder: 'sk-...',
  },
  {
    id:          'anthropic',
    label:       'Anthropic',
    logo:        anthropicLogo,
    description: 'Powers Claude Sonnet and Claude Opus',
    keyUrl:      'https://console.anthropic.com/keys',
    keyLabel:    'Get free key →',
    placeholder: 'sk-ant-...',
  },
  {
    id:          'gemini',
    label:       'Google Gemini',
    logo:        geminiLogo,
    description: 'Powers Gemini 2.5 Flash — free tier available',
    keyUrl:      'https://aistudio.google.com/app/apikey',
    keyLabel:    'Get free key →',
    placeholder: 'AIza...',
  },
  {
    id:          'openrouter',
    label:       'OpenRouter',
    logo:        openrouterLogo,
    description: 'Access 200+ models through one API',
    keyUrl:      'https://openrouter.ai/keys',
    keyLabel:    'Get your key →',
    placeholder: 'sk-or-...',
  },
]

export default function SettingsPage() {
  useDocumentTitle('Settings')

  // ── Form state
  const [keys, setKeys] = useState({ openai: '', anthropic: '', gemini: '', openrouter: '' })
  const [defaultProvider, setDefaultProvider] = useState('')
  const [showKey, setShowKey] = useState({ openai: false, anthropic: false, gemini: false, openrouter: false })
  const [savedStatus, setSavedStatus] = useState({ openai: false, anthropic: false, gemini: false, openrouter: false })
  const [saveMessage, setSaveMessage] = useState('')
  const [confirmClearAll, setConfirmClearAll] = useState(false)

  // ── Load from localStorage on mount
  useEffect(() => {
    const stored = getGlobalKeys()
    setKeys({
      openai:     stored.openai     || '',
      anthropic:  stored.anthropic  || '',
      gemini:     stored.gemini     || '',
      openrouter: stored.openrouter || '',
    })
    setDefaultProvider(stored.defaultProvider || '')
    setSavedStatus({
      openai:     !!stored.openai,
      anthropic:  !!stored.anthropic,
      gemini:     !!stored.gemini,
      openrouter: !!stored.openrouter,
    })
  }, [])

  const availableForDefault = getAvailableProviders()

  const handleSave = () => {
    saveGlobalKeys({ ...keys, defaultProvider })
    // Refresh saved status
    const stored = getGlobalKeys()
    setSavedStatus({
      openai:     !!stored.openai,
      anthropic:  !!stored.anthropic,
      gemini:     !!stored.gemini,
      openrouter: !!stored.openrouter,
    })
    setSaveMessage('Keys saved successfully')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleClearKey = async (provider) => {
    clearGlobalKey(provider)
    const clearedJobs = await clearAutomationKeys(provider)
    setKeys((prev) => ({ ...prev, [provider]: '' }))
    setSavedStatus((prev) => ({ ...prev, [provider]: false }))
    // If cleared provider was default, reset default
    if (defaultProvider === provider) {
      clearGlobalKey('defaultProvider')
      setDefaultProvider('')
    }
    setSaveMessage(
      clearedJobs > 0
        ? `Key and ${clearedJobs} scheduled job ${clearedJobs === 1 ? 'copy' : 'copies'} cleared.`
        : 'Key cleared.'
    )
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleClearAll = async () => {
    clearAllGlobalKeys()
    const clearedJobs = await clearAutomationKeys()
    setKeys({ openai: '', anthropic: '', gemini: '', openrouter: '' })
    setDefaultProvider('')
    setSavedStatus({ openai: false, anthropic: false, gemini: false, openrouter: false })
    setConfirmClearAll(false)
    setSaveMessage(
      `All saved keys and ${clearedJobs} scheduled job ${clearedJobs === 1 ? 'copy' : 'copies'} cleared.`
    )
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const toggleShow = (provider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
          <Settings size={20} className="text-zinc-600 dark:text-zinc-300" />
        </div>
        <div>
          <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">Settings</h1>
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
                  <img src={p.logo} alt={p.label} className={p.id === 'openrouter' ? "w-5 h-5 flex-shrink-0 invert dark:invert-0" : "w-5 h-5 flex-shrink-0"} />
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
                {savedStatus[p.id] && (
                  <button
                    onClick={() => handleClearKey(p.id)}
                    className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-500 transition-colors px-2 py-1 hover:bg-zinc-500/10"
                  >
                    <X size={11} />
                    Clear
                  </button>
                )}
              </div>

              {/* Input row */}
              <div className="relative">
                <input
                  aria-label={`${p.label} API key`}
                  type={showKey[p.id] ? 'text' : 'password'}
                  value={keys[p.id]}
                  onChange={(e) => setKeys((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  placeholder={savedStatus[p.id] ? '••••••••••••••••••••••••' : p.placeholder}
                  className="w-full h-9 pl-3 pr-10 text-xs font-mono transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                />
                <button
                  onClick={() => toggleShow(p.id)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  aria-label={showKey[p.id] ? 'Hide key' : 'Show key'}
                >
                  {showKey[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Description + link */}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] dark:text-text-muted text-gray-400">{p.description}</span>
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
          <h2 className="text-sm font-bold dark:text-text-primary text-gray-900">Default Provider</h2>
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
              }}
              className="w-full sm:w-64 h-9 px-3 text-sm transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary bg-gray-50 border border-gray-200 text-gray-900 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
            >
              <option value="">Select a default provider...</option>
              {availableForDefault.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
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
            <div className="flex flex-col gap-3 p-3 border border-zinc-500/20 bg-zinc-500/5">
              <p className="text-xs font-medium text-zinc-500">
                Are you sure? This removes all saved provider keys, every credential copy held by
                scheduled jobs, and your default provider preference. Scheduled jobs will stop
                authenticating until a new key is added.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold text-white bg-zinc-500 hover:bg-zinc-600 transition-colors"
                >
                  <Trash2 size={13} />
                  Yes, clear all
                </button>
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="h-8 px-3 text-xs font-medium transition-colors dark:text-text-secondary dark:hover:bg-surface-hover text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="flex items-center gap-2 h-8 px-3 text-sm font-medium transition-colors text-zinc-500 border border-zinc-500/20 hover:bg-zinc-500/10"
            >
              <Trash2 size={15} />
              Clear All Keys
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
