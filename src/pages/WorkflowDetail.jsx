import { useState, useEffect } from 'react'
import { useTimedState } from '../lib/useTimedState'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Zap,
  Loader2,
  Share2,
  Check,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  GitBranch,
} from 'lucide-react'
import { resolveAgentIcon } from '../lib/agentIcons'
import { useAgents } from '../lib/useAgents'
import { fetchWorkflowById, subscribeToWorkflow } from '../hooks/useWorkflows'
import { supabase } from '../lib/supabase'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { getWorkflowStepInfo, getWorkflowStepSummary } from '../lib/workflowStepDisplay'

function StepRow({ entry, index, total, agents }) {
  const step = getWorkflowStepInfo(entry, index)

  if (step.kind === 'conditional') {
    const visibleLabels = step.labels.slice(0, 6)
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center self-stretch w-6">
          <div
            className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === 0 ? 'opacity-0' : ''}`}
          />
          <div className="w-6 h-6 bg-zinc-500/10 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
            {index + 1}
          </div>
          <div
            className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === total - 1 ? 'opacity-0' : ''}`}
          />
        </div>

        <div className="flex flex-1 items-start gap-3 border border-dashed border-zinc-500/40 bg-zinc-500/5 p-3 my-1">
          <div className="w-8 h-8 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
            <GitBranch size={15} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium dark:text-text-primary text-gray-900">
                Conditional step
              </span>
              <span className="border border-zinc-500/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide dark:text-text-secondary text-gray-500">
                Branch
              </span>
            </div>
            <p className="mt-1 break-words font-mono text-[11px] dark:text-text-secondary text-gray-500">
              {step.condition ? `When ${step.condition}` : 'Condition unavailable'}
            </p>
            {visibleLabels.length > 0 ? (
              <p className="mt-1 text-[11px] dark:text-text-muted text-gray-400">
                Branches: {visibleLabels.join(', ')}
                {step.labels.length > visibleLabels.length
                  ? ` and ${step.labels.length - visibleLabels.length} more`
                  : ''}
              </p>
            ) : (
              <p className="mt-1 text-[11px] dark:text-text-muted text-gray-400">
                No branch labels defined.
              </p>
            )}
          </div>
          {index < total - 1 && (
            <ArrowRight size={12} className="dark:text-text-muted text-gray-400 flex-shrink-0" />
          )}
        </div>
      </div>
    )
  }

  if (step.kind === 'malformed') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center self-stretch w-6">
          <div
            className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === 0 ? 'opacity-0' : ''}`}
          />
          <div className="w-6 h-6 bg-zinc-500/10 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
            {index + 1}
          </div>
          <div
            className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === total - 1 ? 'opacity-0' : ''}`}
          />
        </div>

        <div className="flex flex-1 items-center gap-3 border border-dashed border-zinc-500/30 bg-zinc-500/5 p-3 my-1">
          <div className="w-8 h-8 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={15} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium dark:text-text-primary text-gray-900">
              Unavailable step
            </div>
            <div className="text-[11px] dark:text-text-muted text-gray-400">
              This saved entry cannot be displayed.
            </div>
          </div>
          {index < total - 1 && (
            <ArrowRight size={12} className="dark:text-text-muted text-gray-400 flex-shrink-0" />
          )}
        </div>
      </div>
    )
  }

  const agent = agents?.find((a) => a.id === step.agentId)
  const IconComponent = resolveAgentIcon(agent?.icon)

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center self-stretch w-6">
        <div
          className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === 0 ? 'opacity-0' : ''}`}
        />
        <div className="w-6 h-6 bg-zinc-500/10 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
          {index + 1}
        </div>
        <div
          className={`w-px flex-1 dark:bg-border bg-gray-200 ${index === total - 1 ? 'opacity-0' : ''}`}
        />
      </div>

      <div className="flex items-center gap-3 flex-1 p-3 border my-1 dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <div className="w-8 h-8 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
          <IconComponent size={15} className="text-zinc-600 dark:text-zinc-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium dark:text-text-primary text-gray-900 truncate">
            {agent?.name ?? step.agentId}
          </div>
          <div className="text-[11px] dark:text-text-muted text-gray-400">
            {agent?.category ?? '—'}
          </div>
        </div>
        {index < total - 1 && (
          <ArrowRight size={12} className="dark:text-text-muted text-gray-400 flex-shrink-0" />
        )}
      </div>
    </div>
  )
}

export default function WorkflowDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { agents } = useAgents()

  const [workflow, setWorkflow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usageCount, setUsageCount] = useState(0)
  const [copied, setCopied] = useTimedState(false)
  useDocumentTitle(workflow?.title ?? 'Workflow Details')

  // Fetch workflow
  useEffect(() => {
    let mounted = true
    fetchWorkflowById(id).then(({ data, error: fetchError }) => {
      if (!mounted) return
      if (fetchError || !data) {
        setError('Workflow not found.')
      } else {
        setWorkflow(data)
        setUsageCount(data.usage_count ?? 0)
      }
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [id])

  // Realtime usage count subscription
  useEffect(() => {
    if (!id) return
    const channel = subscribeToWorkflow(id, (payload) => {
      setUsageCount(payload.new.usage_count ?? 0)
    })
    return () => supabase.removeChannel(channel)
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true, 2000)
  }

  const handleRun = () => {
    navigate(`/workflows/${id}/run`, { state: { workflow } })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-in">
        <Loader2 size={24} className="animate-spin text-zinc-900 dark:text-white" />
        <p className="text-sm dark:text-text-secondary text-gray-500">Loading workflow...</p>
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 animate-fade-in">
        <AlertCircle size={28} className="text-zinc-400 mx-auto mb-3" />
        <p className="text-sm dark:text-text-secondary text-gray-500 mb-4">
          {error ?? 'Workflow not found.'}
        </p>
        <button
          onClick={() => navigate('/workflows')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <ArrowLeft size={14} /> Back to Library
        </button>
      </div>
    )
  }

  const { steps, conditionalCount, label } = getWorkflowStepSummary(workflow.agents)

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate('/workflows')}
        className="inline-flex items-center gap-1.5 mb-5 text-xs dark:text-text-muted text-gray-400 hover:underline"
      >
        <ArrowLeft size={13} />
        Workflow Library
      </button>

      {/* Header Card */}
      <div className=" border p-5 mb-5 dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
            <GitBranch size={22} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary mb-1">
              {workflow.title}
            </h1>
            {workflow.description && (
              <p className="text-sm dark:text-text-secondary text-gray-500 leading-relaxed">
                {workflow.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="dark:text-text-muted text-gray-400" />
            <span className="text-sm font-semibold dark:text-text-primary text-gray-900">
              {usageCount}
            </span>
            <span className="text-xs dark:text-text-muted text-gray-400">runs</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-zinc-500/10 text-zinc-900 dark:text-white border border-zinc-500/20 ml-1">
              live
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs dark:text-text-muted text-gray-400">
              {label}
              {conditionalCount > 0 ? ` · ${conditionalCount} conditional` : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="run-workflow-btn"
            onClick={handleRun}
            className="flex items-center gap-2 h-8 px-3 text-sm font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all duration-200 active:scale-[0.97] "
          >
            <Zap size={15} />
            Run Workflow
          </button>
          <button
            id="share-workflow-btn"
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors dark:bg-surface-input dark:border-border dark:text-text-secondary dark:hover:text-text-primary bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900"
          >
            {copied ? (
              <>
                <Check size={14} className="text-zinc-400" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={14} />
                Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* Agent Sequence */}
      <div className=" border p-5 dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <h2 className="eyebrow mb-4">Agent Sequence</h2>
        <div>
          {steps.map((step, index) => (
            <StepRow
              key={step.key}
              entry={workflow.agents[index]}
              index={index}
              total={steps.length}
              agents={agents}
            />
          ))}
        </div>
        <p className="mt-4 text-[11px] dark:text-text-muted text-gray-400">
          Each agent's output becomes the input for the next agent in the chain.
        </p>
      </div>
    </div>
  )
}
