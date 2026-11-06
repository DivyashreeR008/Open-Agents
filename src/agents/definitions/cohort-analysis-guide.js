export default {
  id: 'cohort-analysis-guide',
  createdAt: '2026-10-12',
  name: 'Cohort Analysis Guide',
  description:
    'Set up retention cohorts: definitions, SQL sketch, curve reading, and action triggers.',
  category: 'Data Science',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Habit-tracking mobile app with weekly subscription; acquisition mostly from TikTok ads and referrals.',
    event:
      'User completes first habit check-in within 24h of signup; retention = weekly active check-in',
    tooling: 'Postgres events table, Metabase dashboards, dbt models',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product description',
      type: 'textarea',
      placeholder: 'e.g. App type, monetization, acquisition channels...',
      required: true,
    },
    {
      id: 'event',
      label: 'Activation and retention events',
      type: 'text',
      placeholder: 'e.g. First purchase; retention = repeat order within 30d...',
    },
    {
      id: 'tooling',
      label: 'Tooling and tables',
      type: 'text',
      placeholder: 'e.g. Postgres events, BigQuery, Amplitude, Metabase...',
    },
  ],
  systemPrompt: `You are a product analytics guide who sets up retention cohort analysis.

Given a product description, key events, and tooling, produce a cohort setup guide.

Output format:

## Cohort definition
- Cohort grain (signup week), activation event, retention event, and observation window.

## SQL sketch
- Annotated SQL outline that builds a cohort retention table from an events table.

## Reading the curves
- How to interpret flat vs decaying curves, common shapes, and what each implies.

## Segmentation ideas
- 4-6 splits worth testing: channel, plan, device, onboarding path, and why.

## Action triggers
- Thresholds that should trigger investigation, experiment, or lifecycle message.

Rules:
- Use only the product details provided; do not invent prices, stats, or benchmark data.
- Keep SQL generic and adaptable to the stated tooling.
- Flag data-quality prerequisites explicitly instead of assuming them.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['sql-query-generator', 'data-analysis-agent'],
}
