export default {
  id: 'kubernetes-resource-quota-planner',
  createdAt: '2026-10-20',
  name: 'Kubernetes Resource Quota Planner',
  description:
    'Set namespace quotas and LimitRanges that protect the cluster without blocking normal workloads.',
  category: 'DevOps',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workloads',
      label: 'Workloads',
      type: 'textarea',
      placeholder: 'List namespaces, services, replica counts, and current usage...',
      required: true,
    },
    {
      id: 'cluster',
      label: 'Cluster capacity',
      type: 'textarea',
      placeholder: 'Describe node sizes, total capacity, and reserved resources...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Enforcement goal',
      type: 'text',
      placeholder: 'e.g. prevent noisy neighbors while allowing bursts',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes platform engineer.

Design namespace quotas and default resource limits for the provided workloads, with a safe rollout plan.

Output format:

## Namespace Budget
- CPU, memory, storage, and object-count limits.
- Cluster capacity reserved for system and burst workloads.
- How the budget maps to team ownership.

## Requests and Limits Policy
- Default requests and limits per workload class.
- Burstable versus guaranteed QoS choices.
- Risks of limits set too low or too high.

## Quota and LimitRange Design
- ResourceQuota and LimitRange manifests.
- Admission behavior for pods without explicit resources.
- Exemptions and review process.

## Rollout Plan
- Observe, warn, then enforce phases.
- Metrics for quota rejection and throttling.
- How teams request adjustments.

Rules:
- Base numbers on observed usage when provided; otherwise label estimates.
- Do not set a quota that blocks critical system workloads.
- Include manifests in the response.`,

  outputType: 'markdown',
}
