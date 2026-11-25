import { useRef } from 'react'

export default function SearchHistory({ history, surface, onRecall }) {
  const summaryRef = useRef(null)
  const entries = history.entries.filter((entry) => entry.surface === surface)
  return (
    <div>
      {history.error && (
        <p role="alert" className="px-3 py-2 text-xs">
          {history.error}
        </p>
      )}
      <details className="border-t border-zinc-200 px-3 py-2 text-xs dark:border-border">
        <summary
          ref={summaryRef}
          className="min-h-11 cursor-pointer py-3 font-medium text-zinc-700 dark:text-text-secondary"
        >
          Recent searches ({entries.length})
        </summary>
        <p className="my-2 text-zinc-500 dark:text-text-secondary">
          Search submissions and remembered queries stay on this device. The latest 10 are kept
          across the catalogue and global search; typing alone is not saved.
        </p>
        {entries.length > 0 && (
          <ul aria-label={`${surface === 'catalogue' ? 'Catalogue' : 'Global'} search history`}>
            {entries.map((entry) => {
              const params = new URLSearchParams(entry.scope)
              params.delete('q')
              const scope = [...params].map(([key, value]) => `${key}: ${value}`).join(' · ')
              return (
                <li
                  key={entry.id}
                  className="flex items-center gap-2 border-t border-zinc-100 dark:border-border"
                >
                  <button
                    type="button"
                    className="min-h-11 min-w-0 flex-1 px-2 py-2 text-left focus-visible:outline focus-visible:outline-2"
                    onClick={() => onRecall(entry)}
                  >
                    <span className="block break-words">{entry.query}</span>
                    {surface === 'catalogue' && (
                      <span className="block break-words text-zinc-500 dark:text-text-secondary">
                        {scope ? `${scope} · ` : ''}
                        {entry.view} view
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 px-2"
                    onClick={() => {
                      if (history.remove(entry.id)) summaryRef.current?.focus()
                    }}
                    aria-label={`Remove search ${entry.query}${scope ? ` (${scope})` : ''}`}
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {entries.length === 0 && <p className="py-2">No remembered searches here yet.</p>}
        {(history.entries.length > 0 || history.error) && (
          <button
            type="button"
            className="min-h-11 underline"
            onClick={() => {
              if (history.clear()) summaryRef.current?.focus()
            }}
          >
            Clear all remembered searches
          </button>
        )}
      </details>
    </div>
  )
}
