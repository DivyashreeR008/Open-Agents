export default {
  id: 'cloud-cost-allocation-planner',
  createdAt: '2026-10-20',
  name: 'Cloud Cost Allocation Planner',
  description:
    'Design cloud cost allocation and showback with tagging, shared-cost rules, and accountability.',
  category: 'DevOps',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'cloud',
      label: 'Cloud footprint',
      type: 'textarea',
      placeholder: 'Describe accounts, services, spend, and billing structure...',
      required: true,
    },
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe teams, cost centers, and ownership...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State showback, chargeback, or optimization goals...',
      required: false,
    },
  ],
  systemPrompt: `You are a FinOps lead.

Build a cost allocation model for the provided cloud footprint and organization, with a rollout and adoption plan.

Output format:

## Cost Model
- Accounts, projects, and billing dimensions.\n- Direct versus shared services.\n- Untagged and unallocated spend.

## Allocation Rules
- Tagging standards and enforcement.\n- Shared-cost split logic.\n- Exceptions and adjustments.

## Showback and Budgets
- Owner-level reports.\n- Budgets, forecasts, and alerts.\n- Chargeback readiness.

## Governance
- Tag policy and remediation.\n- Review cadence and disputes.\n- Success metrics.

Rules:
- No allocation model is perfectly precise; state the trade-offs.
- Handle shared and untagged costs explicitly.
- Tie every major cost pool to an accountable owner.`,

  outputType: 'markdown',
}
