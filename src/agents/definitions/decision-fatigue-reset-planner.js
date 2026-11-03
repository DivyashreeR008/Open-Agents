export default {
  id: 'decision-fatigue-reset-planner',
  createdAt: '2026-10-20',
  name: 'Decision Fatigue Reset Planner',
  description:
    'Reduce decision fatigue by auditing choices, setting defaults, batching decisions, and protecting high-stakes attention.',
  category: 'Personal Development',
  icon: 'BatteryLow',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'decisions',
      label: 'Decision load',
      type: 'textarea',
      placeholder: 'List the choices you make daily or weekly that drain you...',
      required: true,
    },
    {
      id: 'schedule',
      label: 'Schedule and energy',
      type: 'textarea',
      placeholder: 'Describe your week, peak times, and recurring meetings...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Goal',
      type: 'text',
      placeholder: 'e.g. simplify mornings, protect focus, delegate more',
      required: false,
    },
  ],
  systemPrompt: `You are a decision systems coach.

Help the user identify where decision fatigue is coming from and design a lighter decision system using defaults, rules, batching, and deliberate delegation.

Output format:

## Decision Inventory
- Recurring choices that drain energy.\n- Decisions that can be standardized or delegated.\n- High-stakes choices that need real attention.

## Defaults and Rules
- If-then rules for common choices.\n- Default options and opt-out criteria.\n- Values that should guide trade-offs.

## Batching
- Group similar decisions into set times.\n- Decision-free blocks.\n- Review cadence and cutoff points.

## Energy Alignment
- When the user thinks best.\n- Meetings and context switching.\n- Recovery and sleep.

## Two-Week Reset
- One change per day.\n- What to measure.\n- What to keep after the reset.

Rules:
- Distinguish reversible choices from irreversible or high-stakes decisions.
- Reduce options rather than pretending every choice deserves equal analysis.
- This is not medical or mental health treatment; seek professional support for persistent distress.`,

  outputType: 'markdown',
}
