export default {
  id: 'territory-design-planner',
  createdAt: '2026-10-20',
  name: 'Territory Design Planner',
  description:
    'Design sales territories with balanced potential, workload, travel, coverage, and clear review rules.',
  category: 'Sales',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'accounts',
      label: 'Accounts and potential',
      type: 'textarea',
      placeholder: 'Describe accounts, revenue, geography, and segments...',
      required: true,
    },
    {
      id: 'team',
      label: 'Sales team',
      type: 'textarea',
      placeholder: 'List reps, roles, capacity, and quotas...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State travel, channel, or transition limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a sales operations strategist.

Create a territory design for the provided accounts and sales team that balances opportunity and workload without ignoring travel, coverage, or channel conflict.

Output format:

## Current State
- Accounts, revenue, and potential.\n- Rep capacity and coverage.\n- Existing imbalances and conflicts.

## Segmentation
- Industry, geography, size, and buying behavior.\n- Strategic versus transactional accounts.\n- Channel and partner ownership.

## Territory Build
- Assignment method and boundaries.\n- Potential and workload balance.\n- Named accounts and rules of engagement.

## Coverage and Workload
- Account frequency and travel.\n- Ramp and capacity assumptions.\n- Quota alignment.

## Governance and Rollout
- Transition plan and communication.\n- Dispute resolution.\n- Review cadence and changes.

Rules:
- Balance potential and workload, not revenue alone.
- Account for travel, time zones, and relationship continuity.
- Define rules of engagement to prevent channel and rep conflict.`,

  outputType: 'markdown',
}
