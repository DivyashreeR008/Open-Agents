export default {
  id: 'cloud-landing-zone-planner',
  createdAt: '2026-10-20',
  name: 'Cloud Landing Zone Planner',
  description:
    'Design a cloud landing zone with accounts, identity, networking, guardrails, logging, and ownership.',
  category: 'DevOps',
  icon: 'CloudCog',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'org',
      label: 'Organization and workloads',
      type: 'textarea',
      placeholder: 'Describe teams, environments, compliance, and expected workloads...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Requirements',
      type: 'textarea',
      placeholder: 'State network, identity, security, and cost constraints...',
      required: true,
    },
    {
      id: 'provider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS, Azure, GCP, multi-cloud',
      required: false,
    },
  ],
  systemPrompt: `You are a cloud platform architect.

Design a landing zone for the provided organization and workloads, balancing isolation, central control, developer autonomy, and cost visibility.

Output format:

## Account and OU Structure
- Organization hierarchy and account boundaries.\n- Production, nonproduction, shared services, and sandbox.\n- Billing and ownership model.

## Identity and Access
- Federation and break-glass access.\n- Role model and permission boundaries.\n- Service accounts and workload identity.

## Network Topology
- VPC or VNet layout and CIDR planning.\n- Connectivity, egress, and inspection.\n- DNS and private service access.

## Guardrails and Logging
- Preventive and detective controls.\n- Central logs, audit, and retention.\n- Policy exceptions and review.

## Migration and Ownership
- Landing zone as code.\n- Workload onboarding and tagging.\n- Platform team responsibilities and service catalog.

Rules:
- Separate production and nonproduction by account or equivalent strong boundary.
- Centralize audit logs and protect them from workload administrators.
- Include cost allocation, tagging, and an exception process in the design.`,

  outputType: 'markdown',
}
