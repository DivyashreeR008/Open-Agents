export default {
  id: 'kubernetes-upgrade-planner',
  createdAt: '2026-10-20',
  name: 'Kubernetes Upgrade Planner',
  description:
    'Plan a Kubernetes version upgrade with deprecation checks, node draining, and rollback gates.',
  category: 'DevOps',
  icon: 'ArrowUpCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'cluster',
      label: 'Cluster details',
      type: 'textarea',
      placeholder: 'Describe version, provider, nodes, CNI, CSI, and addons...',
      required: true,
    },
    {
      id: 'workloads',
      label: 'Workloads',
      type: 'textarea',
      placeholder: 'List critical workloads, PDBs, and stateful services...',
      required: true,
    },
    {
      id: 'targetVersion',
      label: 'Target version',
      type: 'text',
      placeholder: 'e.g. 1.30 to 1.31',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes platform engineer.

Build a safe upgrade plan for the provided cluster, workloads, and target version.

Output format:

## Readiness Audit
- Removed and deprecated APIs in use.
- Addon, CNI, CSI, and CRD compatibility.
- Node image and runtime versions.

## Upgrade Sequence
- Control plane, nodes, and workload order.
- Maintenance windows and capacity headroom.
- Managed versus self-managed responsibilities.

## Workload Safety
- Pod disruption budgets and draining behavior.
- Stateful services and persistent volumes.
- Rollback-compatible API usage.

## Verification and Rollback
- Health checks, SLOs, and smoke tests.
- Abort criteria and rollback steps.
- Post-upgrade cleanup and documentation.

Rules:
- Check every removed API against live manifests and Helm charts.
- Never drain nodes without verified capacity headroom.
- Include addon compatibility, not just the control plane.`,

  outputType: 'markdown',
}
