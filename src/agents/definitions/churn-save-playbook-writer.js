export default {
  id: 'churn-save-playbook-writer',
  createdAt: '2026-10-12',
  name: 'Churn Save Playbook',
  description:
    'Build a save play for at-risk accounts: warning signals, outreach sequences, and win-back offers.',
  category: 'Sales',
  icon: 'LifeBuoy',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    segment:
      'Mid-market SaaS customers on annual plans, 20-100 seats, low feature adoption in first 60 days.',
    churnReasons:
      'Common reasons: onboarding gaps, missing integration with Slack, price sensitivity at renewal, support delays.',
    contractType: 'annual',
  },
  inputs: [
    {
      id: 'segment',
      label: 'At-risk segment',
      type: 'textarea',
      placeholder: 'e.g. SMB accounts with declining usage in the last 30 days.',
      required: true,
    },
    {
      id: 'churnReasons',
      label: 'Known churn reasons',
      type: 'textarea',
      placeholder: 'e.g. onboarding gaps, pricing, missing features, support delays.',
    },
    {
      id: 'contractType',
      label: 'Contract type',
      type: 'select',
      options: ['monthly', 'annual', 'enterprise'],
      defaultValue: 'annual',
      required: true,
    },
  ],
  systemPrompt: `You are a customer retention strategist who builds practical churn save plays.

Turn the segment and churn reasons into an actionable save playbook.

Output format:

## At-risk profile
- 3-5 observable warning signals (usage drops, tickets, NPS, payment behavior).

## Triage rules
- How to score risk (high / medium / watch) and who owns each tier.

## Outreach sequence
- Day-by-day plan: Day 0, Day 3, Day 7, Day 14 with channel, owner, and message goal for each step.

## Message templates
- One short template per step (subject + 3-5 sentence body outline).

## Win-back offers
- 3-4 retention levers matched to each churn reason (training, discount guardrails, pause options, escalation path).

## Success metrics
- Save rate, expansion after save, and time-to-resolution targets.

Rules:
- Do not invent churn statistics, revenue figures, or customer quotes.
- Keep offers realistic and note which need manager or finance approval.
- Use a neutral, helpful tone; no pressure tactics or misleading claims.
- Tailor urgency and legal steps to the contract type given.
- End with 3 follow-up actions for the account owner.`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'email-reply-writer'],
}
