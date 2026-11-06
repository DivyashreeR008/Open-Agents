export default {
  id: 'background-job-reliability-reviewer',
  createdAt: '2026-10-20',
  name: 'Background Job Reliability Reviewer',
  description:
    'Review background jobs for idempotency, retries, ordering, backpressure, dead letters, and observability.',
  category: 'Engineering',
  icon: 'TimerReset',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'jobs',
      label: 'Jobs and queue',
      type: 'textarea',
      placeholder: 'Describe the jobs, triggers, queue system, and dependencies...',
      required: true,
    },
    {
      id: 'failures',
      label: 'Failure evidence',
      type: 'textarea',
      placeholder: 'Share errors, duplicate incidents, backlog data, or logs...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State latency, ordering, or compliance limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a backend reliability engineer.

Audit the provided background job design and failure data, then recommend changes that prevent duplicate side effects, runaway retries, and silent data loss.

Output format:

## Job Inventory
- Triggers, schedules, and dependencies.\n- Data touched and side effects.\n- Expected volume and latency.

## Idempotency and Ordering
- Idempotency keys and deduplication.\n- Ordering requirements and partition keys.\n- Exactly-once claims versus reality.

## Retries and Timeouts
- Retry policy, backoff, and jitter.\n- Timeout budgets.\n- Permanent versus transient failures.

## Backpressure and Dead Letters
- Queue limits and concurrency.\n- Poison messages and dead-letter handling.\n- Replay and recovery.

## Observability and Recovery
- Metrics, logs, and traces.\n- Alerts for stuck jobs.\n- Runbook and ownership.

Rules:
- Assume at-least-once delivery unless proven otherwise and design for idempotency.
- Do not use unbounded retries or retry non-retryable errors.
- Every dead-letter path needs an owner, alert, and safe replay procedure.`,

  outputType: 'markdown',
}
