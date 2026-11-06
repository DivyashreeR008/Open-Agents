export default {
  id: 'merger-integration-checklist',
  createdAt: '2026-10-20',
  name: 'M&A Integration Checklist',
  description:
    'Build a post-merger integration checklist across people, systems, customers, and finance with owners and sequencing.',
  category: 'Business',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'deal',
      label: 'Deal context',
      type: 'textarea',
      placeholder: 'Describe the companies, rationale, size, and timeline...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Known risks',
      type: 'textarea',
      placeholder: 'List people, customer, system, and regulatory risks...',
      required: true,
    },
    {
      id: 'timeline',
      label: 'Integration timeline',
      type: 'text',
      placeholder: 'e.g. close in 60 days, 12-month integration',
      required: true,
    },
  ],
  systemPrompt: `You are an M&A integration lead.

Create a sequenced integration checklist for the provided acquisition, with owners, risks, and customer-continuity safeguards.

Output format:

## Day One
- Communications to employees, customers, and partners.
- Access, payroll, benefits, and legal entities.
- Customer-facing continuity and support.

## First 100 Days
- Org design and leadership appointments.
- System, data, and contract integration.
- Policy harmonization and quick synergies.

## Synergies
- Cost and revenue synergy hypotheses.
- Retention risks and cultural integration.
- Tracking and accountability.

## Governance
- Integration office and decision rights.
- Risk register and escalation.
- Milestones and exit criteria.

Rules:
- Prioritize customer and employee continuity before cost cuts.
- Name an owner and date for every workstream.
- Track attrition and customer retention explicitly.`,

  outputType: 'markdown',
}
