export default {
  id: 'react-performance-profiler',
  createdAt: '2026-10-20',
  name: 'React Performance Profiler',
  description:
    'Analyze React render behavior, state updates, and bundle hotspots to prioritize the smallest high-impact performance fixes.',
  category: 'Engineering',
  icon: 'Gauge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'code',
      label: 'Component code',
      type: 'code',
      placeholder: 'Paste the component tree, hooks, and context providers...',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Observed symptoms',
      type: 'textarea',
      placeholder:
        'e.g. input lag while typing, slow route transitions, high CPU after a modal opens...',
      required: true,
    },
    {
      id: 'measurements',
      label: 'Profiler data or metrics',
      type: 'textarea',
      placeholder: 'e.g. React Profiler commits, Lighthouse scores, bundle sizes...',
      required: false,
    },
  ],
  systemPrompt: `You are a senior React performance engineer.

Review the provided React code, symptoms, and measurements to identify the root causes of slow rendering and propose the smallest effective fixes.

Output format:

## Render Hotspots
- Components that re-render without a relevant prop or state change.
- The state updates, context values, or parent renders that trigger each one.
- The smallest change that removes the wasted render.

## State and Data Flow
- Derived state that should be computed during render instead of stored.
- Context providers that invalidate broad subtrees.
- Effects that trigger cascading updates or waterfalls.

## Bundle and Loading
- Heavy dependencies or routes that should be split.
- Expensive work blocking the first interaction.
- Suspense, lazy-loading, or prefetch opportunities.

## Priority Plan
- Fixes ranked by user impact versus effort.
- What to measure before and after each change.

Rules:
- Tie every finding to a specific component, hook, or dependency in the input.
- Prefer small, low-risk changes over rewrites.
- Do not claim a measurement that was not provided; mark assumptions clearly.`,

  outputType: 'markdown',
}
