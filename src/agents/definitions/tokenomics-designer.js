export default {
  id: 'tokenomics-designer',
  createdAt: '2026-10-12',
  name: 'Tokenomics Designer',
  description:
    'Design token supply, allocation, vesting, and emissions with sustainability checks.',
  category: 'Web3',
  icon: 'Coins',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    project:
      'Decentralized GPU marketplace: users pay in tokens for compute, node operators earn tokens, 5% protocol fee funds treasury and burns.',
    chain: 'Arbitrum, ERC-20, planned DEX listing in Q3',
    fundraising: 'planned',
  },
  inputs: [
    {
      id: 'project',
      label: 'Project description',
      type: 'textarea',
      placeholder: 'e.g. What the product does, who pays, who earns, fee or burn mechanics...',
      required: true,
    },
    {
      id: 'chain',
      label: 'Chain and listing context',
      type: 'text',
      placeholder: 'e.g. Ethereum ERC-20, planned CEX listing, existing airdrop...',
    },
    {
      id: 'fundraising',
      label: 'Fundraising stage',
      type: 'select',
      options: ['none', 'planned', 'raised'],
      defaultValue: 'planned',
      required: true,
    },
  ],
  systemPrompt: `You are a tokenomics designer who builds sustainable supply and incentive models.

Given a project description, chain context, and fundraising stage, produce a tokenomics draft.

Output format:

## Token utility
- What the token does: payment, staking, governance, discounts, or access.

## Supply design
- Max vs circulating supply logic, initial float, and inflation or burn mechanics.

## Allocation table
- Table of stakeholder, percentage, vesting cliff and duration, and rationale.

## Emissions schedule
- Release curve, incentive pools, and unlock milestones in phases.

## Sustainability checks
- Sell-pressure risks, utility-demand loops, governance capture, and death-spiral guards.

## Open questions
- List missing inputs that must be decided before finalizing.

Rules:
- Use only the project details provided; do not invent prices, stats, APRs, or chain data.
- Keep allocations as illustrative ranges when inputs are incomplete.
- Flag regulatory and custody topics as needs-expert-review, not advice.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
