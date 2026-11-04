import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolveAgentIcon } from '../../lib/agentIcons'

const providerLabels = { openai: 'OpenAI', anthropic: 'Anthropic', gemini: 'Gemini', openrouter: 'OpenRouter', any: 'Any Provider' }
const providerClasses = {
  openai: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  anthropic: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  gemini: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  openrouter: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  any: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
}

export default function RecommendationResultCard({ rank, agent, result, onOpenAgent }) {
  const Icon = resolveAgentIcon(agent?.icon)
  const provider = agent?.provider || 'any'
  return (
    <article className=" border bg-white border-gray-200 dark:bg-surface-card dark:border-border p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-black text-xs font-bold text-white dark:bg-white dark:text-black" aria-label={`Rank ${rank}`}>{rank}</span>
        <div className="h-10 w-10 shrink-0 bg-zinc-500/10 flex items-center justify-center"><Icon size={20} className="text-zinc-600 dark:text-zinc-300" aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-text-primary">{agent?.name || 'Unnamed Agent'}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 border border-zinc-500/20">{result.matchPercentage}% match</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 dark:bg-surface-input dark:text-text-muted dark:border-border">{agent?.category || 'Uncategorized'}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 border ${providerClasses[provider] || providerClasses.any}`}>{providerLabels[provider] || provider}</span>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-500 dark:text-text-secondary">{agent?.description || 'No description provided.'}</p>
      <div>
        <h4 className="text-xs font-semibold text-gray-700 dark:text-text-primary mb-1">Why this agent?</h4>
        <ul className="space-y-1 text-xs text-gray-500 dark:text-text-secondary list-disc pl-4">
          {(result.reasons || []).slice(0, 4).map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      </div>
      <div className="flex justify-end">
        <Link to={`/agent/${agent.id}`} onClick={onOpenAgent} className="inline-flex items-center gap-1.5 bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors">
          Open agent <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
