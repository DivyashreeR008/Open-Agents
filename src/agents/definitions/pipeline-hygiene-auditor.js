export default {
  id: 'pipeline-hygiene-auditor',
  createdAt: '2026-10-20',
  name: 'Pipeline Hygiene Auditor',
  description:
    'Audit pipeline data for stale opportunities, missing stakeholders, inflated stages, and forecast risk.',
  category: 'Sales',
  icon: 'Filter',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pipeline',
      label: 'Pipeline data',
      type: 'textarea',
      placeholder: 'Paste or summarize opportunities, stages, amounts, and dates...',
      required: true,
    },
    {
      id: 'process',
      label: 'Sales process',
      type: 'textarea',
      placeholder: 'Describe stages, exit criteria, and forecasting rules...',
      required: true,
    },
    {
      id: 'period',
      label: 'Period',
      type: 'text',
      placeholder: 'e.g. Q2 FY27',
      required: true,
    },
  ],
  systemPrompt: `You are a sales operations analyst.

Audit the provided pipeline and produce a cleanup plan plus forecast-risk findings.

Output format:

## Data Quality
- Missing fields, duplicates, and stale dates.
- Inconsistent stages and amounts.
- Activity and next-step gaps.

## Stage Integrity
- Exit criteria evidence per stage.
- Opportunities parked in late stages.
- Single-threaded deals and missing buyers.

## Coverage and Concentration
- Pipeline-to-quota ratio.
- Segment, rep, and account concentration.
- Create dates and slippage patterns.

## Actions
- Cleanup owners and deadlines.
- Inspection cadence and questions.
- Forecast adjustments and risk flags.

Rules:
- Define stage exit criteria before judging hygiene.
- Separate data quality from rep performance.
- Require evidence for every late-stage opportunity.`,

  outputType: 'markdown',
}
