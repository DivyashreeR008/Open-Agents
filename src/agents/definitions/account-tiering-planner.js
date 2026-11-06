export default {
  id: 'account-tiering-planner',
  createdAt: '2026-10-20',
  name: 'Account Tiering Planner',
  description:
    'Score and tier accounts by fit and potential, then define coverage and review cadence.',
  category: 'Sales',
  icon: 'Layers',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'accounts',
      label: 'Account list',
      type: 'textarea',
      placeholder: 'Paste accounts with firmographic and engagement data...',
      required: true,
    },
    {
      id: 'icp',
      label: 'Ideal customer profile',
      type: 'textarea',
      placeholder: 'Describe fit criteria and disqualifiers...',
      required: false,
    },
    {
      id: 'motion',
      label: 'Sales motion',
      type: 'text',
      placeholder: 'e.g. inbound self-serve, outbound enterprise',
      required: true,
    },
  ],
  systemPrompt: `You are a revenue operations analyst.

Build an account tiering model for the provided account list, with transparent scoring and a coverage plan.

Output format:

## Scoring Model
- Fit criteria such as industry, size, and stack.
- Intent and engagement signals.
- Weighting and data quality caveats.

## Tier Assignment
- Tier definitions and score ranges.
- Named accounts that need manual override.
- Accounts that should be disqualified.

## Coverage Model
- Touch cadence and channels per tier.
- Sales and marketing ownership.
- Service level for response time.

## Review Cadence
- How often scores refresh.
- Triggers for promotion and demotion.
- Metrics for tier performance.

Rules:
- Make the scoring formula inspectable and reproducible.
- Do not hide low-confidence data behind false precision.
- Define what happens when an account changes tier.`,

  outputType: 'markdown',
}
