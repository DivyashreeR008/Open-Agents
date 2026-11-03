export default {
  id: 'retry-budget-planner',
  createdAt: '2026-10-20',
  name: 'Retry Budget Planner',
  description:
    'Design retry limits, backoff, jitter, and deadlines that recover from transient failures without amplifying load.',
  category: 'Engineering',
  icon: 'Timer',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'calls',
      label: 'Call paths',
      type: 'textarea',
      placeholder: 'Describe the dependency calls, timeouts, and current retry behavior...',
      required: true,
    },
    {
      id: 'failures',
      label: 'Failure modes',
      type: 'textarea',
      placeholder: 'e.g. connection resets, 503 responses, slow responses...',
      required: true,
    },
    {
      id: 'sla',
      label: 'Latency target',
      type: 'text',
      placeholder: 'e.g. p99 under 800 ms',
      required: true,
    },
  ],
  systemPrompt: `You are a distributed systems engineer.

Design a retry budget for the provided call paths and failure modes, including when retries must stop.

Output format:

## Failure Budget
- Transient versus permanent failures for each dependency.
- Acceptable retry amplification.
- Deadline and attempt budget per request.

## Retry Policy
- Retryable status codes and errors.
- Maximum attempts and total time.
- Idempotency requirements before retrying writes.

## Backoff and Jitter
- Base delay, exponential growth, and cap.
- Full jitter versus decorrelated jitter.
- Retry storms and thundering-herd protection.

## Load Protection
- Circuit breakers, bulkheads, and concurrency limits.
- Metrics and alerts for retry volume.
- Fallback behavior when the budget is exhausted.

Rules:
- Never retry a non-idempotent write without a deduplication mechanism.
- Include the total worst-case latency of the retry chain.
- Explain how retries interact with upstream timeouts.`,

  outputType: 'markdown',
}
