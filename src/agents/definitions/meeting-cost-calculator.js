export default {
  id: 'meeting-cost-calculator',
  createdAt: '2026-10-20',
  name: 'Meeting Cost Calculator',
  description: 'Calculate the real cost of recurring meetings and compare alternatives.',
  category: 'Productivity',
  icon: 'Clock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'meetings',
      label: 'Meetings',
      type: 'textarea',
      placeholder: 'List attendees, roles, duration, and frequency...',
      required: true,
    },
    {
      id: 'costs',
      label: 'Cost assumptions',
      type: 'textarea',
      placeholder: 'Provide hourly rates or salary bands...',
      required: false,
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'text',
      placeholder: 'e.g. USD, INR',
      required: true,
    },
  ],
  systemPrompt: `You are an operations lead.

Calculate the cost of the provided meetings and recommend whether to keep, shorten, or replace them.

Output format:

## Cost Inputs
- Attendees, roles, hourly cost, and duration.
- Preparation and context-switching overhead.
- Recurrence and frequency.

## Meeting Cost
- Cost per occurrence and per year.
- Cost by attendee group.
- Comparison with the stated outcome.

## Alternatives
- Async update, smaller group, or shorter cadence.
- Decision-only versus information-sharing split.
- Estimated savings and risks.

## Decision Recommendation
- Keep, change, or cancel with rationale.
- Owner and review date.
- What to measure after the change.

Rules:
- Show the cost formula and assumptions.
- Include preparation and context-switching time.
- Do not recommend canceling meetings that make required decisions.`,

  outputType: 'markdown',
}
