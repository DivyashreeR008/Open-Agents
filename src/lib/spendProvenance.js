import { estimateInputCost, estimateOutputCost, getPricing } from './modelPricing'

const SOURCES = new Set(['reported', 'estimated', 'unknown'])

function validAmount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

// Explicit monetary amounts are receipts. Token counts alone are not: even
// provider-reported usage becomes an estimate when multiplied by our price table.
export function resolveCostComponent(model, tokens, explicitCost, side) {
  if (validAmount(explicitCost)) return { cost: explicitCost, source: 'reported' }
  const pricing = getPricing(model)
  const rate = pricing?.[`${side}CostPer1M`]
  if (!validAmount(tokens) || !validAmount(rate)) return { cost: 0, source: 'unknown' }
  const estimate = side === 'input' ? estimateInputCost : estimateOutputCost
  const cost = estimate(model, tokens)
  return validAmount(cost) ? { cost, source: 'estimated' } : { cost: 0, source: 'unknown' }
}

export function readCostProvenance(run) {
  const stored = run.costProvenance
  // Older numeric fields cannot establish how a price was obtained. Do not
  // retroactively label them as a receipt or reprice historical usage today.
  if (stored?.version !== 1) return { version: 1, input: 'unknown', output: 'unknown' }
  return {
    version: 1,
    input: SOURCES.has(stored.input) && validAmount(run.inputCost) ? stored.input : 'unknown',
    output: SOURCES.has(stored.output) && validAmount(run.outputCost) ? stored.output : 'unknown',
  }
}

export function summarizeSpend(runs) {
  const summary = {
    reported: 0,
    estimated: 0,
    unattributed: 0,
    reportedComponents: 0,
    estimatedComponents: 0,
    unknownComponents: 0,
  }
  for (const run of runs) {
    const sources = readCostProvenance(run)
    let attributed = 0
    for (const side of ['input', 'output']) {
      const source = sources[side]
      if (source === 'unknown') {
        summary.unknownComponents++
      } else {
        const amount = validAmount(run[`${side}Cost`]) ? run[`${side}Cost`] : 0
        summary[source] += amount
        summary[`${source}Components`]++
        attributed += amount
      }
    }
    summary.unattributed += Math.max(0, (run.totalCost || 0) - attributed)
  }
  return summary
}

export function costSourceLabel(run) {
  const source = readCostProvenance(run)
  const known = [source.input, source.output].filter((value) => value !== 'unknown')
  const label =
    new Set(known).size > 1 ? 'Mixed' : known[0] === 'reported' ? 'Reported' : 'Estimated'
  return known.length === 0 ? 'Source unknown' : known.length === 1 ? `${label}, incomplete` : label
}
