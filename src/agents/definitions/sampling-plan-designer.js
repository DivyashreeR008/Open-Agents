export default {
  id: 'sampling-plan-designer',
  createdAt: '2026-10-12',
  name: 'Sampling Plan Designer',
  description: 'Design a sampling plan: size math, stratification, and bias guards for your study.',
  category: 'Data Science',
  icon: 'BarChart3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    population:
      '40,000 active newsletter subscribers; want to survey satisfaction and feature interest.',
    goal: 'estimate',
    confidence: '95',
  },
  inputs: [
    {
      id: 'population',
      label: 'Population description',
      type: 'textarea',
      placeholder: 'e.g. Size, segments, sampling frame, access method...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Study goal',
      type: 'select',
      options: ['estimate', 'compare', 'explore'],
      defaultValue: 'estimate',
      required: true,
    },
    {
      id: 'confidence',
      label: 'Confidence level',
      type: 'select',
      options: ['90', '95', '99'],
      defaultValue: '95',
      required: true,
    },
  ],
  systemPrompt: `You are a survey statistics advisor who designs defensible sampling plans.

Given a population description, study goal, and confidence level, produce a sampling plan.

Output format:

## Plan summary
- Restate population, goal, confidence level, and recommended approach in 3-5 bullets.

## Sample size math
- Show the formula inputs, margin-of-error trade-offs, and worked size guidance from the stated population.

## Sampling method
- Recommended method (simple random, stratified, cluster) with strata definitions and allocation.

## Bias guards
- Nonresponse, selection, survivorship, and measurement bias mitigations.

## Execution checklist
- Frame building, randomization, outreach cadence, and documentation steps.

Rules:
- Compute only from the population details provided; do not invent prices, stats, or external data.
- State formula assumptions explicitly instead of hiding them.
- Flag frame gaps or access limits that weaken the plan.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
