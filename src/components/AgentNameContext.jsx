export default function AgentNameContext({ context, compact = false }) {
  if (!context) return null
  return (
    <span className="mt-1 block break-words text-[11px] font-normal leading-relaxed text-zinc-500 dark:text-text-secondary">
      <span className="block">Agent ID: {context.id}</span>
      <span className="block">{context.inputContext}</span>
      <span className="block">
        Name overlap:{' '}
        {context.matches
          .slice(0, compact ? 1 : 3)
          .map((peer) => `${peer.name} [${peer.id}]`)
          .join(' · ')}
        {context.matches.length > (compact ? 1 : 3)
          ? ` · +${context.matches.length - (compact ? 1 : 3)} more`
          : ''}
      </span>
      {!compact && (
        <span className="block">
          Title match only; not a duplicate or workflow-stage classification.
        </span>
      )}
    </span>
  )
}
