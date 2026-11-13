import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAgentRatings } from '../lib/useAgentRatings.js'

const BUTTON_BASE =
  'flex items-center justify-center p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 dark:focus-visible:outline-zinc-300'
const BUTTON_IDLE =
  'text-gray-500 hover:text-zinc-700 hover:bg-zinc-500/10 dark:text-gray-400 dark:hover:text-zinc-200'
const BUTTON_SELECTED =
  'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'

export default function RunRating({ agentId, runId }) {
  const { rateAgent, getRunVote } = useAgentRatings()
  const [selectedVote, setSelectedVote] = useState(() => (runId ? getRunVote(runId) : null))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setSelectedVote(runId ? getRunVote(runId) : null)
    setNotice('')
  }, [runId])

  const handleRate = (value) => {
    if (!agentId) return

    if (selectedVote === value) {
      setNotice('Your rating is already saved for this output.')
      return
    }

    const outcome = runId ? rateAgent(agentId, value, runId) : rateAgent(agentId, value)
    if (outcome?.ok === false) {
      setNotice('Your rating could not be saved. Try again after freeing browser storage.')
      return
    }

    setSelectedVote(value)
    setNotice(
      outcome?.unchanged
        ? 'Your rating is already saved for this output.'
        : 'Thanks. Your rating is saved for this output.'
    )
  }

  return (
    <div className="w-full flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          How was this output?
        </span>
        <div className="flex items-center gap-2" role="group" aria-label="Rate this output">
          <button
            type="button"
            onClick={() => handleRate('up')}
            disabled={!agentId}
            aria-label="Good output"
            aria-pressed={selectedVote === 'up'}
            title="Good output"
            className={`${BUTTON_BASE} ${selectedVote === 'up' ? BUTTON_SELECTED : BUTTON_IDLE} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ThumbsUp size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleRate('down')}
            disabled={!agentId}
            aria-label="Bad output"
            aria-pressed={selectedVote === 'down'}
            title="Bad output"
            className={`${BUTTON_BASE} ${selectedVote === 'down' ? BUTTON_SELECTED : BUTTON_IDLE} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ThumbsDown size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      {(notice || selectedVote) && (
        <p role="status" className="text-xs text-gray-600 dark:text-gray-300">
          {notice ||
            (selectedVote === 'up'
              ? 'You rated this output as good.'
              : 'You rated this output as bad.')}
        </p>
      )}
    </div>
  )
}
