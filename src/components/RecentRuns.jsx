import { RotateCcw, Copy, Trash2, History } from 'lucide-react'
import { formatExactTime, formatRelativeTime, useNow } from '../lib/formatting'

const providerDot = (provider) => {
  const p = provider?.toLowerCase() || ''
  if (p.includes('gpt') || p.includes('openai')) return 'bg-zinc-500'
  if (p.includes('claude') || p.includes('anthropic')) return 'bg-zinc-400'
  if (p.includes('gemini') || p.includes('google')) return 'bg-zinc-500'
  return 'bg-zinc-500'
}

export default function RecentRuns({ history, onRerun, onCopy, onDelete, onClearAll }) {
  const now = useNow()

  if (!history || history.length === 0) {
    return (
      <div className="animate-fade-in">
        <span className="eyebrow">Recent runs</span>
        <div className="mt-2 flex flex-col items-center justify-center gap-2 border border-dashed border-zinc-300 px-4 py-10 text-center dark:border-border-light">
          <History size={16} className="text-zinc-300 dark:text-text-muted" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
            Runs you start will show up here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="eyebrow">Recent runs</span>
          <span className="font-mono text-[10px] tabular-nums text-zinc-400 dark:text-text-muted">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400 transition-colors hover:text-black dark:hover:text-white dark:text-text-muted"
          aria-label="Clear all history"
        >
          Clear
        </button>
      </div>
      <p className="mb-2 text-[10px] leading-relaxed text-zinc-400 dark:text-text-muted">
        Stored locally. Long outputs are trimmed in history.
      </p>

      <div className="space-y-2 lg:max-h-[calc(100vh-150px)] lg:min-h-[280px] lg:overflow-y-auto">
        {history.map((run) => (
          <article
            key={run.id}
            className="group border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-border dark:bg-surface-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[13px] font-medium text-zinc-900 dark:text-text-primary">
                  {run.agentName}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 dark:text-text-muted">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 ${providerDot(run.provider)}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{run.provider || 'unknown'}</span>
                  <span aria-hidden="true">·</span>
                  <time className="shrink-0" title={formatExactTime(run.timestamp)}>
                    {formatRelativeTime(run.timestamp, now)}
                  </time>
                </div>
              </div>

              <button
                onClick={() => onDelete(run.id)}
                className="btn-icon h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                title="Delete run"
                aria-label="Delete run"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
              {run.output}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5 border-t border-zinc-100 pt-2 dark:border-border/60">
              <button
                onClick={() => onRerun(run)}
                className="btn-ghost h-6 flex-1 px-2 text-[11px]"
              >
                <RotateCcw size={11} aria-hidden="true" />
                Re-run
              </button>
              <button
                onClick={() => onCopy(run.output)}
                className="btn-ghost h-6 flex-1 px-2 text-[11px]"
              >
                <Copy size={11} aria-hidden="true" />
                Copy
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
