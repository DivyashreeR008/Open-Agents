import { RefreshCw, SearchX } from 'lucide-react'
import RecommendationResultCard from './RecommendationResultCard'

function EmptyResults({ icon: Icon, title, body, primaryAction, secondaryAction }) {
  return (
    <div className="text-center py-10 border bg-white border-gray-200 dark:bg-surface-card dark:border-border px-4">
      <div className="w-14 h-14 bg-zinc-500/10 flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-text-secondary mb-4">{body}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <button type="button" onClick={primaryAction.onClick} className="border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-zinc-400 dark:bg-surface-input dark:border-border dark:text-text-primary dark:hover:border-zinc-400">
          {primaryAction.label}
        </button>
        <button type="button" onClick={secondaryAction.onClick} className="bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
          {secondaryAction.label}
        </button>
      </div>
    </div>
  )
}

export default function RecommendationResults({ agents = [], results = [], onRefine, onStartOver, onClose }) {
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const resolved = results
    .map((result) => ({ result, agent: agentById.get(result.agentId) }))
    .filter(({ agent }) => agent)
  const unresolvedCount = results.length - resolved.length
  const hasConfidentMatch = resolved.some(({ result }) => result.isConfident)

  if (!resolved.length) {
    if (!agents.length) {
      return (
        <EmptyResults
          icon={SearchX}
          title="No agents available yet"
          body="The agent list is empty. Try again after agents have loaded."
          primaryAction={{ label: 'Adjust answers', onClick: onRefine }}
          secondaryAction={{ label: 'Browse all agents', onClick: onClose }}
        />
      )
    }

    if (results.length > 0) {
      return (
        <EmptyResults
          icon={RefreshCw}
          title="These recommendations are out of date"
          body="The ranked agents are no longer in the catalogue. Start over to rank the current catalogue."
          primaryAction={{ label: 'Start over', onClick: onStartOver }}
          secondaryAction={{ label: 'Browse all agents', onClick: onClose }}
        />
      )
    }

    return (
      <EmptyResults
        icon={SearchX}
        title="No agents matched your answers"
        body="Nothing in the catalogue matched enough of your answers. Adjust the questionnaire or browse the full catalogue."
        primaryAction={{ label: 'Adjust answers', onClick: onRefine }}
        secondaryAction={{ label: 'Browse all agents', onClick: onClose }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-text-primary">Recommended agents for you</h2>
        <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">Based on your goal, level, and preferences. Match reflects your answers, not agent quality.</p>
      </div>
      {unresolvedCount > 0 && (
        <p className="border border-gray-200 bg-white px-4 py-3 text-xs leading-relaxed text-gray-600 dark:border-border dark:bg-surface-card dark:text-text-secondary">
          {unresolvedCount} ranked {unresolvedCount === 1 ? 'entry is' : 'entries are'} no longer in the catalogue and {unresolvedCount === 1 ? 'was' : 'were'} left out.
        </p>
      )}
      {!hasConfidentMatch && (
        <div className=" border border-zinc-500/20 bg-zinc-500/5 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:text-text-secondary">
          No strong match was found. These are the closest agents with at least one matching signal.
        </div>
      )}
      <div className="space-y-3">
        {resolved.map(({ agent, result }, index) => <RecommendationResultCard key={result.agentId} rank={index + 1} agent={agent} result={result} onOpenAgent={onClose} />)}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between border-t border-gray-200 dark:border-border pt-4">
        <button type="button" onClick={onStartOver} className=" px-3 py-2 text-xs font-semibold text-gray-500 hover:text-black dark:text-text-secondary dark:hover:text-white">Start over</button>
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="button" onClick={onRefine} className=" border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-zinc-400 dark:bg-surface-input dark:border-border dark:text-text-primary dark:hover:border-zinc-400">Refine answers</button>
          <button type="button" onClick={onClose} className=" bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">Browse all agents</button>
        </div>
      </div>
    </div>
  )
}
