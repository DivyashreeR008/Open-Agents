import { useEffect, useState, useRef } from 'react'
import { useTimedState } from '../lib/useTimedState'
import { X, Search, Star, Trash2, Copy, Check, RotateCcw, History } from 'lucide-react'
import { usePromptHistory } from '../lib/usePromptHistory'
import { useDialogFocus } from '../hooks/useDialogFocus'
import { formatExactTime, formatRelativeTime, useNow } from '../lib/formatting'

function truncate(text, max = 140) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trim() + '…' : text
}

function PromptItem({ entry, now, onUse, onToggleFavorite, onDelete, onCopy, copied }) {
  return (
    <div className="group border p-3 dark:bg-surface-input dark:border-border bg-gray-50 border-gray-200 transition-colors hover:border-zinc-400">
      <p className="text-xs dark:text-text-primary text-gray-800 leading-relaxed mb-2 whitespace-pre-wrap">
        {truncate(entry.text)}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] dark:text-text-muted text-gray-400">
          {entry.agentName && (
            <span className="px-1.5 py-0.5 dark:bg-surface-hover bg-gray-100">
              {entry.agentName}
            </span>
          )}
          <time title={formatExactTime(entry.createdAt)}>
            {formatRelativeTime(entry.createdAt, now)}
          </time>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onUse(entry)}
            title="Use this prompt"
            aria-label="Use this prompt"
            className="p-1 dark:text-text-muted text-gray-500 hover:text-black hover:bg-zinc-500/10 dark:hover:text-white transition-colors"
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onCopy(entry)}
            title={copied ? 'Copied' : 'Copy to clipboard'}
            aria-label={copied ? 'Copied' : 'Copy prompt to clipboard'}
            className="p-1 dark:text-text-muted text-gray-500 hover:text-black hover:bg-zinc-500/10 dark:hover:text-white transition-colors"
          >
            {copied ? (
              <Check size={13} aria-hidden="true" />
            ) : (
              <Copy size={13} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(entry.id)}
            title={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={Boolean(entry.favorite)}
            className={`p-1 transition-colors ${
              entry.favorite
                ? 'text-zinc-400 hover:text-zinc-300'
                : 'dark:text-text-muted text-gray-500 hover:text-zinc-400'
            }`}
          >
            <Star size={13} aria-hidden="true" className={entry.favorite ? 'fill-zinc-400' : ''} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            title="Delete"
            aria-label="Delete prompt"
            className="p-1 dark:text-text-muted text-gray-500 hover:text-zinc-500 hover:bg-zinc-500/10 transition-colors"
          >
            <Trash2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Slide-over panel for browsing, searching, favoriting, and reusing
 * saved prompts across any agent.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {(text: string) => void} onUsePrompt - called with the prompt text when "Use" is clicked
 */
export default function PromptHistoryPanel({ open, onClose, onUsePrompt }) {
  const { prompts, favorites, deletePrompt, clearHistory, toggleFavorite, searchPrompts } =
    usePromptHistory()
  const now = useNow()
  const [query, setQuery] = useState('')
  const [copiedId, setCopiedId] = useTimedState(null, open)
  const [copyError, setCopyError] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)
  const panelRef = useRef(null)

  useDialogFocus(panelRef, { active: open, onClose })

  useEffect(() => {
    if (open) setCopyError('')
  }, [open])

  if (!open) return null

  const nonFavorites = prompts.filter((p) => !p.favorite)
  const filteredFavorites = query ? searchPrompts(query).filter((p) => p.favorite) : favorites
  const filteredHistory = query ? searchPrompts(query).filter((p) => !p.favorite) : nonFavorites

  const handleUse = (entry) => {
    onUsePrompt(entry.text)
    onClose()
  }

  const handleCopy = async (entry) => {
    try {
      await navigator.clipboard.writeText(entry.text)
      setCopyError('')
      setCopiedId(entry.id, 1500)
    } catch {
      setCopyError('Copy failed. Select the prompt text to copy it manually.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-history-title"
        className="relative w-full max-w-sm h-full dark:bg-surface-card bg-white border-l dark:border-border border-gray-200 shadow-pop flex flex-col animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-border border-gray-200">
          <div className="flex items-center gap-2">
            <History size={16} className="text-zinc-900 dark:text-white" aria-hidden="true" />
            <h2
              id="prompt-history-title"
              className="text-sm font-semibold dark:text-text-primary text-gray-900"
            >
              Prompt History
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close prompt history"
            className="p-1.5 dark:text-text-muted text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b dark:border-border border-gray-200">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-400"
            />
            <input
              aria-label="Search prompts"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full h-8 pl-8 pr-3 text-xs transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          <p role="status" className="sr-only">
            {copiedId ? 'Prompt copied to clipboard.' : ''}
          </p>
          {copyError && (
            <p role="alert" className="text-xs text-red-700 dark:text-red-300">
              {copyError}
            </p>
          )}
          {prompts.length === 0 && (
            <p className="text-xs dark:text-text-muted text-gray-400 text-center py-8">
              No saved prompts yet. Save a prompt from any agent to see it here.
            </p>
          )}

          {filteredFavorites.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider dark:text-text-muted text-gray-400 mb-2 flex items-center gap-1">
                <Star size={11} className="fill-zinc-400 text-zinc-400" />
                Favorites
              </h3>
              <div className="space-y-2">
                {filteredFavorites.map((entry) => (
                  <PromptItem
                    key={entry.id}
                    entry={entry}
                    now={now}
                    onUse={handleUse}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deletePrompt}
                    onCopy={handleCopy}
                    copied={copiedId === entry.id}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider dark:text-text-muted text-gray-400">
                  History
                </h3>
                {!query &&
                  nonFavorites.length > 0 &&
                  (confirmClear ? (
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] dark:text-text-muted text-gray-400">
                        Clear {nonFavorites.length} prompts?
                      </span>
                      <button
                        onClick={() => {
                          clearHistory()
                          setConfirmClear(false)
                        }}
                        className="text-[10px] font-semibold text-zinc-500 hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmClear(false)}
                        className="text-[10px] text-zinc-900 hover:underline dark:text-white"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmClear(true)}
                      className="text-[10px] text-zinc-900 hover:underline dark:text-white"
                    >
                      Clear all
                    </button>
                  ))}
              </div>
              <div className="space-y-2">
                {filteredHistory.map((entry) => (
                  <PromptItem
                    key={entry.id}
                    entry={entry}
                    now={now}
                    onUse={handleUse}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deletePrompt}
                    onCopy={handleCopy}
                    copied={copiedId === entry.id}
                  />
                ))}
              </div>
            </div>
          )}

          {query && filteredFavorites.length === 0 && filteredHistory.length === 0 && (
            <p className="text-xs dark:text-text-muted text-gray-400 text-center py-8">
              No prompts match "{query}".
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
