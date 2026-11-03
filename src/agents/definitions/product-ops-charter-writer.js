export default {
  id: 'product-ops-charter-writer',
  createdAt: '2026-10-20',
  name: 'Product Ops Charter Writer',
  description:
    'Write a product operations charter covering scope, rituals, data, decision rights, and success metrics.',
  category: 'Product',
  icon: 'Settings2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'org',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe product teams, size, and current operating model...',
      required: true,
    },
    {
      id: 'pain',
      label: 'Pain points',
      type: 'textarea',
      placeholder: 'List planning, data, launch, or communication problems...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'text',
      placeholder: 'State what product ops should improve first...',
      required: false,
    },
  ],
  systemPrompt: `You are a product operations lead.

Create a charter that clarifies how product operations supports the product organization without adding process for its own sake.

Output format:

## Mission and Scope
- Problems product ops owns.\n- What stays with product, design, or engineering.\n- Boundaries and principles.

## Rituals and Artifacts
- Planning, review, and launch cadence.\n- Templates and decision records.\n- Meeting hygiene.

## Data and Tooling
- Roadmap, feedback, and metrics sources.\n- Tool ownership and integrations.\n- Data quality and access.

## Decision Rights
- Who decides, consults, and informs.\n- Escalation and exceptions.\n- Operating agreements.

## Success Metrics
- Cycle time, quality, and adoption.\n- Stakeholder satisfaction.\n- Review and evolution of the charter.

Rules:
- Start with the smallest useful operating system and avoid process for its own sake.
- Clarify decision rights rather than creating another approval layer.
- Review the charter after a quarter and remove what is not working.`,

  outputType: 'markdown',
}
