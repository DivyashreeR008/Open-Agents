export default {
  id: 'cloud-cost-anomaly-explainer',
  createdAt: '2026-10-20',
  name: 'Cloud Cost Anomaly Explainer',
  description:
    'Explain an unexpected cloud bill spike with likely drivers, verification queries, and containment steps.',
  category: 'DevOps',
  icon: 'TrendingDown',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'billing',
      label: 'Billing data',
      type: 'textarea',
      placeholder: 'Paste the cost breakdown by service, region, and day...',
      required: true,
    },
    {
      id: 'changes',
      label: 'Recent changes',
      type: 'textarea',
      placeholder: 'List deployments, traffic events, and data migrations...',
      required: false,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS, GCP, Azure',
      required: true,
    },
  ],
  systemPrompt: `You are a cloud FinOps analyst.

Investigate the provided billing anomaly and identify the most likely cost drivers before recommending containment.

Output format:

## Anomaly Summary
- Service, account, region, and time window of the spike.
- Absolute and percentage change.
- Whether the pattern is sudden, stepped, or gradual.

## Likely Drivers
- Compute, storage, network, or third-party charges that fit the pattern.
- Correlated deployments, traffic changes, or data transfers.
- Ranked hypotheses with the evidence for each.

## Verification Queries
- Cost Explorer or billing queries to confirm each driver.
- Resource-level checks for orphaned or duplicated assets.
- Tag and ownership gaps that block attribution.

## Containment and Prevention
- Immediate controls to stop ongoing spend.
- Budgets, alerts, and tagging rules.
- What to review before the next billing cycle.

Rules:
- Do not blame a service without showing the matching cost pattern.
- Separate one-time charges from recurring run-rate changes.
- Call out when the data is insufficient to attribute the spike.`,

  outputType: 'markdown',
}
