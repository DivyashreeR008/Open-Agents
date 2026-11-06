import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bot,
  Folder,
  GitBranch,
  Settings,
  Sliders,
  Sparkles,
  Swords,
  BarChart2,
  HelpCircle,
  Shield,
  FileText,
  CornerDownLeft,
  X,
  Layers,
} from 'lucide-react'
import { useAgents } from '../lib/useAgents'
import { useCollections } from '../lib/useCollections'
import { fetchWorkflows } from '../hooks/useWorkflows'
import { useDialogFocus } from '../hooks/useDialogFocus'

const STATIC_DESTINATIONS = [
  {
    id: 'settings-general',
    title: 'Settings',
    subtitle: 'Manage API keys, model preferences, and local data storage',
    type: 'settings',
    url: '/settings',
    icon: Settings,
    keywords: ['keys', 'api', 'openai', 'anthropic', 'gemini', 'openrouter', 'credentials'],
  },
  {
    id: 'settings-api-keys',
    title: 'API Keys & Providers',
    subtitle: 'Configure Bring-Your-Own-Key credentials for LLM providers',
    type: 'settings',
    url: '/settings',
    icon: Sliders,
    keywords: ['keys', 'token', 'openai', 'anthropic', 'google', 'gemini', 'openrouter'],
  },
  {
    id: 'page-agents',
    title: 'All Agents',
    subtitle: 'Browse the full catalog of autonomous AI agents',
    type: 'page',
    url: '/agents',
    icon: Bot,
    keywords: ['catalog', 'directory', 'index', 'browse'],
  },
  {
    id: 'page-workflows',
    title: 'Workflow Library',
    subtitle: 'Browse and run pre-built multi-agent sequential workflows',
    type: 'workflow',
    url: '/workflows',
    icon: GitBranch,
    keywords: ['chains', 'pipelines', 'library'],
  },
  {
    id: 'page-workflow-builder',
    title: 'Workflow Builder',
    subtitle: 'Design, configure, and chain multi-agent execution pipelines',
    type: 'workflow',
    url: '/workflows/build',
    icon: GitBranch,
    keywords: ['create workflow', 'chain builder', 'pipeline'],
  },
  {
    id: 'page-collections',
    title: 'Collections',
    subtitle: 'Organize agents into custom named working groups',
    type: 'collection',
    url: '/collections',
    icon: Folder,
    keywords: ['groups', 'folders', 'favorites'],
  },
  {
    id: 'page-automations',
    title: 'Automations & Scheduler',
    subtitle: 'Configure periodic and scheduled background agent execution',
    type: 'page',
    url: '/automations',
    icon: Layers,
    keywords: ['cron', 'schedule', 'periodic', 'timer'],
  },
  {
    id: 'page-suites',
    title: 'Agent Suites',
    subtitle: 'Pre-assembled role-based agent bundles (DevOps, Marketing, etc.)',
    type: 'page',
    url: '/suites',
    icon: Sparkles,
    keywords: ['bundles', 'packs', 'roles'],
  },
  {
    id: 'page-marketplace',
    title: 'Marketplace',
    subtitle: 'Explore community-shared agents and publish your own drafts',
    type: 'page',
    url: '/marketplace',
    icon: Sparkles,
    keywords: ['community', 'share', 'publish'],
  },
  {
    id: 'page-battle',
    title: 'Battle Mode',
    subtitle: 'Head-to-head blind model comparison and arena evaluation',
    type: 'page',
    url: '/battle',
    icon: Swords,
    keywords: ['arena', 'compare', 'eval', 'benchmark'],
  },
  {
    id: 'page-analytics',
    title: 'Analytics & Spend',
    subtitle: 'Track session costs, token usage, and agent run metrics',
    type: 'page',
    url: '/analytics',
    icon: BarChart2,
    keywords: ['cost', 'tokens', 'spend', 'metrics', 'stats'],
  },
  {
    id: 'page-about',
    title: 'About Open Agents',
    subtitle: 'Open-source browser-first agent runner platform information',
    type: 'page',
    url: '/about',
    icon: HelpCircle,
    keywords: ['info', 'faq', 'architecture', 'github'],
  },
  {
    id: 'page-feedback',
    title: 'Feedback & Support',
    subtitle: 'Submit feedback, feature suggestions, or security disclosures',
    type: 'page',
    url: '/feedback',
    icon: HelpCircle,
    keywords: ['bug report', 'feature request', 'contact'],
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    subtitle: 'Zero data collection, local storage security, and secret isolation',
    type: 'page',
    url: '/privacy',
    icon: Shield,
    keywords: ['security', 'local-first', 'privacy', 'telemetry'],
  },
  {
    id: 'page-terms',
    title: 'Terms of Service',
    subtitle: 'Permissive MIT open-source terms and usage agreement',
    type: 'page',
    url: '/terms',
    icon: FileText,
    keywords: ['license', 'legal', 'mit'],
  },
]

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [workflows, setWorkflows] = useState([])

  const panelRef = useRef(null)
  const backdropRef = useRef(null)
  const listboxRef = useRef(null)
  const navigate = useNavigate()

  const { agents = [] } = useAgents()
  const { collections = [] } = useCollections()

  // Trap focus while active, restore focus on close, close on Escape
  useDialogFocus(panelRef, { active: isOpen, onClose })

  // Load public workflows on mount / open
  useEffect(() => {
    if (!isOpen) return

    let mounted = true
    fetchWorkflows()
      .then(({ data }) => {
        if (mounted && Array.isArray(data)) {
          setWorkflows(data)
        }
      })
      .catch(() => {
        // Silently handle if unauthenticated / offline
      })

    return () => {
      mounted = false
    }
  }, [isOpen])

  // Reset query and selected index on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Build searchable items list
  const allItems = useMemo(() => {
    const items = [...STATIC_DESTINATIONS]

    // Collections
    for (const collection of collections) {
      const agentCount = (collection.agentIds || []).length
      items.push({
        id: `collection-${collection.id}`,
        title: collection.name,
        subtitle: `${agentCount} agent${agentCount === 1 ? '' : 's'} in collection`,
        type: 'collection',
        url: `/collections/${collection.id}`,
        icon: Folder,
        keywords: [collection.name, 'collection', 'folder'],
      })
    }

    // Workflows from database
    for (const workflow of workflows) {
      items.push({
        id: `workflow-${workflow.id}`,
        title: workflow.title,
        subtitle: workflow.description || 'Custom multi-agent workflow',
        type: 'workflow',
        url: `/workflows/${workflow.id}`,
        icon: GitBranch,
        keywords: [workflow.title, workflow.description || '', 'workflow', 'pipeline'],
      })
    }

    // Agents
    for (const agent of agents) {
      items.push({
        id: `agent-${agent.id}`,
        title: agent.name,
        subtitle: agent.description,
        category: agent.category,
        type: 'agent',
        url: `/agent/${agent.id}`,
        icon: Bot,
        keywords: [agent.name, agent.category || '', agent.description || '', agent.id],
      })
    }

    return items
  }, [agents, collections, workflows])

  // Filter items based on user query
  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      // Default / empty query: display quick jump destinations and primary pages
      return allItems.slice(0, 20)
    }

    const matches = []
    for (const item of allItems) {
      const titleLower = item.title.toLowerCase()
      const subtitleLower = (item.subtitle || '').toLowerCase()
      const categoryLower = (item.category || '').toLowerCase()
      const typeLower = item.type.toLowerCase()

      let score = 0

      if (titleLower === trimmed) {
        score = 100
      } else if (titleLower.startsWith(trimmed)) {
        score = 75
      } else if (titleLower.includes(trimmed)) {
        score = 50
      } else if (categoryLower.includes(trimmed)) {
        score = 35
      } else if (typeLower.startsWith(trimmed)) {
        score = 30
      } else if (subtitleLower.includes(trimmed)) {
        score = 20
      } else if (item.keywords?.some((k) => k.toLowerCase().includes(trimmed))) {
        score = 15
      }

      if (score > 0) {
        matches.push({ item, score })
      }
    }

    matches.sort((a, b) => b.score - a.score)
    return matches.slice(0, 30).map((m) => m.item)
  }, [allItems, query])

  // Ensure selectedIndex is always in bounds
  const clampedIndex = Math.min(
    Math.max(0, selectedIndex),
    Math.max(0, filteredItems.length - 1)
  )

  const activeOptionId =
    filteredItems.length > 0 && clampedIndex >= 0
      ? `command-palette-option-${clampedIndex}`
      : undefined

  // Scroll active item into view
  useEffect(() => {
    if (activeOptionId && listboxRef.current) {
      const activeEl = document.getElementById(activeOptionId)
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeOptionId])

  const handleSelect = useCallback(
    (item) => {
      if (!item) return
      onClose()
      navigate(item.url)
    },
    [navigate, onClose]
  )

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (filteredItems.length > 0) {
        setSelectedIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
        )
      }
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredItems[clampedIndex]) {
        handleSelect(filteredItems[clampedIndex])
      }
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === backdropRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl border border-zinc-200 bg-white shadow-pop dark:border-border dark:bg-surface-card overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Combobox Search Bar */}
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-border">
          <Search
            size={18}
            className="text-zinc-400 dark:text-text-muted shrink-0"
            aria-hidden="true"
          />
          <input
            data-autofocus
            type="text"
            role="combobox"
            aria-label="Search agents, collections, workflows, or settings"
            aria-autocomplete="list"
            aria-expanded={filteredItems.length > 0}
            aria-controls="command-palette-results"
            aria-activedescendant={activeOptionId}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search agents, collections, workflows, or settings…"
            className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-text-primary dark:placeholder:text-text-muted"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSelectedIndex(0)
              }}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-text-primary"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[11px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 dark:bg-surface-input dark:border-border dark:text-text-muted">
              Esc
            </kbd>
          )}
        </div>

        {/* Results Listbox */}
        <div
          ref={listboxRef}
          id="command-palette-results"
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto p-2 space-y-0.5"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500 dark:text-text-secondary">
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-text-muted">
                Try searching for an agent name, collection, workflow, or settings page.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = clampedIndex === index
              const IconComponent = item.icon || Bot

              return (
                <div
                  key={item.id}
                  id={`command-palette-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-surface-hover text-zinc-900 dark:text-text-primary'
                      : 'text-zinc-700 dark:text-text-secondary hover:bg-zinc-50 dark:hover:bg-surface-hover/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
                      <IconComponent size={14} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-medium text-zinc-900 dark:text-text-primary">
                          {item.title}
                        </span>
                        {item.category && (
                          <span className="hidden sm:inline-block text-[10px] text-zinc-400 dark:text-text-muted font-mono">
                            ({item.category})
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="truncate text-[11px] text-zinc-500 dark:text-text-secondary">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-zinc-200 dark:border-border text-zinc-500 dark:text-text-muted">
                      {item.type}
                    </span>
                    {isSelected && (
                      <CornerDownLeft
                        size={13}
                        className="text-zinc-400 dark:text-text-muted"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-400 dark:border-border dark:text-text-muted bg-zinc-50/50 dark:bg-surface-card">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono">esc</kbd> Close
            </span>
          </div>
          <span className="tabular-nums">
            {filteredItems.length} result{filteredItems.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  )
}
