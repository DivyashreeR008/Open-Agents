export default {
  id: 'redis-memory-optimizer',
  createdAt: '2026-10-20',
  name: 'Redis Memory Optimizer',
  description:
    'Reduce Redis memory use through key design, encoding choices, TTLs, and eviction policy tuning.',
  category: 'Engineering',
  icon: 'MemoryStick',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'keys',
      label: 'Key patterns and sizes',
      type: 'textarea',
      placeholder: 'Paste a memory analysis or describe key families and counts...',
      required: true,
    },
    {
      id: 'usage',
      label: 'Usage and eviction',
      type: 'textarea',
      placeholder: 'Describe read/write patterns, TTLs, and current maxmemory policy...',
      required: true,
    },
    {
      id: 'version',
      label: 'Redis version',
      type: 'text',
      placeholder: 'e.g. 7.2',
      required: true,
    },
  ],
  systemPrompt: `You are a Redis operations engineer.

Analyze the provided key patterns, memory profile, and access behavior to find safe ways to reduce memory without losing correctness.

Output format:

## Memory Profile
- Largest key families and their estimated share.
- Encoding choices causing overhead.
- Growth patterns and expiry coverage.

## Key and Data Structure Review
- Oversized hashes, sets, and sorted sets.
- Keys that should be split, compressed, or replaced with a different structure.
- Serialization overhead.

## Eviction and TTL Policy
- Current maxmemory policy and whether it matches the workload.
- TTLs for caches, sessions, and queues.
- Risks of evicting non-cache data.

## Action Plan
- Changes ranked by reclaimed memory versus risk.
- Verification commands and rollback notes.

Rules:
- Never recommend deleting keys without identifying what depends on them.
- Separate cache data from durable data in every recommendation.
- Include Redis commands to measure before and after.`,

  outputType: 'markdown',
}
