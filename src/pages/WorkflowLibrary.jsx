import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Zap, Eye, ArrowRight, GitBranch, Loader2, TrendingUp, X } from 'lucide-react'
import { useAgents } from '../lib/useAgents'
import { fetchWorkflows, subscribeToAllWorkflows } from '../hooks/useWorkflows'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import PageHeader from '../components/layout/PageHeader'
import SectionHeader from '../components/layout/SectionHeader'
import EmptyState from '../components/layout/EmptyState'

function AgentPill({ agentId }) {
  const { agents } = useAgents()
  const agent = agents.find((a) => a.id === agentId)
  if (!agent) return <span className="badge opacity-60">{agentId}</span>
  return <span className="badge">{agent.name}</span>
}

function WorkflowCard({ workflow, onRun, onView, onFork }) {
  const usageCount = workflow.usage_count ?? 0
  const agentIds = Array.isArray(workflow.agents) ? workflow.agents : []

  return (
    <div className="flex flex-col border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-border dark:bg-surface-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center bg-zinc-500/10">
            <GitBranch size={13} className="text-zinc-600 dark:text-zinc-300" aria-hidden="true" />
          </div>
          <div>
            <h3 className="truncate text-[13px] font-semibold text-zinc-900 dark:text-text-primary">
              {workflow.title}
            </h3>
            {workflow.description && (
              <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500 dark:text-text-secondary">
                {workflow.description}
              </p>
            )}
          </div>
        </div>
        {/* Usage Count */}
        <div className="ml-2 flex shrink-0 items-center gap-1 font-mono text-[10px] text-zinc-400 dark:text-text-muted">
          <TrendingUp size={10} aria-hidden="true" />
          {usageCount}
        </div>
      </div>

      {/* Agent Sequence */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {agentIds.map((agentId, index) => (
          <span key={agentId + index} className="flex items-center gap-1">
            <AgentPill agentId={agentId} />
            {index < agentIds.length - 1 && (
              <ArrowRight size={10} className="dark:text-text-muted text-gray-400 flex-shrink-0" />
            )}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          id={`run-workflow-${workflow.id}`}
          onClick={() => onRun(workflow)}
          className="btn-primary h-7 text-[11px]"
        >
          <Zap size={12} />
          Run
        </button>
        <button
          id={`view-workflow-${workflow.id}`}
          onClick={() => onView(workflow)}
          className="btn-secondary h-7 text-[11px]"
        >
          <Eye size={12} />
          Details
        </button>
        <button
          id={`fork-workflow-${workflow.id}`}
          onClick={() => onFork(workflow)}
          className="btn-secondary h-7 text-[11px]"
        >
          <GitBranch size={12} />
          Fork
        </button>
        <span className="ml-auto text-[11px] dark:text-text-muted text-gray-400">
          {agentIds.length} agent{agentIds.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

export default function WorkflowLibrary() {
  const navigate = useNavigate()
  useDocumentTitle('Workflow Library')
  const { agents } = useAgents()
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Initial fetch
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchWorkflows().then(({ data, error: fetchError }) => {
      if (!mounted) return
      if (fetchError) {
        setError('Failed to load workflows. Check your Supabase connection.')
      } else {
        setWorkflows(data)
      }
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Realtime: update usage counts on any workflow update
  useEffect(() => {
    const channel = subscribeToAllWorkflows((payload) => {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === payload.new.id ? { ...w, usage_count: payload.new.usage_count } : w
        )
      )
    })
    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return workflows

    return workflows.filter((w) => {
      const titleMatch = w.title?.toLowerCase().includes(query)
      const descriptionMatch = w.description?.toLowerCase().includes(query)
      const agentIds = Array.isArray(w.agents) ? w.agents : []
      const categoryMatch = agentIds.some((agentId) => {
        const agent = agents.find((a) => a.id === agentId)
        return agent?.category?.toLowerCase().includes(query)
      })
      return titleMatch || descriptionMatch || categoryMatch
    })
  }, [workflows, searchQuery, agents])

  const handleRun = (workflow) => {
    navigate(`/workflows/${workflow.id}/run`, { state: { workflow } })
  }

  const handleView = (workflow) => {
    navigate(`/workflows/${workflow.id}`)
  }
  const handleFork = (workflow) => {
    navigate('/workflows/build', {
      state: {
        forkedWorkflow: workflow,
      },
    })
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Workflows"
        meta={workflows.length}
        description="Community-built agent chains"
        actions={
          <button
            id="build-workflow-btn"
            onClick={() => navigate('/workflows/build')}
            className="btn-primary"
          >
            <Plus size={14} aria-hidden="true" />
            Build workflow
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-text-muted"
          aria-hidden="true"
        />
        <input
          aria-label="Search workflows"
          id="workflow-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workflows…"
          className="field h-9 pl-8 pr-8"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-2 flex items-center px-1 text-zinc-400 transition-colors hover:text-black dark:hover:text-white dark:text-text-muted"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2
            size={20}
            className="animate-spin text-zinc-900 dark:text-white"
            aria-hidden="true"
          />
          <p className="text-[13px] text-zinc-500 dark:text-text-secondary">Loading workflows…</p>
        </div>
      )}

      {error && !loading && (
        <div className="animate-fade-in border border-zinc-500/25 bg-zinc-500/5 p-6 text-center">
          <p className="mb-2 text-[13px] text-zinc-900 dark:text-white">{error}</p>
          <p className="font-mono text-[11px] text-zinc-400 dark:text-text-muted">
            Check that your Supabase credentials are configured in .env.local
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={GitBranch}
          title={searchQuery ? 'No workflows found' : 'No workflows yet'}
          description={
            searchQuery
              ? 'Try a different search term.'
              : 'Be the first to publish a community workflow.'
          }
          action={
            !searchQuery && (
              <button onClick={() => navigate('/workflows/build')} className="btn-primary">
                <Plus size={14} aria-hidden="true" />
                Build a workflow
              </button>
            )
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <SectionHeader
            title={searchQuery ? 'Matching workflows' : 'All workflows'}
            count={filtered.length}
          />

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((workflow, idx) => (
              <div
                key={workflow.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <WorkflowCard
                  workflow={workflow}
                  onRun={handleRun}
                  onView={handleView}
                  onFork={handleFork}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
