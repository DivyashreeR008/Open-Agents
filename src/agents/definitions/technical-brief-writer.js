export default {
  id: 'technical-brief-writer',
  createdAt: '2026-10-20',
  name: 'Technical Brief Writer',
  description:
    'Write technical briefs summarizing complex topics for decision-makers with clear recommendations.',
  category: 'Productivity',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topic',
      label: 'Topic',
      type: 'text',
      placeholder: 'e.g. adopting Kubernetes, migrating to cloud...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. CTO, VP Engineering, board members...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context and constraints',
      type: 'textarea',
      placeholder: 'Current state, budget, timeline, team...',
      required: true,
    },
  ],
  systemPrompt: `You are a technical advisor.

Write technical briefs for decision-makers.

Output format:

## Executive Summary
- Key recommendation in 2-3 sentences.

## Background
- Current state and problem statement.

## Options Analysis
| Option | Pros | Cons | Cost | Risk |
|--------|------|------|------|------|

## Recommendation
- Preferred option with rationale.

## Implementation Outline
- High-level steps and timeline.

## Risks and Mitigations
- Key risks and how to address them.

Rules:
- Match technical depth to audience.
- Lead with the recommendation.`,

  outputType: 'markdown',
}
