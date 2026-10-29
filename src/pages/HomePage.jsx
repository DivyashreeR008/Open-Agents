import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronDown, Github, Search, X, Star, History, Swords, GitBranch, Lightbulb, LayoutGrid, Rows3, ExternalLink } from 'lucide-react'
import AgentCardSkeleton from '../components/AgentCardSkeleton'
import AgentCard from '../components/AgentCard'
import { useFavorites } from '../lib/useFavorites'
import { useHistory } from '../lib/useHistory'
import RecentRuns from '../components/RecentRuns'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useAgents } from '../lib/useAgents'
import { useProgressiveList } from '../lib/useProgressiveList'
import RecommendationWizardEntry from '../components/recommendation/RecommendationWizardEntry'
import { DEFAULT_COLLECTION_ID, useCollections } from '../lib/useCollections'
import RecommendationWizardModal from '../components/recommendation/RecommendationWizardModal'
import { getGlobalKeys } from '../lib/globalKeys'
import Logo from '../components/Logo'

const providerLabels = {
  any: 'Any Provider',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  openrouter: 'OpenRouter',
}

const CATALOG_PAGE_SIZE = 60

/** A filter is a word, not a pill: active options invert to a solid block. */
function RailOption({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`shrink-0 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
        selected
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'text-zinc-500 hover:text-black dark:text-text-muted dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { agents, loading: agentsLoading, catalogSize } = useAgents()
  const [isRecommendationWizardOpen, setIsRecommendationWizardOpen] = useState(false)
  const recommendationWizardHeroTriggerRef = useRef(null)
  const recommendationWizardReturnFocusRef = useRef(null)
  const [viewMode, setViewMode] = useState('index')
  const [searchParams, setSearchParams] = useSearchParams()
  const { collections, getAgentCollectionId } = useCollections()

  // Filters live in the URL so a search or category can be linked to directly.
  const searchQuery = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || null
  const selectedProvider = searchParams.get('provider') || null

  const updateFilter = (key, value) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  const setSearchQuery = (value) => updateFilter('q', value)
  const setSelectedCategory = (value) => updateFilter('category', value)
  const setSelectedProvider = (value) => updateFilter('provider', value)

  // ── First-time banner: show only if no global keys saved and not dismissed
  const [showBanner, setShowBanner] = useState(() => {
    if (localStorage.getItem('OpenAgents_banner_dismissed') === 'true') return false
    const keys = getGlobalKeys()
    return !keys.openai && !keys.anthropic && !keys.gemini && !keys.openrouter
  })

  const dismissBanner = () => {
    localStorage.setItem('OpenAgents_banner_dismissed', 'true')
    setShowBanner(false)
  }
  const allCategories = useMemo(() => {
    return [...new Set(agents.map((a) => a.category))].sort()
  }, [agents])

  const categoryCounts = useMemo(() => {
    const counts = {}
    agents.forEach((agent) => {
      counts[agent.category] = (counts[agent.category] || 0) + 1
    })
    return counts
  }, [agents])

  const dropdownOptions = useMemo(() => {
    return [
      { value: null, label: 'All Categories', count: agents.length },
      ...allCategories.map((cat) => ({
        value: cat,
        label: cat,
        count: categoryCounts[cat] || 0,
      })),
    ]
  }, [allCategories, categoryCounts, agents.length])

  const allProviders = useMemo(() => {
    return [...new Set(agents.map((agent) => agent.provider || 'any'))].sort((a, b) => {
      return (providerLabels[a] || a).localeCompare(providerLabels[b] || b)
    })
  }, [agents])

  const providerCounts = useMemo(() => {
    const counts = {}
    agents.forEach((agent) => {
      const provider = agent.provider || 'any'
      counts[provider] = (counts[provider] || 0) + 1
    })
    return counts
  }, [agents])

  const providerOptions = useMemo(() => {
    return [
      { value: null, label: 'All Providers', count: agents.length },
      ...allProviders.map((provider) => ({
        value: provider,
        label: providerLabels[provider] || provider,
        count: providerCounts[provider] || 0,
      })),
    ]
  }, [allProviders, providerCounts, agents.length])

  useDocumentTitle()

  // The global navbar search can arrive before this lazy-loaded page exists.
  // Focus now that the input is mounted so the user can type immediately.
  useEffect(() => {
    if (!location.state?.focusSearch) return
    document.getElementById('agent-search')?.focus()
  }, [location.state])

  useKeyboardShortcuts({
    '/': (e) => {
      e.preventDefault();
      document.getElementById('agent-search')?.focus();
    },
  });

  const { favorites } = useFavorites()
  const { history, deleteRun, clearHistory } = useHistory()
  const activeCollectionId = searchParams.get('collection') || DEFAULT_COLLECTION_ID
  const selectedCollection = collections.find(
    (collection) => collection.id === activeCollectionId
  )

  const recentAgents = useMemo(() => {
    const recentIds = JSON.parse(
      localStorage.getItem('recentAgents') || '[]'
    )

    return recentIds
      .map((id) => agents.find((a) => a.id === id))
      .filter(Boolean)
  }, [agents])

  // Resolve favorite agents (preserving the user's star order)
  const favoriteAgents = useMemo(() => {
    return favorites
      .map((id) => agents.find((a) => a.id === id))
      .filter(Boolean)
  }, [favorites, agents])

  // Filter agents based on search + category
  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    // Judge membership by the collection's own list so a duplicated or
    // imported collection that shares agents with another still shows them.
    const activeCollection = collections.find((c) => c.id === activeCollectionId)

    return agents.filter((agent) => {
      const matchesCategory = !selectedCategory || agent.category === selectedCategory
      if (!matchesCategory) return false

      const provider = agent.provider || 'any'
      const matchesProvider = !selectedProvider || provider === selectedProvider
      if (!matchesProvider) return false

      const matchesCollection =
        activeCollectionId === DEFAULT_COLLECTION_ID
          ? true
          : activeCollection
            ? activeCollection.agentIds.includes(agent.id)
            : getAgentCollectionId(agent.id) === activeCollectionId

      if (!matchesCollection) return false

      if (!q) return true

      const searchableText = [
        agent.name,
        agent.description,
        agent.category,
        agent.id,
        agent.model,
        providerLabels[provider],
        provider,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(q)
    })
  }, [activeCollectionId, agents, collections, getAgentCollectionId, searchQuery, selectedCategory, selectedProvider])

  const {
    visibleItems: visibleAgents,
    visibleCount,
    total: filteredCount,
    hasMore,
    remaining,
    showMore,
  } = useProgressiveList(filteredAgents, {
    pageSize: CATALOG_PAGE_SIZE,
    resetKey: [searchQuery, selectedCategory, selectedProvider, activeCollectionId].join('|'),
  })

  const handleOpenRecommendationWizard = (event) => {
    event?.preventDefault()
    if (event?.currentTarget) recommendationWizardReturnFocusRef.current = event.currentTarget
    setIsRecommendationWizardOpen(true)
  }

  const handleRerun = (run) => {
    navigate(`/agent/${run.agentId}`, { state: { prefill: run.inputs } })
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard API unavailable — fall back to hidden textarea
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      } catch {
        // Both paths failed — silently ignore
      }
    }
  }

  const showingFiltered =
    searchQuery.trim() || selectedCategory || selectedProvider || activeCollectionId !== DEFAULT_COLLECTION_ID

  const ledger = [
    { label: 'Agents', value: agents.length || catalogSize || 0 },
    { label: 'Categories', value: allCategories.length },
    { label: 'Providers', value: allProviders.length },
    { label: 'Starred', value: favoriteAgents.length },
  ]

  const clearFilters = () => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.delete('q')
      next.delete('category')
      next.delete('provider')
      return next
    }, { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <RecommendationWizardModal
        agents={agents}
        isOpen={isRecommendationWizardOpen}
        onClose={() => setIsRecommendationWizardOpen(false)}
        triggerRef={recommendationWizardReturnFocusRef}
      />

      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <header className="mb-6">
        <div className="rule-head mb-3">Open Agents — Catalogue</div>

        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-zinc-900 dark:text-text-primary">
              {activeCollectionId === DEFAULT_COLLECTION_ID
                ? 'Agents'
                : selectedCollection?.name || 'Collection'}
            </h1>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400 dark:text-text-muted">
              community-built · bring your own API key
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <RecommendationWizardEntry
              ref={recommendationWizardHeroTriggerRef}
              onOpen={handleOpenRecommendationWizard}
              disabled={agentsLoading}
              loading={agentsLoading}
            />
            <button onClick={() => navigate('/battle')} className="btn-secondary">
              <Swords size={14} aria-hidden="true" />
              Battle
            </button>
          </div>
        </div>

        <dl className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 border-y border-zinc-200 py-3 dark:border-border">
          {ledger.map((item) => (
            <div key={item.label} className="flex items-baseline gap-2">
              <dt className="eyebrow">{item.label}</dt>
              <dd className="font-mono text-[15px] font-medium tabular-nums text-zinc-900 dark:text-text-primary">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* First-time notice — a margin note, not a card */}
        {showBanner && (
          <div className="mt-4 flex items-start justify-between gap-3 border-l-2 border-black pl-3 dark:border-white">
            <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-text-secondary">
              <strong className="text-zinc-900 dark:text-text-primary">First time here?</strong>{' '}
              Save your API keys once in Settings and use all agents instantly. No re-entering ever.
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/settings"
                className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-900 underline underline-offset-4 hover:no-underline dark:text-white"
              >
                Settings →
              </Link>
              <button
                onClick={dismissBanner}
                className="text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
                aria-label="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Pinned + recent — one hairline strip of shortcuts */}
        {!showingFiltered && (favoriteAgents.length > 0 || recentAgents.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {favoriteAgents.length > 0 && (
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <span className="eyebrow flex items-center gap-1">
                  <Star size={10} className="fill-current" aria-hidden="true" />
                  Pinned
                </span>
                {favoriteAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    to={`/agent/${agent.id}`}
                    className="max-w-[180px] truncate text-[12.5px] text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white"
                  >
                    {agent.name}
                  </Link>
                ))}
              </div>
            )}

            {recentAgents.length > 0 && (
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <span className="eyebrow flex items-center gap-1">
                  <History size={10} aria-hidden="true" />
                  Recent
                </span>
                {recentAgents.slice(0, 6).map((agent) => (
                  <Link
                    key={agent.id}
                    to={`/agent/${agent.id}`}
                    className="max-w-[180px] truncate text-[12.5px] text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white"
                  >
                    {agent.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Filter bar ───────────────────────────────────────────────── */}
      <div className="sticky top-12 z-30 -mx-1 mb-5 border-b border-zinc-200 bg-white/90 px-1 py-2.5 backdrop-blur-xl dark:border-border dark:bg-surface/90">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-text-muted"
                aria-hidden="true"
              />
              <input
                id="agent-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents by name, description, or category…"
                aria-label="Search agents"
                className="field h-9 pl-8 pr-16"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-2 flex items-center px-1 text-zinc-400 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : (
                <span className="kbd absolute right-2.5 top-1/2 hidden -translate-y-1/2 sm:inline-flex" aria-hidden="true">
                  /
                </span>
              )}
            </div>

            <div
              className="flex shrink-0 items-center border border-zinc-200 dark:border-border"
              role="group"
              aria-label="View mode"
            >
              {[
                { id: 'index', Icon: Rows3, label: 'Index view' },
                { id: 'grid', Icon: LayoutGrid, label: 'Grid view' },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setViewMode(id)}
                  aria-pressed={viewMode === id}
                  aria-label={label}
                  title={label}
                  className={`inline-flex h-8 w-8 items-center justify-center transition-colors ${
                    viewMode === id
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-zinc-400 hover:text-black dark:text-text-muted dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="eyebrow mr-1 shrink-0">Category</span>
            {dropdownOptions.map((option) => (
              <RailOption
                key={option.value || 'all-categories'}
                selected={option.value === selectedCategory}
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.value === null ? 'All' : option.label}
                <span className="ml-1.5 tabular-nums opacity-55">{option.count}</span>
              </RailOption>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="eyebrow mr-1 shrink-0">Provider</span>
            {providerOptions.map((option) => (
              <RailOption
                key={option.value || 'all-providers'}
                selected={option.value === selectedProvider}
                onClick={() => setSelectedProvider(option.value)}
              >
                {option.value === null ? 'All' : option.label}
                <span className="ml-1.5 tabular-nums opacity-55">{option.count}</span>
              </RailOption>
            ))}

            {(selectedCategory || selectedProvider || searchQuery) && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-2 shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-zinc-900 pb-1.5 dark:border-white">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-text-secondary">
                {showingFiltered ? 'Matching entries' : 'All entries'}
              </h2>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400 dark:text-text-muted">
                {filteredCount}
              </span>
            </div>

            {activeCollectionId !== DEFAULT_COLLECTION_ID && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500 transition-colors hover:text-black dark:text-text-muted dark:hover:text-white"
              >
                Show all
              </button>
            )}
          </div>

          {agentsLoading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col'
              }
            >
              {Array.from({ length: 9 }).map((_, idx) => (
                <AgentCardSkeleton
                  key={idx}
                  variant={viewMode === 'grid' ? 'grid' : 'index'}
                />
              ))}
            </div>
          ) : filteredCount > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="border-t border-zinc-200 dark:border-border">
                {visibleAgents.map((agent, i) => (
                  <AgentCard key={agent.id} agent={agent} variant="row" index={i + 1} />
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-start py-14">
              <span className="eyebrow mb-2">No entries</span>
              <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
                No agents match those filters
              </h3>
              <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-zinc-500 dark:text-text-secondary">
                {activeCollectionId === DEFAULT_COLLECTION_ID
                  ? 'Try a different search term, or clear the category and provider filters.'
                  : 'This collection is empty. Switch back to all agents or drag an agent into it from the index.'}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={clearFilters} className="btn-secondary h-7 text-[11px]">
                  Clear filters
                </button>
                {activeCollectionId !== DEFAULT_COLLECTION_ID && (
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="btn-ghost h-7 text-[11px]"
                  >
                    Show all agents
                  </button>
                )}
              </div>
            </div>
          )}

          {!agentsLoading && filteredCount > 0 && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3 dark:border-border">
              <span className="font-mono text-[10px] tabular-nums text-zinc-400 dark:text-text-muted">
                Showing {visibleCount} of {filteredCount}
              </span>
              {hasMore && (
                <button
                  type="button"
                  onClick={showMore}
                  className="btn-secondary h-7 text-[11px]"
                >
                  Load {Math.min(CATALOG_PAGE_SIZE, remaining)} more
                  <ChevronDown size={12} aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="w-full flex-shrink-0 lg:w-72">
          <RecentRuns
            history={history}
            onRerun={handleRerun}
            onCopy={handleCopy}
            onDelete={deleteRun}
            onClearAll={clearHistory}
          />
        </aside>
      </div>

      {/* ── Colophon: workflows + agent request, side by side ────────── */}
      {!showingFiltered && (
        <div className="grid gap-x-8 gap-y-8 border-t border-zinc-200 pt-6 md:grid-cols-2 dark:border-border">
          <section>
            <div className="rule-head mb-3">01 — Workflows</div>
            <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-text-secondary">
              Chain agents together and automate a multi-step process end to end.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => navigate('/workflows')} className="btn-secondary">
                <GitBranch size={13} aria-hidden="true" />
                Explore
              </button>
              <button onClick={() => navigate('/workflows/build')} className="btn-primary">
                Build a workflow
              </button>
            </div>
          </section>

          <section>
            <div className="rule-head mb-3">02 — Request an agent</div>
            <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-text-secondary">
              Missing something? Describe the agent you need and we&apos;ll build it.
            </p>
            <div className="mt-4">
              <AgentRequestPanel />
            </div>
          </section>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="mt-12 border-t border-zinc-900 py-10 dark:border-white">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-2.5 md:col-span-1">
            <Logo height={18} className="text-zinc-900 dark:text-text-primary" />
            <p className="max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
              Open-source AI agents that run entirely in your browser. Bring your own API key.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow">Resources</span>
            <a
              href="https://github.com/DivyashreeR008/Open-Agents#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-[13px] text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white"
            >
              Documentation
              <ExternalLink size={11} aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <a
              href="https://github.com/DivyashreeR008/Open-Agents/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-[13px] text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white"
            >
              Request an agent
              <ExternalLink size={11} aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow">Legal</span>
            <Link to="/privacy" className="w-fit text-[13px] text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white">
              Privacy policy
            </Link>
            <Link to="/terms" className="w-fit text-[13px] text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-black hover:decoration-current dark:text-text-secondary dark:hover:text-white">
              Terms of service
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow">Contribute</span>
            <a
              href="https://github.com/DivyashreeR008/Open-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-fit"
            >
              <Github size={14} aria-hidden="true" />
              GitHub
              <ExternalLink size={12} aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-zinc-200 pt-4 sm:flex-row dark:border-border">
          <span className="font-mono text-[11px] text-zinc-400 dark:text-text-muted">
            © {new Date().getFullYear()} OpenAgents
          </span>
          <span className="font-mono text-[11px] text-zinc-400 dark:text-text-muted">
            Open source · MIT licensed
          </span>
        </div>
      </footer>
    </div>
  )
}

// ── Agent Request Panel
function AgentRequestPanel() {
  const [agentName, setAgentName] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleRequest = () => {
    if (!agentName.trim() || !description.trim()) return
    const title = encodeURIComponent(`[Agent Request]: ${agentName}`)
    const body = encodeURIComponent(
`### What should this agent do?
${description}

### Additional context
-Requested via open-agents.vercel.app`
    )
    const url = `https://github.com/DivyashreeR008/Open-Agents/issues/new?title=${title}&body=${body}&labels=agent-request`
    window.open(url, '_blank')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
        placeholder="Agent name — e.g. Resume Bullet Point Generator"
        className="field h-9"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what it should do — e.g. Takes a job description and rewrites my resume bullet points to match it"
        rows={3}
        className="w-full resize-none border px-2.5 py-2 text-[13px] transition-colors border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-black focus:outline-none dark:border-border dark:bg-surface-input dark:text-text-primary dark:placeholder:text-text-muted dark:focus:border-white"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] leading-relaxed text-zinc-400 dark:text-text-muted">
          Opens a pre-filled GitHub issue.
        </p>
        <button
          onClick={handleRequest}
          disabled={!agentName.trim() || !description.trim()}
          className="btn-primary"
        >
          {submitted ? (
            'Opening GitHub…'
          ) : (
            <>
              <ArrowRight size={13} aria-hidden="true" />
              Request agent
            </>
          )}
        </button>
      </div>
    </div>
  )
}
