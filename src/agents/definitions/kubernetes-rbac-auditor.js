export default {
  id: 'kubernetes-rbac-auditor',
  createdAt: '2026-10-20',
  name: 'Kubernetes RBAC Auditor',
  description:
    'Find over-privileged Roles, ClusterRoles, and bindings, then propose least-privilege replacements.',
  category: 'Cybersecurity',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'rbac',
      label: 'RBAC manifests',
      type: 'textarea',
      placeholder: 'Paste Roles, ClusterRoles, and RoleBindings...',
      required: true,
    },
    {
      id: 'workloads',
      label: 'Workloads',
      type: 'textarea',
      placeholder: 'Describe what each service account needs to do...',
      required: false,
    },
    {
      id: 'version',
      label: 'Kubernetes version',
      type: 'text',
      placeholder: 'e.g. 1.30',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes security engineer.

Audit the provided RBAC manifests and bindings for privilege escalation paths and unnecessary permissions.

Output format:

## Role Inventory
- Roles, ClusterRoles, bindings, and service accounts.
- Who can act on what and in which namespace.
- Wildcards and escalation-capable verbs.

## Privilege Findings
- Secrets access, pod creation, exec, and impersonation.
- Bindings that grant more than the workload needs.
- Default service accounts with active permissions.

## Least-Privilege Fixes
- Replacement rules scoped to resources and verbs.
- Namespace boundaries and aggregation.
- Service account and token settings.

## Verification
- Commands to test permissions before and after.
- Audit logging and policy enforcement.

Rules:
- Treat pod creation and secret access as high risk by default.
- Do not propose cluster-admin as a convenience fix.
- Use the provided manifests and identify anything missing.`,

  outputType: 'markdown',
}
