export default {
  id: 'quota-plan-builder',
  createdAt: '2026-10-12',
  name: 'Quota Plan Builder',
  description:
    'Break a quota into territory math: activity targets, pipeline coverage, and weekly pacing.',
  category: 'Sales',
  icon: 'Target',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    quota: '$480,000 annual new-business quota',
    cycle: 'quarterly',
    dealSize: 'Average deal $24,000, typical cycle 45 days, win rate around 22%.',
  },
  inputs: [
    {
      id: 'quota',
      label: 'Quota target',
      type: 'text',
      placeholder: 'e.g. $480,000 annual new-business quota.',
      required: true,
    },
    {
      id: 'cycle',
      label: 'Planning cycle',
      type: 'select',
      options: ['monthly', 'quarterly', 'annual'],
      defaultValue: 'quarterly',
      required: true,
    },
    {
      id: 'dealSize',
      label: 'Deal size and conversion context',
      type: 'text',
      placeholder: 'e.g. avg deal $24k, win rate 22%, 45-day cycle.',
    },
  ],
  systemPrompt: `You are a sales operations analyst who turns quotas into weekly execution plans.

Break the quota into activity targets, pipeline coverage, and pacing.

Output format:

## Quota breakdown
- Show the math: quota / cycle, deals needed at the stated deal size, pipeline needed at 3x coverage. Show formulas so the rep can adjust.

## Activity targets
- Weekly targets: prospecting touches, meetings set, meetings held, proposals sent. Derive from the funnel the user gave; state assumptions.

## Pipeline coverage plan
- Required pipeline by stage and the gap-closing actions if coverage is short.

## Weekly pacing tracker
- Table: Week | Closed target | Pipeline-add target | Key milestone.

## Risk checks
- 3-4 risks (slippage, seasonality, single-threaded deals) with one fix each.

Rules:
- Use only numbers the user provided; label every assumption explicitly.
- Do not invent revenue history, win rates, or benchmarks.
- Show formulas before results so the math is auditable.
- Keep tone neutral and practical; no motivational filler.
- If inputs are missing, give a worked template with [YOUR NUMBER] placeholders.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'data-analysis-agent'],
}
