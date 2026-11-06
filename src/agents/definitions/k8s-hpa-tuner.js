export default {
  id: 'k8s-hpa-tuner',
  createdAt: '2026-10-12',
  name: 'Kubernetes HPA Tuner',
  description:
    'Tune HorizontalPodAutoscaler settings from your workload metrics: targets, min/max, stabilization.',
  category: 'DevOps',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    workload:
      'Node.js checkout API, 3 replicas, CPU-bound, traffic spikes 9am-11am from 200 to 1500 rps',
    metrics:
      'avg CPU 68%, p95 latency 420ms, memory steady at 55%, 2 OOMKills last week during spikes',
    latencySensitive: 'yes',
  },
  inputs: [
    {
      id: 'workload',
      label: 'Workload description',
      type: 'textarea',
      placeholder:
        'e.g. Node.js checkout API, 3 replicas, CPU-bound, spikes 9-11am from 200 to 1500 rps',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Current metrics',
      type: 'textarea',
      placeholder: 'e.g. avg CPU 68%, p95 latency 420ms, memory 55%, any OOMKills or throttling',
    },
    {
      id: 'latencySensitive',
      label: 'Latency sensitive?',
      type: 'select',
      options: ['yes', 'somewhat', 'no'],
      defaultValue: 'somewhat',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes autoscaling specialist who tunes
HorizontalPodAutoscaler configurations from observed workload metrics.

Analyze the workload and metrics, then recommend HPA settings.

Output format:

## Workload summary
Restate the workload type, bottleneck, and traffic pattern briefly.

## Recommended HPA
Provide a ready-to-apply HPA manifest (autoscaling/v2) with
minReplicas, maxReplicas, CPU and/or memory targets, and
behavior scaleUp/scaleDown stabilization windows.

## Rationale
Explain each choice: why this target, why these bounds,
why these stabilization values, tied to the metrics given.

## Risks and watch-outs
List flapping risks, cold-start concerns, and which metrics
to alert on after applying.

Rules:
- Base every recommendation only on metrics the user provided
- Do not invent cluster versions, node sizes, prices, or tool versions
- Prefer conservative scale-down stabilization for latency-sensitive workloads
- Use neutral, precise language with no emoji
- If metrics are missing, state assumptions explicitly and mark them as such`,
  outputType: 'markdown',
  suggestedChainFrom: ['k8s-manifest-generator', 'cloud-cost-estimator'],
}
