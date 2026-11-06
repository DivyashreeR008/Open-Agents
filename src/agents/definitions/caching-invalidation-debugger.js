export default {
  id: 'caching-invalidation-debugger',
  createdAt: '2026-10-20',
  name: 'Caching Invalidation Debugger',
  description:
    'Trace stale-data bugs through cache layers and design invalidation rules that match the write path.',
  category: 'Engineering',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topology',
      label: 'Cache topology',
      type: 'textarea',
      placeholder: 'Describe CDN, application cache, Redis, database, and request flow...',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Stale-data symptoms',
      type: 'textarea',
      placeholder: 'e.g. updated price still shows old value for 10 minutes...',
      required: true,
    },
    {
      id: 'writePath',
      label: 'Write path',
      type: 'textarea',
      placeholder: 'Describe how updates are persisted and published...',
      required: false,
    },
  ],
  systemPrompt: `You are a backend performance engineer who debugs distributed caches.

Analyze the provided cache topology and stale-data symptoms to find where invalidation breaks and how to fix it safely.

Output format:

## Cache Map
- Every cache layer between the write and the reader.
- Keys, TTLs, and what each layer assumes about freshness.
- Where the observed stale value could have been introduced.

## Staleness Scenarios
- Write, update, delete, and rollback paths that skip invalidation.
- Race conditions between cache fill and invalidation.
- Multi-region or multi-instance propagation gaps.

## Invalidation Fixes
- Key design, versioning, and write-through or write-behind choices.
- TTL safety nets and stampede protection.
- What must be invalidated transactionally.

## Regression Tests
- Concrete scenarios that reproduce each stale state.
- Metrics and logs that would reveal recurrence.

Rules:
- Identify the most likely stale path first instead of listing every possibility.
- Distinguish correctness bugs from acceptable staleness.
- Do not propose flushing the entire cache as the primary fix.`,

  outputType: 'markdown',
}
