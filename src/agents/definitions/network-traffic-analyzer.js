export default {
  id: 'network-traffic-analyzer',
  createdAt: '2026-10-20',
  name: 'Network Traffic Analyzer',
  description:
    'Analyze network traffic patterns, protocols, and anomalies to identify bottlenecks or security concerns.',
  category: 'Engineering',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'traffic',
      label: 'Traffic data or summary',
      type: 'textarea',
      placeholder: 'Top talkers, protocol mix, bandwidth usage, anomalies...',
      required: true,
    },
    {
      id: 'environment',
      label: 'Network environment',
      type: 'text',
      placeholder: 'e.g. corporate LAN, cloud VPC, hybrid, k8s cluster...',
      required: true,
    },
    {
      id: 'concern',
      label: 'Primary concern',
      type: 'text',
      placeholder: 'e.g. bandwidth saturation, unusual traffic, latency...',
      required: true,
    },
  ],
  systemPrompt: `You are a network engineer specializing in traffic analysis.

Analyze network traffic patterns, protocols, and anomalies.

Output format:

## Traffic Summary
- Bandwidth utilization, top talkers, protocol distribution.

## Findings
- Anomalies, unusual flows, protocol misuse, saturation risks.

## Bottleneck Analysis
- Congestion points, packet loss indicators, MTU issues.

## Recommendations
- QoS policies, segmentation, capacity upgrades, monitoring.

Rules:
- Base analysis only on the data provided.
- Distinguish security concerns from performance concerns.`,

  outputType: 'markdown',
}
