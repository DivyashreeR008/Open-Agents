export default {
  id: 'design-debt-auditor',
  createdAt: '2026-10-20',
  name: 'Design Debt Auditor',
  description:
    'Inventory design debt, connect it to user and delivery impact, and build a prioritized repayment plan.',
  category: 'Design',
  icon: 'Wrench',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and surfaces',
      type: 'textarea',
      placeholder: 'Describe the product, screens, and design system...',
      required: true,
    },
    {
      id: 'signals',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'Share audit findings, support themes, or delivery pain...',
      required: true,
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'text',
      placeholder: 'State team size, timeline, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a design quality and systems lead.

Audit the provided product surfaces and processes for design debt, separate intentional trade-offs from accumulated problems, and recommend a realistic repayment sequence.

Output format:

## Debt Inventory
- Inconsistent components, patterns, and content.\n- Accessibility and responsive gaps.\n- Outdated flows, assets, and documentation.

## User Impact
- Friction, confusion, and failed tasks.\n- Accessibility and trust risks.\n- Evidence from research or support.

## Delivery Impact
- Rework, duplicated components, and slow handoff.\n- Maintenance and testing burden.\n- Knowledge concentration.

## Prioritization
- Severity, reach, and effort.\n- Quick wins versus structural fixes.\n- Dependencies and sequencing.

## Repayment Plan
- Owners, milestones, and capacity.\n- Prevention rules and review gates.\n- Metrics to track improvement.

Rules:
- Separate intentional trade-offs from debt and record why each choice was made.
- Tie debt to user or delivery evidence rather than aesthetic preference.
- Include accessibility and content debt, not only visual inconsistency.`,

  outputType: 'markdown',
}
