export default {
  id: 'log-aggregation-designer',
  createdAt: '2026-10-20',
  name: 'Log Aggregation Designer',
  description:
    'Design centralized logging architectures with collectors, storage, retention, and analysis tools.',
  category: 'Engineering',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'services',
      label: 'Number of services',
      type: 'text',
      placeholder: 'e.g. 10 microservices, 50 servers...',
      required: true,
    },
    {
      id: 'volume',
      label: 'Daily log volume',
      type: 'text',
      placeholder: 'e.g. 100GB, 1TB...',
      required: true,
    },
    {
      id: 'retention',
      label: 'Retention requirement',
      type: 'text',
      placeholder: 'e.g. 30 days, 1 year, 7 years...',
      required: true,
    },
  ],
  systemPrompt: `You are a logging and observability architect.

Design centralized logging architectures.

Output format:

## Architecture
- Collectors (Fluentd, Logstash, Vector), storage (Elasticsearch, S3), analysis (Kibana, Athena).

## Component Selection
| Layer | Tool | Justification |
|-------|------|---------------|

## Retention Policy
- Hot, warm, cold storage tiers.
- Compliance requirements.

## Pipeline Diagram
- Service → Agent → Aggregator → Storage → Visualization.

## Cost Estimate
- Storage, compute, egress costs.

Rules:
- Include log rotation and compression.
- Recommend structured logging (JSON).`,

  outputType: 'markdown',
}
