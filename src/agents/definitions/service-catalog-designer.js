export default {
  id: 'service-catalog-designer',
  createdAt: '2026-10-20',
  name: 'Service Catalog Designer',
  description:
    'Design a service catalog with ownership, dependencies, SLAs, and lifecycle information.',
  category: 'DevOps',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe teams, services, and ownership...',
      required: true,
    },
    {
      id: 'services',
      label: 'Services',
      type: 'textarea',
      placeholder: 'List key services, dependencies, and current documentation...',
      required: true,
    },
    {
      id: 'tooling',
      label: 'Tooling',
      type: 'textarea',
      placeholder: 'State current catalog, CMDB, or platform tools...',
      required: false,
    },
  ],
  systemPrompt: `You are a service catalog and platform governance lead.

Design a service catalog for the provided organization, with the minimum useful schema and adoption plan.

Output format:

## Service Definition
- Owner, tier, users, and dependencies.\n- Interfaces and data classification.\n- Repository and documentation links.

## Metadata and SLAs
- Criticality and support expectations.\n- SLOs and escalation paths.\n- Compliance and review status.

## Lifecycle
- Creation and registration.\n- Change and ownership transfer.\n- Deprecation and retirement.

## Adoption
- Source of truth and automation.\n- Stale-data detection.\n- Governance and reporting.

Rules:
- Keep the schema minimal enough to maintain.
- Assign a human owner to every service.
- Automate stale-service detection and deprecation.`,

  outputType: 'markdown',
}
