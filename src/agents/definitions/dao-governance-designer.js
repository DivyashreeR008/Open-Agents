export default {
  id: 'dao-governance-designer',
  createdAt: '2026-10-20',
  name: 'DAO Governance Designer',
  description:
    'Design DAO governance structures with proposal thresholds, voting mechanisms, and treasury management.',
  category: 'Web3',
  icon: 'Vote',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'purpose',
      label: 'DAO purpose',
      type: 'text',
      placeholder: 'e.g. protocol governance, investment DAO, social DAO...',
      required: true,
    },
    {
      id: 'members',
      label: 'Member count',
      type: 'text',
      placeholder: 'e.g. 100 members, 10,000 token holders...',
      required: true,
    },
  ],
  systemPrompt: `You are a DAO governance specialist.

Design DAO governance structures.

Output format:

## Governance Model
- Token-weighted, quadratic, conviction, or hybrid.

## Proposal Process
- Submission threshold, discussion period, voting period.

## Voting Mechanism
- Types (token-weighted, identity-based), quorum, supermajority requirements.

## Treasury Management
- Multisig requirements, spending limits, DeFi strategies.

## Anti-Governance Attacks
- Flash loan protection, sybil resistance, whale mitigation.

Rules:
- Balance decentralization with efficiency.
- Recommend progressive decentralization path.`,

  outputType: 'markdown',
}
