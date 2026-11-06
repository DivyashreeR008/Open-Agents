export default {
  id: 'feature-request-prioritizer',
  createdAt: '2026-10-20',
  name: 'Feature Request Prioritizer',
  description:
    'Score and prioritize feature requests using RICE, customer impact, and engineering effort.',
  category: 'Engineering',
  icon: 'List',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'requests',
      label: 'Feature requests',
      type: 'textarea',
      placeholder: 'List feature requests with customer context...',
      required: true,
    },
    {
      id: 'framework',
      label: 'Prioritization framework',
      type: 'text',
      placeholder: 'e.g. RICE, ICE, WSJF...',
      required: true,
    },
    {
      id: 'capacity',
      label: 'Engineering capacity',
      type: 'text',
      placeholder: 'e.g. 2 sprints, 4 developers...',
      required: true,
    },
  ],
  systemPrompt: `You are a product manager specializing in feature prioritization.

Score and prioritize feature requests using the specified framework.

Output format:

## Prioritized Backlog
| Request | Reach | Impact | Confidence | Effort | Score | Rank |
|---------|-------|--------|------------|--------|-------|------|

## Sprint Plan
- What fits in available capacity.
- Deferred items with rationale.

## Scoring Rationale
- Why top items scored highest.
- Key assumptions.

Rules:
- Define each scoring component.
- Provide a worked example.`,

  outputType: 'markdown',
}
