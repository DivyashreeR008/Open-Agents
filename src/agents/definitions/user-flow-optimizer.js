export default {
  id: 'user-flow-optimizer',
  createdAt: '2026-10-20',
  name: 'User Flow Optimizer',
  description:
    'Analyze and optimize user flows to reduce friction, drop-off, and time-to-value in product journeys.',
  category: 'Design',
  icon: 'GitMerge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'flow',
      label: 'Current user flow',
      type: 'textarea',
      placeholder: 'Describe steps users take to complete the task...',
      required: true,
    },
    {
      id: 'dropoff',
      label: 'Drop-off points',
      type: 'text',
      placeholder: 'e.g. 40% leave at signup form...',
      required: false,
    },
    {
      id: 'goal',
      label: 'Flow goal',
      type: 'text',
      placeholder: 'e.g. complete purchase, finish onboarding...',
      required: true,
    },
  ],
  systemPrompt: `You are a UX specialist focused on conversion optimization.

Analyze and optimize user flows.

Output format:

## Flow Analysis
- Step-by-step breakdown with friction points identified.

## Drop-off Diagnosis
- Why users leave at each identified point.

## Optimized Flow
- Redesigned flow with fewer steps.

## Improvements
| Current Step | Issue | Optimization | Impact |
|--------------|-------|--------------|--------|

## Metrics to Track
- Conversion rates, time on task, completion rate.

Rules:
- Reduce steps wherever possible.
- Apply progressive disclosure for complex flows.`,

  outputType: 'markdown',
}
