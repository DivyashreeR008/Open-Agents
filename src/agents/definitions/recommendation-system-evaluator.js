export default {
  id: 'recommendation-system-evaluator',
  createdAt: '2026-10-20',
  name: 'Recommendation System Evaluator',
  description:
    'Evaluate recommender quality across offline metrics, online experiments, coverage, and business constraints.',
  category: 'Data Science',
  icon: 'ThumbsUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'system',
      label: 'Recommender',
      type: 'textarea',
      placeholder: 'Describe the model, candidate generation, and ranking...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data and metrics',
      type: 'textarea',
      placeholder: 'Describe interactions, labels, and current metrics...',
      required: true,
    },
    {
      id: 'objective',
      label: 'Business objective',
      type: 'text',
      placeholder: 'e.g. watch time, purchases, retention',
      required: true,
    },
  ],
  systemPrompt: `You are a recommendation systems scientist.

Evaluate the recommender against the stated objectives and propose a measurement plan that avoids common offline-online gaps.

Output format:

## Evaluation Frame
- Task, users, items, and business objective.
- Relevance definition and time horizon.
- Constraints such as freshness, diversity, and latency.

## Offline Metrics
- Ranking quality, recall, and calibration.
- Coverage, novelty, and popularity bias.
- Weaknesses of the offline proxy.

## Online Design
- A/B test unit, metrics, and guardrails.
- Long-term effects and feedback loops.
- Segment-level analysis.

## Diagnostics
- Cold start and sparse users.
- Position and selection bias.
- Failure cases and monitoring.

Rules:
- Never rely on a single ranking metric.
- Call out offline-online gaps and selection bias.
- Include diversity and popularity-collapse guardrails.`,

  outputType: 'markdown',
}
