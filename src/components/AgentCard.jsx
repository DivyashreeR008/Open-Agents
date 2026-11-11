/**
 * AgentCard renders a single agent in the library.
 *
 * Two variants:
 *  - "grid": a flat square tile with a hairline border and a provider footer.
 *  - "row" (catalogue default): a numbered line in the printed index, with
 *    every field on a shared baseline so the column reads as a table.
 *
 * Both are draggable so agents can be dropped onto a sidebar collection.
 */

import { Link } from 'react-router-dom'
import { ArrowRight, FolderPlus, Star, Copy, Check } from 'lucide-react'
import { useFavorites } from '../lib/useFavorites'
import { useId, useState } from 'react'
import { useTimedState } from '../lib/useTimedState'
import CollectionPicker from './CollectionPicker'
import HighlightedText from './HighlightedText'
import { resolveAgentIcon } from '../lib/agentIcons'

const providerMeta = {
  openai: { label: 'OpenAI', dot: 'bg-zinc-500' },
  anthropic: { label: 'Anthropic', dot: 'bg-zinc-400' },
  gemini: { label: 'Gemini', dot: 'bg-zinc-500' },
  openrouter: { label: 'OpenRouter', dot: 'bg-zinc-500' },
  any: { label: 'Any provider', dot: 'bg-zinc-500' },
}

function isWithinLast7Days(dateStr) {
  if (!dateStr) return false
  const created = new Date(dateStr)
  if (Number.isNaN(created.getTime())) return false
  const diffMs = Date.now() - created
  return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000
}

function formatMatchList(fields) {
  if (fields.length < 2) return fields[0] ?? ''
  if (fields.length === 2) return `${fields[0]} and ${fields[1]}`
  return `${fields.slice(0, -1).join(', ')}, and ${fields[fields.length - 1]}`
}

