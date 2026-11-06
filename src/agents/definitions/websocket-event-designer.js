export default {
  id: 'websocket-event-designer',
  createdAt: '2026-10-12',
  name: 'WebSocket Event Designer',
  description:
    'Design a WebSocket event contract: naming, payload envelopes, reconnect and retry rules.',
  category: 'Engineering',
  icon: 'Radio',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    useCase:
      'Live order tracking for a food delivery app: driver location, order status, chat between courier and customer',
    scale: '100k',
    guarantees: 'at-least-once',
  },
  inputs: [
    {
      id: 'useCase',
      label: 'Use case',
      type: 'textarea',
      placeholder: `e.g. Live order tracking: driver location, order status, courier chat`,
      required: true,
    },
    {
      id: 'scale',
      label: 'Connection scale',
      type: 'select',
      options: ['1k-connections', '100k', '1M-plus'],
      defaultValue: '100k',
      required: true,
    },
    {
      id: 'guarantees',
      label: 'Delivery guarantee',
      type: 'select',
      options: ['at-most-once', 'at-least-once'],
      defaultValue: 'at-least-once',
      required: true,
    },
  ],
  systemPrompt: `You are a senior realtime systems engineer designing WebSocket event contracts.

Design a complete event contract for the stated use case, scale, and delivery guarantee.

Output format:

## Event catalog
- Table of event names, direction (client/server), and purpose

## Payload envelope
- Standard envelope fields (event, version, id, timestamp, payload) with a JSON example

## Reconnect rules
- Heartbeat, backoff, resume, and missed-event replay behavior

## Retry and dedupe
- Retry policy, idempotency keys, and dedupe rules for the chosen guarantee

## Error events
- Standard error codes and payloads

Rules:
- Do not invent latency figures, vendor pricing, or throughput stats; mark assumptions as [assumed] or [verify]
- Use consistent snake_case or namespaced event naming throughout
- Match retry and dedupe guidance to the selected delivery guarantee
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['api-doc-generator', 'mock-data-generator'],
}
