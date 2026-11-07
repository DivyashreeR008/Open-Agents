/**
 * SectionHeader — a section title with an optional monospace count and a
 * right-aligned action, used above lists and grids.
 */
export default function SectionHeader({ title, count, action, className = '' }) {
  const hasCount = count != null && count !== ''

  return (
    <div className={`mb-3 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex min-w-0 items-baseline gap-2">
        <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-text-primary">
          {title}
        </h2>
        {hasCount && (
          <span className="font-mono text-[11px] tabular-nums text-zinc-400 dark:text-text-muted">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  )
}
