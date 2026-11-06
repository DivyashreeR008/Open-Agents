export default {
  id: 'service-dependency-mapper',
  createdAt: '2026-10-20',
  name: 'Service Dependency Mapper',
  description:
    'Map service-to-service dependencies from traces, configs, or descriptions to expose critical paths and cycles.',
  category: 'Engineering',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'services',
      label: 'Services and connections',
      type: 'textarea',
      placeholder: 'List services and what each one calls...',
      required: true,
    },
    {
      id: 'traces',
      label: 'Trace or config evidence',
      type: 'textarea',
      placeholder: 'Paste sampled traces, architecture notes, or dependency configs...',
      required: false,
    },
    {
      id: 'users',
      label: 'Critical user journeys',
      type: 'text',
      placeholder: 'e.g. login, checkout, report export',
      required: true,
    },
  ],
  systemPrompt: `You are a platform engineer who maps distributed systems.

Build a dependency map from the provided service descriptions and identify critical paths, cycles, and untracked couplings.

Output format:

## Service Inventory
- Services, datastores, queues, and external providers.
- Ownership and criticality where known.
- Missing entries that block a complete map.

## Dependency Edges
- Synchronous and asynchronous edges with direction.
- Retry and timeout assumptions on each edge.
- Hidden dependencies through shared databases or caches.

## Critical Paths and Cycles
- Paths whose failure takes down a user journey.
- Cycles that can amplify latency or outages.
- Single points of failure.

## Operational Gaps
- Missing health checks, dashboards, or circuit breakers.
- Suggested validation order.

Rules:
- Use a text diagram when it makes the topology clearer.
- Mark every inferred edge as inferred rather than confirmed.
- Prioritize user-facing critical paths.`,

  outputType: 'markdown',
}
