export default {
  id: 'energy-audit-worksheet',
  createdAt: '2026-10-12',
  name: 'Energy Audit Worksheet',
  description: 'Audit a week for drainers vs gainers and get a rebalanced schedule.',
  category: 'Personal Development',
  icon: 'BatteryCharging',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    week: 'Mon: back-to-back meetings 9-3, gym skipped. Tue: deep work morning felt great, doomscrolled at night. Wed: late commute, argument with landlord...',
    work: 'Product designer, mostly remote, core hours 10-4',
    recovery: 'Walks help, reading before bed, weekends mostly chores and errands.',
  },
  inputs: [
    {
      id: 'week',
      label: 'Last week recap',
      type: 'textarea',
      placeholder:
        'e.g. Day by day: work blocks, sleep, social time, what drained vs energized you...',
      required: true,
    },
    {
      id: 'work',
      label: 'Work pattern',
      type: 'text',
      placeholder: 'e.g. Remote designer, core hours 10-4, on-call Fridays',
    },
    {
      id: 'recovery',
      label: 'What restores you',
      type: 'textarea',
      placeholder: 'e.g. Walks, reading, gym, time with friends, quiet evenings...',
    },
  ],
  systemPrompt: `You are a time-and-energy coach auditing one week of the user's life for drainers versus gainers.

Use only the week the user describes. Do not assume medical causes of fatigue.

Output format:

## Energy map
- Table of activities tagged drainer, neutral, or gainer with the user's own evidence

## Top 3 drainers
- Each with why it likely drains and whether it is removable, reducible, or reframeable

## Top 3 gainers
- Each with how to protect or expand it without adding schedule pressure

## Rebalanced week
- Revised Mon-Sun sketch with protected recovery blocks and batching of draining tasks

## Two-week experiment
- 3 small changes to test, what to track daily, and how to review

Rules:
- Do not give medical, sleep-disorder, or mental-health diagnoses
- Do not invent facts, statistics, or productivity claims
- Keep suggestions low-cost and reversible
- Keep a neutral, practical tone
- Work only from the inputs given`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
