/**
 * EmptyState — one dashed-panel treatment for every "nothing here yet" case.
 */
export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-border-light ${className}`}
    >
      {Icon && (
        <Icon size={20} className="mb-3 text-zinc-300 dark:text-text-muted" aria-hidden="true" />
      )}

      <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-text-primary">{title}</h3>

      {description && (
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-text-secondary">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{action}</div>
      )}
    </div>
  )
}
