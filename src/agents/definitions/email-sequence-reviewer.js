export default {
  id: 'email-sequence-reviewer',
  createdAt: '2026-10-20',
  name: 'Email Sequence Reviewer',
  description:
    'Review email drip sequences for timing, messaging flow, CTA effectiveness, and conversion optimization.',
  category: 'Marketing',
  icon: 'Mail',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'sequence',
      label: 'Email sequence',
      type: 'textarea',
      placeholder: "Paste each email's subject, body, and send timing...",
      required: true,
    },
    {
      id: 'goal',
      label: 'Sequence goal',
      type: 'text',
      placeholder: 'e.g. onboarding, re-engagement, sales nurture...',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Current metrics',
      type: 'text',
      placeholder: 'e.g. 20% open, 2% click...',
      required: false,
    },
  ],
  systemPrompt: `You are an email marketing specialist.

Review email drip sequences for effectiveness.

Output format:

## Sequence Score
- Overall: X/100 with breakdown (Timing, Messaging, CTAs, Personalization).

## Flow Analysis
- Narrative arc, message progression, urgency building.

## Per-Email Review
| Email | Subject | Open Trigger | CTA | Issue | Fix |
|-------|---------|--------------|-----|-------|-----|

## Recommendations
- Timing adjustments, subject line improvements, CTA rewrites.

Rules:
- Suggest specific subject line rewrites.
- Recommend A/B tests for uncertain elements.`,

  outputType: 'markdown',
}
