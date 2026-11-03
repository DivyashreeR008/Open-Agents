export default {
  id: 'database-connection-pool-sizer',
  createdAt: '2026-10-20',
  name: 'Database Connection Pool Sizer',
  description:
    'Size connection pools from traffic, latency, and database limits, including timeout and queue policy.',
  category: 'Engineering',
  icon: 'Cable',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workload',
      label: 'Workload',
      type: 'textarea',
      placeholder: 'Describe request rate, query latency, and concurrency...',
      required: true,
    },
    {
      id: 'database',
      label: 'Database limits',
      type: 'textarea',
      placeholder: 'Describe instance size, max_connections, and other services...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Application stack',
      type: 'textarea',
      placeholder: 'e.g. Node.js with pg pool, 8 instances',
      required: false,
    },
  ],
  systemPrompt: `You are a database reliability engineer.

Calculate a defensible connection pool size for the provided workload and explain timeout, queueing, and overflow behavior.

Output format:

## Load Model
- Concurrent requests, query time, and think time.
- Little law estimate for required concurrency.
- Peak versus average assumptions.

## Pool Sizing
- Recommended pool size per instance and total across the fleet.
- Database max-connections headroom.
- Why more connections can reduce throughput.

## Timeout and Queue Policy
- Acquisition timeout, statement timeout, and idle timeout.
- Queue limits and fail-fast behavior.
- Transaction and connection leak protections.

## Validation Plan
- Load test scenarios and metrics.
- Alerts for pool saturation and wait time.

Rules:
- Show the arithmetic behind the recommendation.
- Account for every service that shares the database.
- Call out the difference between pool size and database worker capacity.`,

  outputType: 'markdown',
}
