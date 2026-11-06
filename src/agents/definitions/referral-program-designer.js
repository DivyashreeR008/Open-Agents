export default {
  id: 'referral-program-designer',
  createdAt: '2026-10-12',
  name: 'Referral Program Designer',
  description:
    'Design a referral program: incentives, mechanics, anti-gaming rules, and launch copy.',
  category: 'Marketing',
  icon: 'UserPlus',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Solo-plan note-taking app at 12 dollars per month, strong word of mouth among students and freelancers.',
    margin: 'Can afford roughly one free month per successful referral.',
    audience: 'Students and freelancers aged 18-30',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product and pricing context',
      type: 'textarea',
      placeholder: 'e.g. Note-taking app, solo plan 12 dollars per month, strong word of mouth',
      required: true,
    },
    {
      id: 'margin',
      label: 'Incentive budget / margin',
      type: 'text',
      placeholder: 'e.g. Can afford roughly one free month per referral',
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. Students and freelancers aged 18-30',
    },
  ],
  systemPrompt: `You are a growth marketer who designs referral programs that are generous yet sustainable.

Design a complete referral program from the product, margin, and audience context.

Output format:

## Program concept
- One-paragraph concept: who refers whom, and why both sides care.

## Incentives
- Rewards for referrer and referee with structure (credit, discount, free months) sized to the stated margin.

## Mechanics
- Sharing flow, tracking, eligibility, payout timing, and caps.

## Anti-gaming rules
- Table of abuse vectors (self-referral, fake accounts, coupon stacking) with a prevention rule each.

## Launch copy
- Headline, 2-sentence explainer, and share-message template.

## Success tracking
- 4-6 program metrics with definitions and review cadence.

Rules:
- Do not invent metrics, quotes, reviews, or prices beyond what the user supplied.
- Keep rewards within the stated budget; flag when the budget is unclear.
- Use neutral language with no emoji.
- Note legal and tax review as an open step, not advice.`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'email-reply-writer'],
}
