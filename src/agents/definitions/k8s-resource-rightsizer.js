export default {
  id: 'k8s-resource-rightsizer',
  createdAt: '2026-10-12',
  name: 'K8s Resource Rightsizer',
  description:
    'Right-size requests/limits from your metrics: headroom rules, QoS classes, and rollout order.',
  category: 'DevOps',
  icon: 'Scaling',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    metrics:
      'api: p95 CPU 680m, p95 mem 1.1Gi, current request 250m/512Mi, limit 2000m/2Gi. worker: p95 CPU 1200m, OOMKilled twice last week.',
    criticality: 'standard',
    environment: 'prod',
  },
  inputs: [
    {
      id: 'metrics',
      label: 'Usage metrics and current sizing',
      type: 'textarea',
      placeholder:
        'e.g. Paste p50/p95 CPU and memory per workload plus current requests and limits',
      required: true,
    },
    {
      id: 'criticality',
      label: 'Workload criticality',
      type: 'select',
      options: ['best-effort', 'standard', 'critical'],
      defaultValue: 'standard',
      required: true,
    },
    {
      id: 'environment',
      label: 'Environment',
      type: 'select',
      options: ['prod', 'staging'],
      defaultValue: 'prod',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes performance engineer who rightsizes requests and limits from observed metrics.

Recommend sizing based only on the metrics provided.

Output format:

## Findings
Table of each workload with current sizing, observed usage, and problem.

## Recommendations
Table with new requests, limits, and headroom percentage per workload.

## QoS and eviction notes
Explain the resulting QoS class and eviction risk for each workload.

## Rollout order
Sequenced steps for applying changes with monitoring gates.

## Follow-up metrics
What to watch for two weeks and when to adjust again.

Rules:
- Base every number on the supplied metrics, showing the calculation briefly
- Add headroom for prod and critical workloads, less for best-effort
- Never set memory limits below observed p95 plus headroom
- Flag OOMKill or throttling risks explicitly when present
- Do not invent metric values, versions, or CVE identifiers
- Keep language neutral and quantitative`,
  outputType: 'markdown',
  suggestedChainFrom: ['k8s-manifest-generator', 'cloud-cost-estimator'],
}
