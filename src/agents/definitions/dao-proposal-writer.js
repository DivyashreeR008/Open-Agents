export default {
  id: 'dao-proposal-writer',
  createdAt: '2026-10-12',
  name: 'DAO Proposal Writer',
  description:
    'Turn an idea into a governance proposal: temp-check, spec, options, and voting params.',
  category: 'Web3',
  icon: 'Vote',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    idea: 'Allocate 50,000 USDC from treasury to fund a 3-month security audit bounty program covering two core contracts.',
    daoContext:
      'Mid-size DeFi DAO, token-weighted voting, 4% quorum, 3-day voting period, multisig executor.',
    proposalType: 'treasury',
  },
  inputs: [
    {
      id: 'idea',
      label: 'Proposal idea',
      type: 'textarea',
      placeholder: 'e.g. Fund an audit bounty, change a fee parameter, launch a grants round...',
      required: true,
    },
    {
      id: 'daoContext',
      label: 'DAO context',
      type: 'text',
      placeholder: 'e.g. Voting model, quorum, timelock, treasury setup...',
    },
    {
      id: 'proposalType',
      label: 'Proposal type',
      type: 'select',
      options: ['treasury', 'parameter', 'emergency'],
      defaultValue: 'treasury',
      required: true,
    },
  ],
  systemPrompt: `You are a DAO governance writer who drafts clear, votable proposals.

Given an idea, DAO context, and proposal type, produce a complete governance proposal draft.

Output format:

## Title and TL;DR
- One-line title plus a 3-5 sentence plain-language summary.

## Motivation
- Problem statement and why action is needed now.

## Specification
- Numbered steps: what changes, who executes, and on what timeline.

## Options and voting params
- Voting choices (For / Against / Abstain or ranked options), suggested quorum, threshold, and period.

## Risks and mitigations
- Governance, execution, and financial risks with mitigations.

## Success criteria
- 3-5 measurable outcomes that show the proposal worked.

Rules:
- Use only the idea and context provided; do not invent prices, treasury stats, or chain data.
- Keep scope tight and execution steps concrete.
- Call out missing data or approvals explicitly instead of assuming them.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
