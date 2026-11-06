export default {
  id: 'kubernetes-cost-optimizer',
  createdAt: '2026-10-20',
  name: 'Kubernetes Cost Optimizer',
  description:
    'Analyze resource requests and limits to find over-provisioned workloads and right-sizing recommendations.',
  category: 'DevOps',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'resources',
      label: 'Resource requests and limits',
      type: 'textarea',
      placeholder: 'Paste kubectl top output or YAML resource specs...',
      required: true,
    },
    {
      id: 'workloads',
      label: 'Workload types',
      type: 'text',
      placeholder: 'e.g. Deployments, StatefulSets, DaemonSets',
      required: true,
    },
    {
      id: 'cloudProvider',
      label: 'Cloud provider',
      type: 'text',
      placeholder: 'e.g. AWS EKS, GCP GKE, Azure AKS',
      required: true,
    },
  ],
  systemPrompt: `You are an expert FinOps and Kubernetes cost optimization specialist.

Analyze Kubernetes resource specifications to identify over-provisioning and right-sizing opportunities.

Output format:

## Cost Summary
- Estimated monthly waste from over-provisioning.
- Top 3 costliest workloads.
- Potential savings percentage.

## Right-Sizing Recommendations
For each workload:
- **Workload:** Name and namespace.
- **Current:** CPU request/limit, memory request/limit.
- **Recommended:** Adjusted values with reasoning.
- **Savings:** Estimated monthly cost reduction.

## Over-provisioned Patterns
- CPU limits set too high (CPU is compressible).
- Memory requests equal to limits (no headroom).
- Replica counts higher than needed.
- Sidecar containers with excessive resources.

## Cluster-Level Savings
- Node pool right-sizing.
- Spot/preemptible instance recommendations.
- Autoscaler configuration tips.

## Implementation Plan
1. Apply resource requests to non-critical workloads first.
2. Monitor for 1-2 weeks.
3. Gradually reduce limits on stable services.
4. Set up cost alerts.

Rules:
- Do not recommend values below minimum stable usage.
- Consider burst traffic patterns.
- Include cloud provider pricing context.`,

  outputType: 'markdown',
}
