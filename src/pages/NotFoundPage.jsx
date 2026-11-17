import { useNavigate } from 'react-router-dom'
import { Home, Swords, Search } from 'lucide-react'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function focusAgentSearch(attempt = 0) {
  if (typeof document === 'undefined') return
  const field = document.getElementById('agent-search')
  if (field) {
    field.focus()
    return
  }
  if (attempt >= 120) return

  const schedule =
    typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame
      : (callback) => window.setTimeout(callback, 16)

  schedule(() => focusAgentSearch(attempt + 1))
}

export default function NotFoundPage() {
  const navigate = useNavigate()
  useDocumentTitle('Page not found')

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md border border-zinc-200 bg-white p-8 dark:border-border dark:bg-surface-card">
        <span className="eyebrow">Error 404</span>

        <h1 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.025em] text-zinc-900 dark:text-text-primary">
          Page not found
        </h1>

        <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-text-secondary">
          That page doesn&apos;t exist, or it moved somewhere else.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => navigate('/agents')} className="btn-primary">
            <Home size={14} aria-hidden="true" />
            Back to agents
          </button>
          <button type="button" onClick={() => navigate('/battle')} className="btn-secondary">
            <Swords size={14} aria-hidden="true" />
            Battle mode
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            navigate('/agents')
            focusAgentSearch()
          }}
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 transition-colors hover:text-black dark:hover:text-white dark:text-text-muted"
        >
          <Search size={11} aria-hidden="true" />
          Or search the agent library
        </button>
      </div>
    </div>
  )
}
