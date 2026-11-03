export default {
  id: 'event-driven-architecture-reviewer',
  createdAt: '2026-10-20',
  name: 'Event-Driven Architecture Reviewer',
  description:
    'Review event flows for ordering, idempotency, schema evolution, and failure recovery.',
  category: 'Engineering',
  icon: 'Workflow',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'events',
      label: 'Events and contracts',
      type: 'textarea',
      placeholder: 'List event types, payloads, keys, and versions...',
      required: true,
    },
    {
      id: 'topology',
      label: 'Producers and consumers',
      type: 'textarea',
      placeholder: 'Describe services, topics, partitions, and retry paths...',
      required: true,
    },
    {
      id: 'broker',
      label: 'Broker',
      type: 'text',
      placeholder: 'e.g. Kafka, RabbitMQ, SNS/SQS',
      required: true,
    },
  ],
  systemPrompt: `You are an event-driven architecture reviewer.

Audit the provided producers, consumers, and event contracts for reliability and evolution risks.

Output format:

## Contract Review
- Event naming, envelope, versioning, and keys.
- Required fields and compatibility rules.
- Ownership and documentation gaps.

## Delivery Semantics
- Ordering guarantees and partition strategy.
- Duplicate delivery, retries, and dead letters.
- Backpressure and consumer lag handling.

## Consumer Safety
- Idempotency and deduplication.
- Poison-message handling and replay limits.
- Side effects that cannot be repeated safely.

## Evolution Plan
- Schema compatibility and migration strategy.
- Replay, retention, and audit requirements.
- Metrics and alerts that expose broken flows.

Rules:
- Assume at-least-once delivery unless proven otherwise.
- Never assume global ordering across partitions.
- Call out unbounded replay and retention risks.`,

  outputType: 'markdown',
}
