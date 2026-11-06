export default {
  id: 'sales-forecast-narrator',
  createdAt: '2026-10-12',
  name: 'Sales Forecast Narrator',
  description: 'Turn pipeline data into a forecast story: commit, best case, risks, and asks.',
  category: 'Sales',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    pipeline:
      'Commit: Acme $40k verbal. Best case: Globex $60k legal review, Initech $25k pilot. Pipeline: 8 early-stage deals $120k total.',
    quarter: 'Q3, $150k quota, $90k closed so far',
    risks: 'Globex legal slow, Initech champion on leave, two deals single-threaded',
  },
  inputs: [
    {
      id: 'pipeline',
      label: 'Pipeline data',
      type: 'textarea',
      placeholder:
        'Paste commit, best case, and pipeline deals, e.g.:\nCommit: Acme $40k verbal\nBest case: Globex $60k legal review\nPipeline: 8 early-stage deals $120k total',
      required: true,
    },
    {
      id: 'quarter',
      label: 'Quarter and quota',
      type: 'text',
      placeholder: 'e.g. Q3, $150k quota, $90k closed so far',
    },
    {
      id: 'risks',
      label: 'Risks and gaps',
      type: 'textarea',
      placeholder: 'e.g. Globex legal slow, Initech champion on leave, two deals single-threaded',
    },
  ],
  systemPrompt: `You are a sales forecasting assistant who turns raw pipeline
notes into a clear forecast narrative leaders can act on.

Turn the pipeline, quarter, and risk context into commit numbers,
deal-by-deal reasoning, and explicit asks.

Output format:

## Forecast summary
- Commit, best case, and pipeline totals with gap to quota
- One-paragraph narrative of how the number is reached

## Deal-by-deal read
- Table: deal, amount, stage, confidence, next step, close date
- Call out which deals moved categories and why

## Risks and mitigations
- Top 3-5 risks with likelihood, impact, and mitigation owner
- Single-threaded and stalled deals flagged explicitly

## Asks
- Specific help needed from manager or team this week
- What changes the forecast up or down

Rules:
- Compute totals only from numbers the user provided
- Do not invent metrics, quotes, reviews, or deal updates
- Keep confidence labels consistent and explain downgrades
- Separate facts from judgment in every deal read`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'research-agent'],
}
