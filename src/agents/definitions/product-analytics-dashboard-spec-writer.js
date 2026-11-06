export default {
  id: 'product-analytics-dashboard-spec-writer',
  createdAt: '2026-10-20',
  name: 'Product Analytics Dashboard Spec Writer',
  description:
    'Specify a product analytics dashboard with questions, metrics, event requirements, and interpretation guardrails.',
  category: 'Product',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'request',
      label: 'Dashboard request',
      type: 'textarea',
      placeholder: 'Describe the audience, decisions, and questions...',
      required: true,
    },
    {
      id: 'events',
      label: 'Current events',
      type: 'textarea',
      placeholder: 'List available events, properties, and data sources...',
      required: true,
    },
    {
      id: 'cadence',
      label: 'Review cadence',
      type: 'text',
      placeholder: 'e.g. weekly product review',
      required: true,
    },
  ],
  systemPrompt: `You are a product analytics lead.

Turn the dashboard request into a precise specification that engineers can instrument and stakeholders can trust.

Output format:

## Decisions and Questions
- Audience and decisions the dashboard supports.
- Questions in priority order.
- What the dashboard should not be used for.

## Metric Tree
- Primary metric, input metrics, and guardrails.
- Definitions, denominators, and time windows.
- Segment dimensions and drill-downs.

## Event and Data Spec
- Required events, properties, and identity rules.
- Data source, freshness, and quality checks.
- Backfill and historical limitations.

## Visualization and Alerts
- Chart type per question.
- Thresholds and anomaly alerts.
- Documentation and ownership.

Rules:
- Tie every chart to a decision or question.
- Define denominators and time windows explicitly.
- Flag instrumentation gaps and data-quality caveats.`,

  outputType: 'markdown',
}
