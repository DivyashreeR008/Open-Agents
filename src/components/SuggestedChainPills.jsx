import { useNavigate } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { resolveAgentIcon } from '../lib/agentIcons'
import { useAgents } from '../lib/useAgents'

/**
 * Renders "Works well after" clickable pills for agents that define
 * a `suggestedChainFrom` array in their definition.
 *
 * Clicking a pill navigates to /workflows/build with the pair
 * pre-selected via React Router state.
 */
export default function SuggestedChainPills({ agent }) {
  const navigate = useNavigate()
  const { agents } = useAgents()

  const chain = Array.isArray(agent?.suggestedChainFrom) ? agent.suggestedChainFrom : []
  if (!chain.length) return null

  const predecessors = agents.length
    ? chain.map((id) => agents.find((a) => a.id === id)).filter(Boolean)
    : []

  if (!predecessors.length) return null

  const handlePillClick = (predecessor) => {
    navigate('/workflows/build', {
      state: {
        preselectedAgents: [predecessor.id, agent.id],
      },
    })
  }

  return (
    <div className="mb-4 p-3 border dark:bg-surface-card dark:border-border bg-white border-gray-200">
      <div className="flex items-center gap-1.5 mb-2">
        <GitBranch size={12} className="text-zinc-600 dark:text-zinc-300" />
        <span className="text-[11px] font-semibold uppercase tracking-wider dark:text-text-muted text-gray-400">
          Works well after
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {predecessors.map((pred) => {
          const IconComponent = resolveAgentIcon(pred.icon)
          return (
            <button
              key={pred.id}
              onClick={() => handlePillClick(pred)}
              title={`Start a workflow: ${pred.name} → ${agent.name}`}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-all duration-150 active:scale-[0.97] dark:bg-surface-input dark:border-border dark:text-text-secondary dark:hover:border-zinc-400 dark:hover:text-white bg-gray-50 border-gray-200 text-gray-600 hover:border-zinc-400/60 hover:text-zinc-600 hover:bg-zinc-50"
            >
              <IconComponent size={11} />
              {pred.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
