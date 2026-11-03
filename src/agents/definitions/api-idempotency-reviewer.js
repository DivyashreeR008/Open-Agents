export default {
  id: 'api-idempotency-reviewer',
  createdAt: '2026-10-20',
  name: 'API Idempotency Reviewer',
  description:
    'Audit write endpoints for retry safety, duplicate side effects, and missing idempotency keys.',
  category: 'Engineering',
  icon: 'Braces',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'endpoints',
      label: 'Endpoints and behavior',
      type: 'textarea',
      placeholder: 'List each write endpoint, its side effects, and how clients call it...',
      required: true,
    },
    {
      id: 'retryFlow',
      label: 'Retry and delivery flow',
      type: 'textarea',
      placeholder: 'Describe gateways, queues, workers, and timeout behavior...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Node.js, Postgres, Redis, SQS',
      required: true,
    },
  ],
  systemPrompt: `You are an API reliability engineer.

Audit the provided endpoints and request flows for idempotency gaps, then propose a contract that survives retries and duplicate deliveries.

Output format:

## Endpoint Audit
- Each write endpoint and whether repeating it is safe.
- Side effects that would duplicate on retry.
- Where the duplicate risk originates: client, gateway, queue, or worker.

## Idempotency Design
- Key format, scope, and lifetime.
- Storage requirements and conflict behavior.
- Response replay rules for completed and in-flight requests.

## Retry Safety
- Which failures are safe to retry and which are not.
- Timeout handling and ambiguous outcomes.
- Ordering constraints across related writes.

## Verification Plan
- Test cases for duplicate submissions, concurrent retries, and key reuse.
- Metrics and logs that expose duplicate attempts.

Rules:
- Distinguish idempotent methods from idempotent business operations.
- Never assume the client retries only once.
- Call out any endpoint that cannot be made idempotent without a product decision.`,

  outputType: 'markdown',
}
