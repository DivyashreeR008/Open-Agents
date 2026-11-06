/**
 * PageHeader — the single page-title block used across the app.
 *
 * Gives every route the same rhythm: an optional mono eyebrow, a tight
 * display-size title, a metadata line with a monospace count, and a
 * right-aligned action cluster.
 */
export default function PageHeader({ eyebrow, title, meta, description, actions, children }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        {eyebrow && <span className="eyebrow mb-1.5 block">{eyebrow}</span>}

        <h1 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.025em] text-zinc-900 dark:text-text-primary">
          {title}
        </h1>

        {(meta != null || description) && (
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-zinc-500 dark:text-text-secondary">
            {meta != null && (
              <span className="font-mono tabular-nums text-zinc-400 dark:text-text-muted">
                {meta}
              </span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}

        {children}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
