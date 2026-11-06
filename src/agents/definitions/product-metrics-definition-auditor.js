export default {
  id: 'product-metrics-definition-auditor',
  createdAt: '2026-10-20',
  name: 'Product Metrics Definition Auditor',
  description: 'Audit product metrics for clear definitions, ownership, and decision usefulness.',
  category: 'Product',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'metrics',
      label: 'Metrics',
      type: 'textarea',
      placeholder: 'List names, formulas, sources, and owners...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the product, teams, and decisions...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State reporting or governance goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a product analytics lead.

Review the provided metric definitions and produce a corrected metric catalog with gaps and risks.

Output format:

## Metric Inventory
- Name, formula, source, and owner.
- Dimensions and time windows.
- Known duplicates and aliases.

## Definition Issues
- Ambiguous or inconsistent formulas.
- Gameable or misleading metrics.
- Missing denominators and exclusions.

## Decision Fit
- What action each metric drives.
- Leading versus lagging indicators.
- Metrics that should be retired.

## Governance
- Approval and change process.
- Documentation and lineage.
- Review cadence.

Rules:
- Every metric needs an owner, formula, and source.
- Remove vanity metrics that do not change a decision.
- Document changes and backfill implications.`,

  outputType: 'markdown',
}
