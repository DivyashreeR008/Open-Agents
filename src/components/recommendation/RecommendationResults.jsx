import { SearchX } from 'lucide-react'
import RecommendationResultCard from './RecommendationResultCard'

export default function RecommendationResults({
  agents = [],
  results = [],
  onRefine,
  onStartOver,
  onClose,
}) {
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const resolved = results
    .map((result) => ({ result, agent: agentById.get(result.agentId) }))
    .filter(({ agent }) => agent)
  const hasConfidentMatch = resolved.some(({ result }) => result.isConfident)

  if (!resolved.length) {
    return (
      <div className="text-center py-10 border bg-white border-gray-200 dark:bg-surface-card dark:border-border px-4">
        <div className="w-14 h-14 bg-zinc-500/10 flex items-center justify-center mx-auto mb-4">
          <SearchX size={24} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary mb-1">
          No agents available yet
        </h3>
        <p className="text-xs text-gray-500 dark:text-text-secondary mb-4">
          The agent list is empty. Try again after agents have loaded.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <button
            type="button"
            onClick={onRefine}
            className=" border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-zinc-400 dark:bg-surface-input dark:border-border dark:text-text-primary dark:hover:border-zinc-400"
          >
            Adjust answers
          </button>
          <button
            type="button"
            onClick={onClose}
            className=" bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse all agents
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-text-primary">
          Recommended agents for you
        </h2>
        <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">
          Based on your goal, level, and preferences. Match reflects your answers, not agent
          quality.
        </p>
      </div>
      {!hasConfidentMatch && (
        <div className=" border border-zinc-500/20 bg-zinc-500/5 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:text-text-secondary">
          We couldn't find a perfect match, but here are the closest agents based on your
          preferences.
        </div>
      )}
      <div className="space-y-3">
        {resolved.map(({ agent, result }, index) => (
          <RecommendationResultCard
            key={result.agentId}
            rank={index + 1}
            agent={agent}
            result={result}
            onOpenAgent={onClose}
          />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between border-t border-gray-200 dark:border-border pt-4">
        <button
          type="button"
          onClick={onStartOver}
          className=" px-3 py-2 text-xs font-semibold text-gray-500 hover:text-black dark:text-text-secondary dark:hover:text-white"
        >
          Start over
        </button>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onRefine}
            className=" border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-zinc-400 dark:bg-surface-input dark:border-border dark:text-text-primary dark:hover:border-zinc-400"
          >
            Refine answers
          </button>
          <button
            type="button"
            onClick={onClose}
            className=" bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse all agents
          </button>
        </div>
      </div>
    </div>
  )
}
