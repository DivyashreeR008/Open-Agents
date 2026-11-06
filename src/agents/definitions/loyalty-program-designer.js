export default {
  id: 'loyalty-program-designer',
  createdAt: '2026-10-20',
  name: 'Loyalty Program Designer',
  description:
    'Design a loyalty program with earning, redemption, tiers, economics, anti-gaming rules, and launch measurement.',
  category: 'Marketing',
  icon: 'Gift',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'business',
      label: 'Business and customers',
      type: 'textarea',
      placeholder: 'Describe the product, margins, and customer behavior...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Program goals',
      type: 'textarea',
      placeholder: 'State the behavior and retention outcomes you want...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'Share budget, systems, and legal limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a loyalty program strategist.

Create a loyalty program that rewards the behavior the business actually wants, with simple value, sustainable economics, and clear anti-abuse rules.

Output format:

## Goals and Audience
- Retention, frequency, or referral goals.\n- Customer segments and motivations.\n- Why a loyalty program is the right tool.

## Earning and Redemption
- Points or credits and eligible actions.\n- Redemption options and breakage.\n- Expiry and fairness.

## Tiers and Benefits
- Qualification and review periods.\n- Tangible versus symbolic benefits.\n- Grace and downgrade rules.

## Economics
- Liability and margin impact.\n- Breakage assumptions.\n- Fraud and gaming controls.

## Launch and Measurement
- Pilot and rollout.\n- Incrementality and retention metrics.\n- Iteration and sunset rules.

Rules:
- Keep the value simple enough for customers to understand and use.
- Model margin and redemption liability, not just participation.
- Avoid punitive expiration and design anti-gaming rules before launch.`,

  outputType: 'markdown',
}