export default function AgentCard({ agent, variant = 'grid', index = null, searchQuery = '' }) {
  const IconComponent = resolveAgentIcon(agent?.icon)
  const provider = providerMeta[agent?.provider] || providerMeta.any
  const { isFavorite, toggleFavorite } = useFavorites()
  const [showCollectionPicker, setShowCollectionPicker] = useState(false)
  const favorited = isFavorite(agent.id)
  const [copied, setCopied] = useTimedState(false)

  const name = agent?.name || 'Unnamed agent'
  const description = agent?.description || 'No description provided.'
  const matchDescriptionId = useId()
  const query = String(searchQuery ?? '').trim()
  const normalizedQuery = query.toLowerCase()
  const hasQuery = query.length > 0
  const matchedFields = []

  if (hasQuery) {
    if (agent?.name && String(agent.name).toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('name')
    }
    if (agent?.description && String(agent.description).toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('description')
    }
    if (agent?.category && String(agent.category).toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('category')
    }
    if (provider.label.toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('provider')
    }
    if (agent?.id && String(agent.id).toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('agent ID')
    }
    if (agent?.model && String(agent.model).toLowerCase().includes(normalizedQuery)) {
      matchedFields.push('model')
    }
  }

  const showMatchDescription = hasQuery && matchedFields.length > 0
  const matchDescription = showMatchDescription
    ? `Matches search "${query}" in ${formatMatchList(matchedFields)}.`
    : ''

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', agent.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(agent.id)
  }

  const handleCollectionPicker = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowCollectionPicker(true)
  }

  const handleCopyPrompt = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = agent?.systemPrompt || agent?.description || ''
    if (!text) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true, 1500)
    } catch {
      // Clipboard unavailable — stay silent rather than showing a broken toast.
    }
  }

  /** Row actions are hidden until hover so the list stays scannable. */
  const actions = (
    <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      <button
        onClick={handleCopyPrompt}
        className="btn-icon h-6 w-6"
        aria-label={copied ? 'Prompt copied' : 'Copy prompt'}
        title={copied ? 'Copied' : 'Copy prompt'}
      >
        {copied ? <Check size={13} className="text-zinc-500" /> : <Copy size={13} />}
      </button>
      <button
        onClick={handleCollectionPicker}
        className="btn-icon h-6 w-6"
        aria-label="Add to collection"
        title="Add to collection"
      >
        <FolderPlus size={13} />
      </button>
      <button
        onClick={handleFavorite}
        className={`btn-icon h-6 w-6 ${favorited ? 'text-zinc-400' : ''}`}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star size={13} className={favorited ? 'fill-zinc-400' : ''} />
      </button>
    </span>
  )

  const picker = showCollectionPicker && (
    <CollectionPicker agentId={agent.id} onClose={() => setShowCollectionPicker(false)} />
  )

  if (variant === 'row') {
    return (
      <>
        <Link
          to={`/agent/${agent.id}`}
          draggable
          onDragStart={handleDragStart}
          aria-describedby={showMatchDescription ? matchDescriptionId : undefined}
          className="index-row group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/60 dark:focus-visible:ring-white/60"
        >
          <span className="idx" aria-hidden="true">
            {index == null ? '—' : String(index).padStart(3, '0')}
          </span>

          <IconComponent
            size={14}
            className="shrink-0 text-zinc-400 dark:text-text-muted"
            aria-hidden="true"
          />

          <span className="w-44 shrink-0 truncate text-[13.5px] font-medium text-zinc-900 dark:text-text-primary sm:w-60">
            <HighlightedText text={name} query={agent?.name ? query : ''} />
          </span>

          <span className="hidden min-w-0 flex-1 truncate text-xs text-zinc-500 sm:block dark:text-text-secondary">
            <HighlightedText text={description} query={agent?.description ? query : ''} />
          </span>

          <span className="eyebrow ml-auto hidden shrink-0 lg:block">
            <HighlightedText text={agent?.category} query={query} />
          </span>

          <span className="badge hidden shrink-0 items-center gap-1.5 sm:inline-flex">
            <span className={`h-1.5 w-1.5 ${provider.dot}`} aria-hidden="true" />
            <HighlightedText text={provider.label} query={query} />
          </span>

          {actions}

          <ArrowRight
            size={13}
            className="shrink-0 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-text-muted"
            aria-hidden="true"
          />
        </Link>
        {showMatchDescription && (
          <span id={matchDescriptionId} className="sr-only">
            {matchDescription}
          </span>
        )}
        {picker}
      </>
    )
  }

  return (
    <>
      <Link
        to={`/agent/${agent.id}`}
        draggable
        onDragStart={handleDragStart}
        aria-describedby={showMatchDescription ? matchDescriptionId : undefined}
        className="group flex cursor-grab flex-col border border-zinc-200 bg-white p-4 transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 dark:border-border dark:bg-surface-card dark:hover:border-white dark:focus-visible:ring-white/60"
      >
        <div className="flex items-start gap-3">
          <span className="mt-px flex h-7 w-7 shrink-0 items-center justify-center border border-zinc-200 text-zinc-500 dark:border-border dark:text-text-secondary">
            <IconComponent size={14} aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[14px] font-semibold leading-5 tracking-[-0.01em] text-zinc-900 dark:text-text-primary">
              <HighlightedText text={name} query={agent?.name ? query : ''} />
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="eyebrow truncate">
                <HighlightedText text={agent?.category} query={query} />
              </span>
              {isWithinLast7Days(agent?.createdAt) && <span className="badge">new</span>}
            </div>
          </div>

          {actions}
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
          <HighlightedText text={description} query={agent?.description ? query : ''} />
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-2.5 dark:border-border">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 dark:text-text-muted">
            <span className={`h-1.5 w-1.5 ${provider.dot}`} aria-hidden="true" />
            <HighlightedText text={provider.label} query={query} />
          </span>

          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-text-secondary">
            Open
            <ArrowRight size={11} aria-hidden="true" />
          </span>
        </div>
      </Link>
      {showMatchDescription && (
        <span id={matchDescriptionId} className="sr-only">
          {matchDescription}
        </span>
      )}
      {picker}
    </>
  )
}
