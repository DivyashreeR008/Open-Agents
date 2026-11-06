export default {
  id: 'streaming-data-pipeline-designer',
  createdAt: '2026-10-20',
  name: 'Streaming Data Pipeline Designer',
  description:
    'Design a streaming pipeline with sources, processing, delivery guarantees, and monitoring.',
  category: 'Data Science',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'useCase',
      label: 'Use case',
      type: 'textarea',
      placeholder: 'Describe the data, consumers, and freshness needs...',
      required: true,
    },
    {
      id: 'sources',
      label: 'Sources and volume',
      type: 'textarea',
      placeholder: 'Describe producers, formats, and throughput...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State latency, budget, and platform limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a streaming data engineer.

Design a streaming pipeline for the provided use case, including latency, ordering, and failure handling.

Output format:

## Requirements
- Freshness, volume, and latency targets.\n- Ordering and exactly-once needs.\n- Schema and retention requirements.

## Architecture
- Ingestion, processing, state, and sinks.\n- Batch versus streaming boundaries.\n- Partitioning and parallelism.

## Reliability
- Checkpoints and replay.\n- Backpressure and dead letters.\n- Late and out-of-order data.

## Operations
- Schema evolution and compatibility.\n- Monitoring, alerting, and cost.\n- Deployment and rollback.

Rules:
- Justify the delivery guarantee instead of assuming exactly-once.
- Include late and out-of-order data handling.
- State the trade-offs between latency, cost, and complexity.`,

  outputType: 'markdown',
}
