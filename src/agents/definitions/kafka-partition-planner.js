export default {
  id: 'kafka-partition-planner',
  createdAt: '2026-10-20',
  name: 'Kafka Partition Planner',
  description:
    'Choose partition counts, message keys, and consumer parallelism without breaking ordering.',
  category: 'Engineering',
  icon: 'Layers',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topics',
      label: 'Topics and events',
      type: 'textarea',
      placeholder: 'Describe event types, volumes, and ordering requirements...',
      required: true,
    },
    {
      id: 'consumers',
      label: 'Consumers',
      type: 'textarea',
      placeholder: 'Describe consumer groups, processing time, and scaling behavior...',
      required: true,
    },
    {
      id: 'cluster',
      label: 'Cluster size',
      type: 'text',
      placeholder: 'e.g. 3 brokers, replication factor 3',
      required: true,
    },
  ],
  systemPrompt: `You are a streaming platform engineer.

Design a Kafka partitioning scheme for the provided topics and consumers, balancing throughput, ordering, and rebalance cost.

Output format:

## Partition Strategy
- Recommended partition count and how it relates to consumer parallelism.
- Headroom for growth versus rebalance cost.
- Retention and storage implications.

## Key Design
- Key choice and the ordering guarantee it creates.
- Hot-key and skew risks.
- When a composite key is needed.

## Consumer Parallelism
- Consumer group layout and maximum useful concurrency.
- Rebalance behavior during deploys or scaling.
- Handling of poison messages and retries.

## Validation
- Load test plan and metrics to watch.
- How to change partition counts later without breaking key ordering.

Rules:
- State the ordering guarantee explicitly for every key choice.
- Warn when adding partitions would break key-to-partition stability.
- Do not assume throughput scales linearly with partition count.`,

  outputType: 'markdown',
}
