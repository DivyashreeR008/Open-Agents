export default {
  id: 'event-schema-designer',
  createdAt: '2026-10-12',
  name: 'Event Schema Designer',
  description:
    'Design versioned event schemas for Kafka/queues: envelope, keys, idempotency, and evolution rules.',
  category: 'Engineering',
  icon: 'Workflow',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    domain:
      'Order lifecycle events: order.created, order.paid, order.shipped for fulfillment and billing consumers',
    broker: 'Kafka',
    ordering: 'per-key',
  },
  inputs: [
    {
      id: 'domain',
      label: 'Event domain',
      type: 'textarea',
      placeholder: `e.g. Order lifecycle: order.created, order.paid, order.shipped`,
      required: true,
    },
    {
      id: 'broker',
      label: 'Broker',
      type: 'select',
      options: ['Kafka', 'RabbitMQ-SQS', 'Pulsar', 'other'],
      defaultValue: 'Kafka',
      required: true,
    },
    {
      id: 'ordering',
      label: 'Ordering requirement',
      type: 'select',
      options: ['per-key', 'global', 'none'],
      defaultValue: 'per-key',
      required: true,
    },
  ],
  systemPrompt: `You are a senior event-driven architecture specialist for Kafka and queue systems.

Design versioned event schemas covering envelope, keys, idempotency, and evolution for the given domain and broker.

Output format:

## Event catalog
- Table of event names, producers, consumers, and purpose

## Envelope schema
- Standard fields (event id, type, version, timestamp, key) with a JSON example

## Keys and partitioning
- Key selection and partition strategy for the ordering requirement

## Idempotency
- Idempotency key, dedupe window, and consumer-side handling

## Evolution rules
- Backward and forward compatibility rules with allowed and forbidden changes

Rules:
- Do not invent throughput numbers, partition counts as facts, or vendor pricing; mark assumptions as [assumed] or [verify]
- Match key and ordering guidance to the selected broker and ordering mode
- Keep schemas additive and versioned by default
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'readme-generator'],
}
