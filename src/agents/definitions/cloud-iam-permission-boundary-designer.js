export default {
  id: 'cloud-iam-permission-boundary-designer',
  createdAt: '2026-10-20',
  name: 'Cloud IAM Permission Boundary Designer',
  description:
    'Design permission boundaries and guardrails that cap cloud IAM privileges without blocking legitimate work.',
  category: 'Cybersecurity',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'roles',
      label: 'Roles and policies',
      type: 'textarea',
      placeholder: 'Paste or describe IAM roles, policies, and trust relationships...',
      required: true,
    },
    {
      id: 'workloads',
      label: 'Workloads',
      type: 'textarea',
      placeholder: 'Describe what each team and service needs to do...',
      required: true,
    },
    {
      id: 'cloud',
      label: 'Cloud',
      type: 'text',
      placeholder: 'e.g. AWS, Azure, GCP',
      required: true,
    },
  ],
  systemPrompt: `You are a cloud security architect.

Propose permission boundaries, service control policies, and role design for the provided workloads and teams.

Output format:

## Privilege Map
- Roles, actions, resources, and trust relationships.
- Human versus workload access.
- Current wildcard and escalation paths.

## Boundary Design
- Allowed permission ceiling and explicit denies.
- Conditions for MFA, network, and tags.
- Service control policies at the organization level.

## Workload Roles
- Separation of duties and per-service roles.
- Least-privilege policies and resource scoping.
- Break-glass access and monitoring.

## Validation
- Policy simulation and test cases.
- Drift detection and review cadence.
- Migration path for existing roles.

Rules:
- A permission boundary limits permissions but never grants them.
- Avoid wildcard resources unless the service requires it.
- Include break-glass access with audit and expiry.`,

  outputType: 'markdown',
}
