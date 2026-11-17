import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loader2, Store } from 'lucide-react'

import AgentRunner from '../components/AgentRunner'
import ErrorCard from '../components/ErrorCard'
import NotFoundPage from './NotFoundPage'

import { useAgents } from '../lib/useAgents'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { loadListings } from '../lib/marketplace'

export default function AgentPage() {
  const { id } = useParams()

  const { agents, loading: isLoading, error, reloadAgents } = useAgents()

  const agent = agents.find((a) => a.id === id)

  useDocumentTitle(agent?.name ?? (isLoading || error ? 'Agent' : 'Page not found'))

  const listing = useMemo(() => {
    if (!agent) return null
    return loadListings().find((item) => item.config?.baseAgentId === agent.id) ?? null
  }, [agent])

  useEffect(() => {
    if (!agent) return

    let existing

    try {
      const parsed = JSON.parse(localStorage.getItem('recentAgents') || '[]')
      existing = Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
    } catch {
      existing = []
    }

    const updated = [agent.id, ...existing.filter((item) => item !== agent.id)].slice(0, 5)

    try {
      localStorage.setItem('recentAgents', JSON.stringify(updated))
    } catch {
      // Recent tracking is optional; storage can be blocked or full.
    }
  }, [agent])

  if (isLoading) {
    return (
      <div
        className="flex min-h-[70vh] flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
      >
        <Loader2 size={28} className="animate-spin text-zinc-500" aria-hidden="true" />

        <p className="text-sm text-zinc-500 dark:text-text-secondary">Loading agent...</p>

        <span className="sr-only">Please wait while the agent loads.</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <ErrorCard message={error.message || 'Unable to load agents. Please try again.'} />

        <button type="button" onClick={reloadAgents} className="btn-primary mt-4">
          Try again
        </button>
      </div>
    )
  }

  if (!agent) {
    return <NotFoundPage />
  }

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pt-4">
        <p
          role="note"
          className="border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
        >
          Treat pasted emails, documents, issues, and web pages as data, not instructions. Text
          inside them can try to redirect this run.
        </p>

        {listing && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-zinc-200 p-3 text-xs dark:border-border">
            <span className="text-zinc-600 dark:text-text-secondary">
              Marketplace listing by {listing.author}: {listing.name}
            </span>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1 font-medium text-zinc-900 underline underline-offset-2 dark:text-text-primary"
            >
              <Store size={13} aria-hidden="true" />
              Browse the marketplace
            </Link>
          </div>
        )}
      </div>

      <AgentRunner key={agent.id} agent={agent} />
    </>
  )
}
