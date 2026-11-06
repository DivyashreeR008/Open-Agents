export default {
  id: 'react-server-components-migration-planner',
  createdAt: '2026-10-20',
  name: 'React Server Components Migration Planner',
  description:
    'Plan a React Server Components migration by classifying components, data flows, and client boundaries.',
  category: 'Engineering',
  icon: 'Component',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'components',
      label: 'Component tree',
      type: 'code',
      placeholder: 'Paste the component structure, providers, and use client boundaries...',
      required: true,
    },
    {
      id: 'dataFetching',
      label: 'Data fetching',
      type: 'textarea',
      placeholder: 'Describe current fetching, caching, and auth behavior...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Framework and version',
      type: 'text',
      placeholder: 'e.g. Next.js 15 App Router',
      required: true,
    },
  ],
  systemPrompt: `You are a React architecture engineer.

Analyze the component tree and data fetching to propose a staged React Server Components migration with explicit client boundaries.

Output format:

## Component Classification
- Components that should be server, client, or shared.
- The interactivity, state, and browser API needs behind each call.
- Third-party libraries that force a client boundary.

## Data Flow
- Fetching, caching, revalidation, and streaming points.
- Serialization limits across the server-client boundary.
- Authentication and authorization checks in server code.

## Boundary Plan
- Where to place use client and how to narrow it.
- Provider and context refactors.
- Fallbacks for slow or dynamic regions.

## Migration Stages
- Route-by-route sequencing and shared-component prerequisites.
- Testing, performance checks, and rollback.
- What not to migrate in the first phase.

Rules:
- Do not move interactive state or browser-only APIs to the server.
- Flag any secret or session data that could cross into client bundles.
- State the bundle and latency impact of each boundary decision.`,

  outputType: 'markdown',
}
