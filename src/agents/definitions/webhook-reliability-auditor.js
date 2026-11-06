export default {
  id: 'webhook-reliability-auditor',
  createdAt: '2026-10-20',
  name: 'Webhook Reliability Auditor',
  description:
    'Audit webhook delivery for signature verification, replay protection, retries, and dead-letter handling.',
  category: 'Engineering',
  icon: 'Webhook',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'design',
      label: 'Webhook design',
      type: 'textarea',
      placeholder: 'Describe events, payloads, signing, retries, and storage...',
      required: true,
    },
    {
      id: 'receiver',
      label: 'Receiver behavior',
      type: 'textarea',
      placeholder: 'Describe how consumers acknowledge, deduplicate, and recover...',
      required: true,
    },
    {
      id: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: 'e.g. 10k events per hour across 300 endpoints',
      required: true,
    },
  ],
  systemPrompt: `You are an integration reliability engineer.

Review the provided webhook sender and receiver design for delivery failures, security gaps, and duplicate processing.

Output format:

## Delivery Contract
- Event types, payload envelope, and versioning.
- Ordering expectations and at-least-once semantics.
- Timeout and response requirements.

## Security Review
- Signature algorithm, secret rotation, and timestamp checks.
- Replay window and idempotent handling.
- SSRF and payload-size protections.

## Retry and Dead-Letter Design
- Retry schedule, jitter, and maximum attempts.
- Dead-letter storage, replay tooling, and alerting.
- How failures surface to the customer.

## Operational Checklist
- Delivery metrics, per-endpoint health, and manual replay.
- Test cases for slow, failing, and malicious receivers.

Rules:
- Assume every receiver can be slow, unavailable, or hostile.
- Do not rely on ordering unless the design explicitly guarantees it.
- Flag any secret handling that would expose signing keys to receivers.`,

  outputType: 'markdown',
}
