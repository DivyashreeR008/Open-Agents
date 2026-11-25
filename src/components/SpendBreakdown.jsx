import { formatCost } from '../lib/formatting'
import { costSourceLabel, readCostProvenance } from '../lib/spendProvenance'

export default function SpendBreakdown({ runs, totalSpend, summary, onReset }) {
  return (
    <section aria-label="Spend breakdown">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="eyebrow">Session spend</span>
        <span className="font-mono text-[10px] text-zinc-400 dark:text-text-muted">
          {runs.length} run{runs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-xs">Recorded subtotal</p>
      <p className="mb-2 font-mono text-lg font-semibold tabular-nums">{formatCost(totalSpend)}</p>
      <dl className="mb-2 text-xs">
        <div className="flex justify-between gap-2">
          <dt>Reported</dt>
          <dd>{formatCost(summary.reported)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Estimated</dt>
          <dd>{formatCost(summary.estimated)}</dd>
        </div>
        {summary.unattributed > 0 && (
          <div className="flex justify-between gap-2">
            <dt>Source unknown</dt>
            <dd>{formatCost(summary.unattributed)}</dd>
          </div>
        )}
      </dl>
      {summary.estimatedComponents > 0 && (
        <p className="mb-2 text-xs">
          Includes estimates from token counts and a local price table.
        </p>
      )}
      {summary.unknownComponents > 0 && (
        <p className="mb-2 text-xs">
          Incomplete: {summary.unknownComponents} input/output cost component
          {summary.unknownComponents === 1 ? '' : 's'} unknown. Missing costs are excluded; older
          amounts have an unknown source. This is not a bill.
        </p>
      )}
      <p className="mb-2 text-xs">
        Covers the newest {runs.length} retained runs. Prices are in USD.
      </p>
      <ul className="mb-2 max-h-48 space-y-2 overflow-y-auto" aria-label="Recent run costs">
        {runs.slice(0, 10).map((run, index) => {
          const sources = readCostProvenance(run)
          return (
            <li key={index} className="font-mono text-[10px] break-words">
              <span>{run.model || 'Unknown'}</span>
              <p>
                {costSourceLabel(run)} ·{' '}
                {run.totalCost > 0 || sources.input !== 'unknown' || sources.output !== 'unknown'
                  ? formatCost(run.totalCost)
                  : 'Unknown'}
              </p>
              <p>
                Input: {sources.input}
                {sources.input !== 'unknown' ? ` ${formatCost(run.inputCost)}` : ''}; output:{' '}
                {sources.output}
                {sources.output !== 'unknown' ? ` ${formatCost(run.outputCost)}` : ''}
              </p>
            </li>
          )
        })}
      </ul>
      <button onClick={onReset} className="text-xs underline">
        Reset
      </button>
    </section>
  )
}
