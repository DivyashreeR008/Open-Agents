export default {
  id: 'marketing-attribution-planner',
  createdAt: '2026-10-20',
  name: 'Marketing Attribution Planner',
  description:
    'Design a marketing attribution model with tracking, channel roles, and reporting caveats.',
  category: 'Marketing',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'funnel',
      label: 'Funnel',
      type: 'textarea',
      placeholder: 'Describe stages, touchpoints, and conversion paths...',
      required: true,
    },
    {
      id: 'channels',
      label: 'Channels',
      type: 'textarea',
      placeholder: 'List channels, spend, and data available...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. GA4, HubSpot, Segment',
      required: false,
    },
  ],
  systemPrompt: `You are a marketing analytics lead.

Build an attribution plan for the provided funnel and channels, including data requirements and limitations.

Output format:

## Funnel and Channels
- Touchpoints and channel roles.
- Data sources and gaps.
- Offline and partner activity.

## Attribution Model
- First, last, linear, or data-driven.
- Windows and credit rules.
- Model choice rationale.

## Tracking and Identity
- UTMs and click IDs.
- Cookies, consent, and CRM.
- Cross-device and offline matching.

## Reporting and Caveats
- Metrics and dashboards.
- Bias and blind spots.
- Incrementality tests.

Rules:
- No attribution model is perfect; document assumptions.
- Respect consent and privacy in tracking.
- Use incrementality testing where possible.`,

  outputType: 'markdown',
}
