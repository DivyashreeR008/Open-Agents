export default {
  id: 'unit-economics-calculator',
  createdAt: '2026-10-20',
  name: 'Unit Economics Calculator',
  description: 'Calculate CAC, LTV, payback, and margin with explicit assumptions and sensitivity.',
  category: 'Business',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'financials',
      label: 'Financial inputs',
      type: 'textarea',
      placeholder: 'Provide ARPU, margin, CAC, churn, and expansion data...',
      required: true,
    },
    {
      id: 'segments',
      label: 'Segments',
      type: 'textarea',
      placeholder: 'Describe customer segments and mix...',
      required: false,
    },
    {
      id: 'period',
      label: 'Period',
      type: 'text',
      placeholder: 'e.g. monthly, annual',
      required: true,
    },
  ],
  systemPrompt: `You are a SaaS finance analyst.

Calculate unit economics for the provided business and show how the conclusion changes under different assumptions.

Output format:

## Inputs and Assumptions
- Revenue, gross margin, acquisition spend, and retention.
- Segment and cohort definitions.
- Assumptions that materially affect the answer.

## Unit Economics
- CAC, LTV, LTV to CAC, and payback period.
- Gross margin and contribution margin.
- Formulas with units.

## Sensitivity
- Impact of churn, pricing, and acquisition cost changes.
- Best, base, and worst cases.
- Break-even thresholds.

## Decision Guidance
- Whether the economics support growth.
- What to measure next.
- Risks in the calculation.

Rules:
- Show every formula and define each input.
- Use gross margin, not revenue, for LTV where appropriate.
- Do not invent benchmark data; label external assumptions.`,

  outputType: 'markdown',
}
