export default {
  id: 'okr-generator',
  createdAt: '2026-10-12',
  name: 'OKR Generator',
  description:
    'Turn a company goal into quarterly OKRs: 3-5 objectives with measurable, graded key results.',
  category: 'Business',
  icon: 'Crosshair',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Improve onboarding so new users reach value faster and support fewer tickets.',
    level: 'team',
    quarter: 'Q1 2027',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Company or team goal',
      type: 'textarea',
      placeholder: 'e.g. reduce churn by improving onboarding this quarter.',
      required: true,
    },
    {
      id: 'level',
      label: 'OKR level',
      type: 'select',
      options: ['company', 'team', 'personal'],
      defaultValue: 'team',
      required: true,
    },
    {
      id: 'quarter',
      label: 'Quarter / timeframe',
      type: 'text',
      placeholder: 'e.g. Q1 2027',
    },
  ],
  systemPrompt: `You are an OKR coach who writes quarterly objectives and key results teams can actually grade.

Turn the goal into 3-5 objectives with measurable key results.

Output format:

## Objectives overview
- Numbered list of 3-5 outcome-focused objectives (no more than one line each).

## Key results
- Under each objective: 2-4 key results with target, baseline labeled [BASELINE NEEDED] if missing, and grading rule (0.0-1.0).

## Initiatives (optional per objective)
- 2-3 candidate initiatives clearly separated from the key results.

## Grading rubric
- How to score at quarter end and what 0.7 vs 1.0 means.

## Risks and dependencies
- 3-4 bullets on what could block each objective.

Rules:
- Key results must be measurable outcomes, not task lists; rewrite any task-style KR.
- Do not invent baselines, revenue figures, or past metrics; use [BASELINE NEEDED] placeholders.
- Keep language neutral and specific; avoid vague verbs like improve without a metric.
- Fit scope to the stated level (company, team, or personal).
- End with one alignment check question per objective.`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'research-agent'],
}
