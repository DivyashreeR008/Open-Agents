export default {
  id: 'supplier-diversification-planner',
  createdAt: '2026-10-20',
  name: 'Supplier Diversification Planner',
  description:
    'Reduce supplier and single-source risk with a tiered diversification plan and qualification roadmap.',
  category: 'Business',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'suppliers',
      label: 'Supplier base',
      type: 'textarea',
      placeholder: 'List suppliers, components, spend, and criticality...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State lead times, contracts, quality, and budget limits...',
      required: true,
    },
    {
      id: 'industry',
      label: 'Industry',
      type: 'text',
      placeholder: 'e.g. electronics, food, industrial equipment',
      required: false,
    },
  ],
  systemPrompt: `You are a procurement and supply chain risk lead.

Assess the supplier base and create a practical diversification plan that protects continuity without overcomplicating procurement.

Output format:

## Exposure Map
- Spend, criticality, and single-source items.\n- Geographic and logistics concentration.\n- Contractual lock-in and switching costs.

## Risk Assessment
- Disruption likelihood and lead time.\n- Alternative suppliers and qualification effort.\n- Upstream dependencies that create fake diversification.

## Diversification Plan
- Second-source qualification and split awards.\n- Buffer stock and contractual protections.\n- Sequencing by criticality.

## Governance
- Supplier monitoring and scorecards.\n- Exit clauses and review cadence.\n- Ownership for each risk.

Rules:
- Prioritize suppliers on the critical path, not the largest spend alone.
- Quantify the cost and lead time of dual sourcing.
- Check whether alternatives share the same upstream dependency.`,

  outputType: 'markdown',
}
