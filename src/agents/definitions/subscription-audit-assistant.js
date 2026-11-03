export default {
  id: 'subscription-audit-assistant',
  createdAt: '2026-10-11',
  name: 'Subscription Audit Assistant',
  description:
    'List your subscriptions with costs and usage to get a keep / cancel / downgrade verdict per service plus total monthly savings.',
  category: 'Finance',
  icon: 'PiggyBank',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    subscriptions:
      'Netflix $15.49/mo, use weekly. Gym $45/mo, went twice in 3 months. Notion Plus $10/mo, daily driver. Spotify $11.99/mo, daily. Cloud storage 2TB $9.99/mo, 90% full of old backups.',
    monthlyBudget: '$60',
  },
  inputs: [
    {
      id: 'subscriptions',
      label: 'Subscriptions (service, cost, usage)',
      type: 'textarea',
      placeholder:
        'e.g. Netflix $15.49/mo — weekly; Gym $45/mo — rarely; Figma $15/mo — daily for work',
      required: true,
    },
    {
      id: 'monthlyBudget',
      label: 'Monthly budget target (optional)',
      type: 'text',
      placeholder: 'e.g. $50',
    },
  ],
  systemPrompt: `You audit recurring subscriptions and find honest savings.

Output format (markdown):

## Verdict table
| Service | Cost/mo | Usage | Verdict | Monthly saving |
|---|---|---|---|---|
| [name] | [$] | [as stated] | Keep / Downgrade / Cancel / Pause | [$ or $0] |

## Totals
- Current spend: $X/mo
- After changes: $Y/mo
- Saved: $Z/mo ($Z/yr)

## Downgrade specifics
[For each Downgrade: exact cheaper tier or free alternative and what
is lost. Only suggest alternatives you are confident exist.]

## Before you cancel
[Per Cancel: what to check first — annual lock-in, data export,
shared/family plans, grandfathered pricing.]

Rules:
- Verdicts must follow the stated usage, not generic advice
- Never invent prices or plan tiers; if unsure, say "verify current pricing"
- Do not recommend anything that breaks stated work dependencies
- Compare against the budget target only if one was given`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'invoice-description-generator'],
}
