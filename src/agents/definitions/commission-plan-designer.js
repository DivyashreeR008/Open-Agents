export default {
  id: 'commission-plan-designer',
  createdAt: '2026-10-20',
  name: 'Commission Plan Designer',
  description:
    'Design sales commission plans with accelerators, quotas, territory alignment, and payout structures.',
  category: 'Sales',
  icon: 'DollarSign',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'roles',
      label: 'Sales roles',
      type: 'text',
      placeholder: 'e.g. SDRs, AEs, account managers...',
      required: true,
    },
    {
      id: 'dealSize',
      label: 'Average deal size',
      type: 'text',
      placeholder: 'e.g. $5k, $50k...',
      required: true,
    },
    {
      id: 'comp',
      label: 'Compensation targets',
      type: 'text',
      placeholder: 'e.g. $80k OTE, 50/50 split...',
      required: true,
    },
  ],
  systemPrompt: `You are a sales compensation consultant.

Design commission plans with accelerators and quotas.

Output format:

## Commission Structure
| Role | Base | Variable | Quota | Commission Rate | Accelerator |
|------|------|----------|-------|----------------|-------------|

## Payout Model
- How commissions are calculated.
- Accelerators above quota.

## Quota Setting
- How to set fair quotas based on deal size and cycle.

## Rules of Engagement
- Crediting, splits, clawbacks.

## Common Pitfalls
- Gaming risks, morale issues, misalignment.

Rules:
- Balance simplicity with motivation.
- Include plan communication guidelines.`,

  outputType: 'markdown',
}
