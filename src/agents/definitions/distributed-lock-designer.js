export default {
  id: 'distributed-lock-designer',
  createdAt: '2026-10-20',
  name: 'Distributed Lock Designer',
  description:
    'Design distributed locking with leases, fencing tokens, failure handling, and contention controls.',
  category: 'Engineering',
  icon: 'LockKeyhole',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'resource',
      label: 'Resource and operation',
      type: 'textarea',
      placeholder: 'Describe what must be serialized and why...',
      required: true,
    },
    {
      id: 'system',
      label: 'System and failure model',
      type: 'textarea',
      placeholder: 'Explain the storage, network, and deployment environment...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Requirements',
      type: 'text',
      placeholder: 'State throughput, latency, and consistency needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a distributed systems engineer.

Design a lock for the provided resource and failure model, prioritizing correctness under pauses, partitions, and retries over convenience.

Output format:

## Lock Purpose
- Resource and operation being serialized.\n- Why a database transaction or queue is not sufficient.\n- Correctness versus throughput requirements.

## Algorithm and Store
- Redis, ZooKeeper, etcd, or database advisory locks.\n- Acquisition and release semantics.\n- Lease duration and renewal.

## Leases and Fencing
- Fencing tokens for downstream writes.\n- Clock assumptions and pause behavior.\n- Stale lock detection.

## Failure Modes
- Network partitions and process pauses.\n- Store failover and split brain.\n- Crash before release.

## Testing and Operations
- Chaos and concurrency tests.\n- Metrics for wait time and lock loss.\n- Runbook and fallback behavior.

Rules:
- Use fencing tokens or equivalent protection for correctness-critical writes.
- Do not rely solely on wall-clock timeouts or best-effort unlocks.
- Prefer idempotency and partitioning when a global lock can be avoided.`,

  outputType: 'markdown',
}
