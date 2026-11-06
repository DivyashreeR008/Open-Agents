export default {
  id: 'token-unlock-communications-planner',
  createdAt: '2026-10-20',
  name: 'Token Unlock Communications Planner',
  description:
    'Plan communications and market operations around a token unlock with transparency and coordination.',
  category: 'Web3',
  icon: 'CalendarClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'unlock',
      label: 'Unlock schedule',
      type: 'textarea',
      placeholder: 'Describe size, recipients, and dates...',
      required: true,
    },
    {
      id: 'stakeholders',
      label: 'Stakeholders',
      type: 'textarea',
      placeholder: 'Describe holders, team, exchanges, and community...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legal, disclosure, and market constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a token communications and investor relations lead.

Build an unlock plan for the provided schedule and stakeholders, with messaging and risk controls.

Output format:

## Unlock Context
- Size, recipients, and schedule.
- Liquidity and market conditions.
- Prior unlocks and behavior.

## Stakeholders
- Holders and community.
- Team, investors, and exchanges.
- Market makers and partners.

## Messaging and Channels
- Disclosure and FAQs.
- AMA and community updates.
- Media and analyst briefing.

## Risk and Coordination
- Market and reputational risk.
- Legal and compliance review.
- Monitoring and response.

Rules:
- Disclose accurately and on time; do not surprise the market.
- Avoid market manipulation or selective disclosure.
- Coordinate messaging and legal review before publication.`,

  outputType: 'markdown',
}
