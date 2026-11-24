import { useEffect, useState } from 'react'
import { ACTIVITY_EVENT, readAgentActivity } from '../lib/agentActivity'

const SOURCES = {
  manual: 'Recent runs',
  automation: 'Automation history',
  scheduler: 'Scheduler history',
}
const PAGE_SIZE = 20

export default function AgentActivity({ agentId }) {
  const [open, setOpen] = useState(false)
  const [snapshot, setSnapshot] = useState({ runs: [], unavailable: [] })
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [selectedKey, setSelectedKey] = useState(null)

  useEffect(() => {
    if (!open) return
    const refresh = () => setSnapshot(readAgentActivity(agentId))
    const onStorage = (event) => {
      if (event.storageArea === localStorage || event.storageArea === null) refresh()
    }
    refresh()
    window.addEventListener(ACTIVITY_EVENT, refresh)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, refresh)
      window.removeEventListener('storage', onStorage)
    }
  }, [open, agentId])

  const selected = snapshot.runs.find((run) => run.key === selectedKey)
  return (
    <details
      className="my-6 border border-gray-200 dark:border-border p-4"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer font-semibold text-sm text-gray-900 dark:text-text-primary">
        All activity for this agent
      </summary>
      {open && (
        <>
          <p className="my-3 text-xs text-gray-500 dark:text-text-secondary">
            Manual and scheduled runs are shown together using their original run IDs. This view
            only shows retained history; it does not extend retention. Older runs with missing agent
            links are excluded, and an unrecorded trigger is shown as unknown.
          </p>
          {snapshot.unavailable.length > 0 && (
            <p role="alert" className="my-2 text-xs text-amber-700 dark:text-amber-300">
              Some activity could not be read from browser storage. This list may be incomplete.{' '}
              <button type="button" onClick={() => setSnapshot(readAgentActivity(agentId))}>
                Retry reading activity
              </button>
            </p>
          )}
          {snapshot.runs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-text-secondary">
              No retained activity for this agent.
            </p>
          ) : (
            <ul className="space-y-2">
              {snapshot.runs.slice(0, visible).map((run) => (
                <li
                  key={run.key}
                  className="border-b border-gray-100 dark:border-border py-2 text-xs text-gray-900 dark:text-text-primary"
                >
                  <button
                    type="button"
                    aria-expanded={selectedKey === run.key}
                    onClick={() => setSelectedKey(selectedKey === run.key ? null : run.key)}
                  >
                    {run.trigger === 'unknown'
                      ? 'Unknown trigger'
                      : run.trigger === 'scheduled'
                        ? 'Scheduled'
                        : 'Manual'}{' '}
                    · {run.status} ·{' '}
                    {run.timestamp === null
                      ? 'Time unavailable'
                      : new Date(run.timestamp).toLocaleString()}{' '}
                    · {SOURCES[run.source]} · Run {run.id}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {snapshot.runs.length > visible && (
            <button
              type="button"
              className="mt-3 text-sm underline"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
            >
              Show more activity
            </button>
          )}
          {selected && (
            <section
              aria-label={`Run details: ${SOURCES[selected.source]} ${selected.id}`}
              className="mt-4 text-xs text-gray-900 dark:text-text-primary"
            >
              <h3 className="font-semibold">
                Run {selected.id} · {SOURCES[selected.source]}
              </h3>
              {selected.error && <p>{selected.error}</p>}
              <pre className="whitespace-pre-wrap break-words mt-2">
                {selected.output || 'No saved output for this run.'}
              </pre>
            </section>
          )}
        </>
      )}
    </details>
  )
}
