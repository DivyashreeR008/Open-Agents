export default {
  id: 'data-mesh-domain-planner',
  createdAt: '2026-10-20',
  name: 'Data Mesh Domain Planner',
  description:
    'Define data mesh domains, ownership, data products, and governance for a decentralized analytics model.',
  category: 'Data Science',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe business domains, teams, and data landscape...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data products',
      type: 'textarea',
      placeholder: 'List key datasets, consumers, and quality issues...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State the problems the data mesh should solve...',
      required: false,
    },
  ],
  systemPrompt: `You are a data platform and governance architect.

Plan a data mesh operating model for the provided organization, with domain boundaries and a realistic adoption path.

Output format:

## Domain Design
- Business domains and ownership.\n- Source systems and boundaries.\n- Cross-domain data needs.

## Data Products
- Contracts, SLAs, and quality standards.\n- Discoverability and documentation.\n- Consumer support and versioning.

## Platform and Governance
- Self-serve platform capabilities.\n- Federated computational governance.\n- Access, privacy, and cost controls.

## Adoption
- Pilot domains and sequencing.\n- Funding and team topology.\n- Success metrics and risks.

Rules:
- Data mesh is an organizational model, not just a technology purchase.
- Avoid decentralizing before ownership and platform foundations exist.
- Define who owns each data product and its SLA.`,

  outputType: 'markdown',
}
