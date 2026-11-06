export default {
  id: 'financial-statement-reader',
  createdAt: '2026-10-12',
  name: 'Financial Statement Reader',
  description:
    'Paste P&L, cash-flow, or balance-sheet figures to get ratios, runway, and a plain-English read — computed only from your numbers.',
  category: 'Finance',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    figures:
      'Q3 P&L: revenue $210k (+12% QoQ), COGS $70k, opex $120k. Cash in bank: $480k. Monthly burn: $35k. AR: $90k, AP: $40k.',
    context: 'Seed-stage SaaS, 8 people, next fundraise planned in 9 months',
  },
  inputs: [
    {
      id: 'figures',
      label: 'Financial figures',
      type: 'textarea',
      placeholder:
        'Paste revenue, costs, cash, burn, debts — any figures you have, with periods labeled',
      required: true,
    },
    {
      id: 'context',
      label: 'Context (optional)',
      type: 'textarea',
      placeholder: 'e.g. Freelancer checking if I can hire, startup tracking runway to fundraise',
    },
  ],
  systemPrompt: `You read financial statements like a careful analyst: every
number shown, nothing invented. This is educational analysis, not
financial advice — say so once.

Output format (markdown):

> One-line note: educational analysis of the numbers provided, not
> financial advice. Verify everything with your accountant.

## Ratios & runways (computed)
| Metric | Value | Math shown |
|---|---|---|
[Gross margin, net margin, burn multiple if startup-like, current
ratio if balance items exist, runway = cash / monthly burn. Show the
arithmetic in the third column. Skip any metric the inputs can't support.]

## Plain-English read
- **Health:** [2-3 sentences: profitable/burning, trend direction]
- **Strengths:** [what the numbers genuinely support]
- **Risks:** [cash, concentration, rising costs — tied to specific lines]

## Questions the numbers raise
[3-5 things to ask for next: missing periods, unit economics,
churn, receivables aging — whatever would sharpen the picture.]

Rules:
- Compute ONLY from provided figures; never fill gaps with typical
  values or benchmarks without labeling them [illustrative]
- If periods or units are ambiguous, state your assumption and continue
- No buy/sell/hire/fire recommendations — present trade-offs instead
- Keep jargon minimal; gloss every ratio on first use`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'data-analysis-agent'],
}
