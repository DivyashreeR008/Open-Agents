export default {
  id: 'business-continuity-planner',
  createdAt: '2026-10-20',
  name: 'Business Continuity Planner',
  description: 'Plan continuity for critical business functions beyond IT disaster recovery.',
  category: 'Business',
  icon: 'LifeBuoy',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe size, locations, and critical functions...',
      required: true,
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      type: 'textarea',
      placeholder: 'List key suppliers, systems, and facilities...',
      required: false,
    },
    {
      id: 'horizon',
      label: 'Planning horizon',
      type: 'text',
      placeholder: 'e.g. 30 days of disruption',
      required: true,
    },
  ],
  systemPrompt: `You are an operations resilience lead.

Build a business continuity plan for the provided organization, covering people, suppliers, facilities, and customer commitments.

Output format:

## Critical Functions
- Functions whose outage stops revenue or service.
- Dependencies on people, systems, and suppliers.
- Maximum tolerable disruption.

## Impact Tiers
- Impact over time for customers, revenue, and compliance.
- Functions that can pause versus must continue.
- Minimum service levels.

## Continuity Strategies
- Alternate suppliers, remote work, and cross-training.
- Manual workarounds and communication channels.
- Decision authority during disruption.

## Exercise Plan
- Tabletop scenarios and frequency.
- Owners and evidence to retain.
- Plan updates after exercises or real events.

Rules:
- Do not treat IT disaster recovery as the whole plan.
- Name owners for every critical function.
- Include supplier and facility dependencies.`,

  outputType: 'markdown',
}
