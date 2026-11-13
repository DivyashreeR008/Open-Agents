import { useState, useEffect, useMemo } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { resolveAgentIcon } from '../lib/agentIcons'
import { DEFAULT_COLLECTION_ID, useCollections } from '../lib/useCollections'
import { useAgents } from '../lib/useAgents'

const SIDEBAR_CATEGORY_STORAGE_KEY = 'sidebar-category-collapsed-state'
const SIDEBAR_CATEGORY_AGENT_LIMIT = 12
const SIDEBAR_SEARCH_LIMIT = 15

function useDesktopSidebar() {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' && Boolean(window.matchMedia?.('(min-width: 1024px)').matches)
  )

  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 1024px)')
    if (!media) return undefined
    const update = (event) => setIsDesktop(event.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return isDesktop
}

/** Zero-padded ordinal so every entry has a stable address in the index. */
const pad = (n) => String(n).padStart(2, '0')

function formatCollectionList(names) {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

const WORKSPACE_ENTRIES = [
  { to: '/workflows', id: 'nav-workflows-link', icon: 'Workflow', label: 'Workflows' },
  { to: '/suites', icon: 'LibraryBig', label: 'Suites' },
  { to: '/battle', id: 'nav-battle-link', icon: 'Swords', label: 'Battle' },
  { to: '/automations', icon: 'Clock', label: 'Automations' },
  { to: '/analytics', icon: 'BarChart3', label: 'Analytics' },
  { to: '/marketplace', icon: 'Store', label: 'Marketplace' },
]

/**
 * Secondary rail — the app's table of contents.
 *
 * Laid out like a printed index rather than a nav of pill buttons: numbered
 * chapters, hairline rules between entries, and no containing boxes. The
 * active row inverts to a solid block so the reader's position is obvious
 * without relying on hue.
 */
export default function Sidebar({ open, onClose }) {
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('')
  // Stores COLLAPSED state per category. Categories default to collapsed so
  // the rail stays small even with hundreds of agents; the active category is
  // expanded automatically.
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_CATEGORY_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })
  const [feedback, setFeedback] = useState('')
  const { collections, moveAgentToCollection } = useCollections()
  const { agents } = useAgents()
  const location = useLocation()
  const isDesktop = useDesktopSidebar()

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_CATEGORY_STORAGE_KEY, JSON.stringify(collapsedCategories))
    } catch {
      // localStorage unavailable (e.g. private browsing) — fail silently
    }
  }, [collapsedCategories])

  const currentAgentId = location.pathname.startsWith('/agent/')
    ? location.pathname.split('/agent/')[1]
    : null

  const activeCollectionId = new URLSearchParams(location.search).get('collection')
  const activeAgent = agents.find((a) => a.id === currentAgentId)
  const activeCategory = activeAgent ? activeAgent.category : null

  const normalizedQuery = sidebarSearchQuery.trim().toLowerCase()
  const isSearching = normalizedQuery !== ''
  const routeParams = new URLSearchParams(location.search)
  const isAgentsRoute = location.pathname === '/agents'
  const routeQuery = isAgentsRoute ? (routeParams.get('q') || '').trim().toLowerCase() : ''
  const routeCategory = isAgentsRoute ? routeParams.get('category') : null
  const routeProvider = isAgentsRoute ? routeParams.get('provider') : null
  const effectiveQuery = isSearching ? normalizedQuery : routeQuery
  const effectiveCategory = isSearching ? null : routeCategory
  const effectiveProvider = isSearching ? null : routeProvider

  const { filteredAgents, categories, categoryOrder } = useMemo(() => {
    const filtered = agents.filter((agent) => {
      if (effectiveCategory && agent.category !== effectiveCategory) return false
      if (effectiveProvider && agent.provider !== effectiveProvider) return false
      if (!effectiveQuery) return true
      return [agent.name, agent.description, agent.category, agent.id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(effectiveQuery)
    })

    const cats = filtered.reduce((acc, agent) => {
      if (!acc[agent.category]) acc[agent.category] = []
      acc[agent.category].push(agent)
      return acc
    }, {})

    Object.values(cats).forEach((categoryAgents) => {
      categoryAgents.sort((a, b) => a.name.localeCompare(b.name))
    })

    return {
      filteredAgents: filtered,
      categories: cats,
      categoryOrder: Object.keys(cats).sort((a, b) => a.localeCompare(b)),
    }
  }, [agents, effectiveQuery, effectiveCategory, effectiveProvider])

  const toggleCategory = (category) => {
    const isActive = activeCategory === category
    setCollapsedCategories((prev) => {
      const isExpanded = isActive ? prev[category] !== true : prev[category] === false
      return {
        ...prev,
        [category]: isExpanded,
      }
    })
  }

  const handleCollectionDrop = (event, collectionId) => {
    event.preventDefault()
    const agentId = event.dataTransfer.getData('text/plain')
    if (!agentId) return

    const collection = collections.find((item) => item.id === collectionId)
    const result = moveAgentToCollection(agentId, collectionId)
    const destination = collection?.name || 'the selected collection'
    const sources = (result.movedFrom || []).map((item) => item.name).filter(Boolean)
    const sourceText = sources.length > 0 ? ` from ${formatCollectionList(sources)}` : ''

    setFeedback(result.ok ? `Moved to ${destination}${sourceText}.` : result.error)

    window.setTimeout(() => setFeedback(''), 2200)
  }

  const customCollections = collections.filter(
    (collection) => collection.id !== DEFAULT_COLLECTION_ID
  )
  const allAgentsCount = filteredAgents.length
  const isDrawerHidden = !isDesktop && !open

  const collectionEntries = [
    { key: 'all', to: '/collections', icon: 'FolderPlus', label: 'All collections', count: null },
    {
      key: 'agents',
      to: '/agents',
      icon: 'FolderInput',
      label: 'All agents',
      count: allAgentsCount,
      collectionId: DEFAULT_COLLECTION_ID,
      active: location.pathname === '/agents' && !activeCollectionId,
    },
    ...customCollections.map((collection) => ({
      key: collection.id,
      to: `/agents?collection=${collection.id}`,
      icon: 'Folder',
      label: collection.name,
      count: collection.agentIds.length,
      collectionId: collection.id,
      active: location.pathname === '/agents' && activeCollectionId === collection.id,
    })),
  ]

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside
        inert={isDrawerHidden ? true : undefined}
        aria-hidden={isDrawerHidden || undefined}
        className={`fixed top-12 left-0 bottom-0 z-40 flex w-60 flex-col border-r transition-all duration-200
          dark:border-border border-zinc-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="absolute inset-0 -z-10 bg-white dark:bg-surface" />

        {/* ── Masthead: label, count, search ──────────────────────────── */}
        <div className="px-3 pb-2.5 pt-3.5" data-tour="sidebar-agents">
          <div className="rule-head mb-2">Index</div>

          <div className="group relative">
            <Icons.Search
              size={13}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-900 dark:text-text-muted dark:group-focus-within:text-white"
            />
            <input
              type="text"
              placeholder="Search agents…"
              aria-label="Search agents"
              value={sidebarSearchQuery}
              onChange={(e) => setSidebarSearchQuery(e.target.value)}
              className="field h-7 pl-7 pr-7 text-[12px]"
            />
            {sidebarSearchQuery && (
              <button
                type="button"
                onClick={() => setSidebarSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
              >
                <Icons.X size={13} />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {/* ── 01 Workspace ─────────────────────────────────────────── */}
          <div className="mb-1 mt-1 flex items-center gap-2">
            <span className="chap">01</span>
            <span className="eyebrow">Workspace</span>
          </div>

          {WORKSPACE_ENTRIES.map((entry, i) => {
            const IconComponent = Icons[entry.icon] || Icons.Circle
            return (
              <NavLink
                key={entry.to}
                to={entry.to}
                id={entry.id}
                onClick={onClose}
                className={({ isActive }) => `rail-link ${isActive ? 'rail-link-active' : ''}`}
              >
                <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums opacity-45">
                  {pad(i + 1)}
                </span>
                <IconComponent size={14} className="shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{entry.label}</span>
              </NavLink>
            )
          })}

          {/* ── 02 Collections ───────────────────────────────────────── */}
          <div className="mb-1 mt-5 flex items-center gap-2">
            <span className="chap">02</span>
            <span className="eyebrow">Collections</span>
          </div>

          {feedback && (
            <div className="mb-1 border-l-2 border-black bg-zinc-100 px-2 py-1.5 text-[11px] text-black dark:border-white dark:bg-white/10 dark:text-white">
              {feedback}
            </div>
          )}

          {collectionEntries.map((entry, i) => {
            const IconComponent = Icons[entry.icon] || Icons.Folder
            const isActive =
              entry.active ?? (entry.to === '/collections' && location.pathname === '/collections')

            return (
              <Link
                key={entry.key}
                to={entry.to}
                onClick={onClose}
                onDragOver={(event) => event.preventDefault()}
                onDrop={
                  entry.collectionId
                    ? (event) => handleCollectionDrop(event, entry.collectionId)
                    : undefined
                }
                className={`rail-link ${isActive ? 'rail-link-active' : ''}`}
              >
                <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums opacity-45">
                  {pad(i + 1)}
                </span>
                <IconComponent size={14} className="shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                {entry.count != null && (
                  <span className="ml-auto font-mono text-[10px] tabular-nums opacity-55">
                    {entry.count}
                  </span>
                )}
              </Link>
            )
          })}

          {/* ── 03 Browse / search results ───────────────────────────── */}
          <div className="mb-1 mt-5 flex items-center gap-2">
            <span className="chap">03</span>
            <span className="eyebrow">{isSearching ? 'Search results' : 'By category'}</span>
            <span className="ml-auto font-mono text-[10px] tabular-nums text-zinc-300 dark:text-text-muted">
              {isSearching ? filteredAgents.length : categoryOrder.length}
            </span>
          </div>

          {isSearching ? (
            <>
              {filteredAgents.slice(0, SIDEBAR_SEARCH_LIMIT).map((agent, index) => {
                const IconComponent = resolveAgentIcon(agent.icon)

                return (
                  <NavLink
                    key={agent.id}
                    to={`/agent/${agent.id}`}
                    onClick={onClose}
                    title={`${agent.name} · ${agent.category}`}
                    className={({ isActive }) =>
                      `group flex items-center gap-2 border-b border-zinc-200/70 py-1.5 pl-0.5 pr-2 text-[12.5px] transition-colors dark:border-border/70 ${
                        isActive
                          ? 'font-medium text-black dark:text-white'
                          : 'text-zinc-500 hover:text-black dark:text-text-secondary dark:hover:text-text-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="w-5 shrink-0 font-mono text-[9px] tabular-nums opacity-45">
                          {pad(index + 1)}
                        </span>
                        <IconComponent size={13} className="shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{agent.name}</span>
                        {isActive && (
                          <span className="font-mono text-[10px] opacity-60" aria-hidden="true">
                            ●
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}

              {filteredAgents.length > SIDEBAR_SEARCH_LIMIT && (
                <Link
                  to={`/agents?q=${encodeURIComponent(sidebarSearchQuery.trim())}`}
                  onClick={onClose}
                  className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
                >
                  View all {filteredAgents.length} matches
                  <Icons.ArrowRight size={11} aria-hidden="true" />
                </Link>
              )}

              {filteredAgents.length === 0 && (
                <div className="py-6 text-center font-mono text-[11px] text-zinc-400 dark:text-text-muted">
                  no entries
                </div>
              )}
            </>
          ) : (
            categoryOrder.map((category, index) => {
              const isActiveCategory = activeCategory === category
              const isCategoryExpanded = isActiveCategory
                ? collapsedCategories[category] !== true
                : collapsedCategories[category] === false
              const categoryAgents = categories[category]
              const visibleCategoryAgents = categoryAgents.slice(0, SIDEBAR_CATEGORY_AGENT_LIMIT)

              return (
                <div key={category}>
                  <button
                    id={`sidebar-category-${index}`}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    aria-expanded={isCategoryExpanded}
                    aria-controls={`sidebar-category-panel-${index}`}
                    className={`rail-link w-full ${
                      isActiveCategory ? 'text-black dark:text-white' : ''
                    }`}
                  >
                    <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums opacity-45">
                      {pad(index + 1)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-left font-medium">
                      {category}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums opacity-55">
                      {categoryAgents.length}
                    </span>
                    {isCategoryExpanded ? (
                      <Icons.Minus size={11} className="shrink-0 opacity-50" aria-hidden="true" />
                    ) : (
                      <Icons.Plus size={11} className="shrink-0 opacity-50" aria-hidden="true" />
                    )}
                  </button>

                  {isCategoryExpanded && (
                    <div
                      id={`sidebar-category-panel-${index}`}
                      role="group"
                      aria-labelledby={`sidebar-category-${index}`}
                      className="border-l border-zinc-200 py-1 pl-2 dark:border-border"
                    >
                      {visibleCategoryAgents.map((agent, agentIndex) => {
                        const IconComponent = resolveAgentIcon(agent.icon)

                        return (
                          <NavLink
                            key={agent.id}
                            to={`/agent/${agent.id}`}
                            onClick={onClose}
                            title={`${agent.name} · ${agent.category}`}
                            className={({ isActive }) =>
                              `group flex items-center gap-2 py-1 pl-1.5 pr-1 text-[12.5px] transition-colors ${
                                isActive
                                  ? 'font-medium text-black dark:text-white'
                                  : 'text-zinc-500 hover:text-black dark:text-text-secondary dark:hover:text-text-primary'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span className="w-6 shrink-0 font-mono text-[9px] tabular-nums opacity-45">
                                  {pad(index + 1)}.{pad(agentIndex + 1)}
                                </span>
                                <IconComponent size={13} className="shrink-0" aria-hidden="true" />
                                <span className="truncate">{agent.name}</span>
                                {isActive && (
                                  <span
                                    className="ml-auto font-mono text-[10px] opacity-60"
                                    aria-hidden="true"
                                  >
                                    ●
                                  </span>
                                )}
                              </>
                            )}
                          </NavLink>
                        )
                      })}

                      {categoryAgents.length > SIDEBAR_CATEGORY_AGENT_LIMIT && (
                        <Link
                          to={`/agents?category=${encodeURIComponent(category)}`}
                          onClick={onClose}
                          className="mt-1.5 inline-flex items-center gap-1.5 pl-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
                        >
                          View all {categoryAgents.length}
                          <Icons.ArrowRight size={11} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </nav>

        {/* ── Colophon ─────────────────────────────────────────────────── */}
        <div className="border-t border-zinc-200 px-3 py-2.5 dark:border-border">
          <div className="rule-head mb-1.5">Colophon</div>
          <div className="flex flex-col gap-0.5">
            <a
              href="https://github.com/DivyashreeR008/Open-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
            >
              GitHub <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a
              href="https://github.com/DivyashreeR008/Open-Agents/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
            >
              Contribute <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <Link
              to="/feedback"
              onClick={() => onClose?.()}
              className="font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
            >
              Feedback →
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
