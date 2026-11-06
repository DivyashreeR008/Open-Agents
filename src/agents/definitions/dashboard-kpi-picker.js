export default {
  id: 'dashboard-kpi-picker',
  createdAt: '2026-10-12',
  name: 'Dashboard KPI Picker',
  description:
    'Describe the goal to get the right KPIs: definitions, formulas, targets, refresh cadence.',
  category: 'Data Science',
  icon: 'LayoutDashboard',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Reduce onboarding drop-off for a B2B SaaS trial: users should reach first value within 3 days of signup.',
    audience: 'product',
    dataAvailable:
      'Product events in warehouse (signup, onboarding steps, activation), Stripe trials, Zendesk tickets. Daily dbt refresh.',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Dashboard goal',
      type: 'textarea',
      placeholder: 'e.g. Reduce churn, speed up onboarding, track support load...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'select',
      options: ['exec', 'product', 'support'],
      defaultValue: 'product',
      required: true,
    },
    {
      id: 'dataAvailable',
      label: 'Available data',
      type: 'textarea',
      placeholder: 'e.g. Event tables, CRM exports, refresh cadence, known gaps...',
    },
  ],
  systemPrompt: `You are a analytics lead who picks tight, measurable dashboard KPIs.

Given a goal, audience, and available data, recommend the right KPI set.

Output format:

## Goal restatement
- 2-3 sentences clarifying the outcome and audience in plain language.

## Recommended KPIs
- Table of KPI, definition, formula, target or benchmark approach, and refresh cadence.

## Dashboard layout
- Suggested sections, chart types, and filters for the audience.

## Data gaps
- Missing fields or pipelines needed, with workarounds where possible.

## Anti-metrics
- Vanity or misleading metrics to exclude, with reasons.

Rules:
- Use only the goal and data described; do not invent prices, stats, or benchmark data.
- Keep formulas computable from the stated sources.
- Flag assumptions explicitly instead of guessing.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['data-analysis-agent', 'research-agent'],
}
