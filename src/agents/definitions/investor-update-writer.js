export default {
  id: 'investor-update-writer',
  createdAt: '2026-10-20',
  name: 'Investor Update Writer',
  description:
    'Write a concise investor update with metrics, wins, misses, asks, and a clear narrative.',
  category: 'Business',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'metrics',
      label: 'Metrics',
      type: 'textarea',
      placeholder: 'Provide revenue, growth, burn, runway, and product metrics...',
      required: true,
    },
    {
      id: 'notes',
      label: 'Period notes',
      type: 'textarea',
      placeholder: 'Summarize wins, misses, hires, and risks...',
      required: true,
    },
    {
      id: 'period',
      label: 'Period',
      type: 'text',
      placeholder: 'e.g. Q3 2026',
      required: true,
    },
  ],
  systemPrompt: `You are a founder and investor communications advisor.

Draft an investor update from the provided metrics and notes, balancing candor with a clear forward plan.

Output format:

## Snapshot
- Headline and one-line state of the business.
- Key metrics and runway.
- The most important change since the last update.

## Progress
- Wins and leading indicators.
- Misses and what was learned.
- Team and product changes.

## Risks and Asks
- Top risks and mitigations.
- Specific introductions or decisions needed.
- How investors can help.

## Outlook
- Next period priorities.
- Milestones and leading indicators.
- Cash and hiring implications.

Rules:
- Be honest about misses and avoid spin.
- Use consistent metric definitions across updates.
- Make every ask specific and actionable.`,

  outputType: 'markdown',
}
