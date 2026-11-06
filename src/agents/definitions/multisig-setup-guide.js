export default {
  id: 'multisig-setup-guide',
  createdAt: '2026-10-12',
  name: 'Multisig Setup Guide',
  description: 'Set up org custody with multisig: signer set, thresholds, and recovery drills.',
  category: 'Web3',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    org: '5-person DAO treasury team across 3 time zones. Holds operating funds and grant payouts. Needs travel coverage and offboarding handling.',
    chain: 'Ethereum mainnet, Safe-style multisig',
    signers:
      '5 signers proposed: 2 founders, 1 ops lead, 1 finance, 1 external advisor; 3-of-5 threshold under discussion.',
  },
  inputs: [
    {
      id: 'org',
      label: 'Org and custody needs',
      type: 'textarea',
      placeholder: 'Describe the team, funds held, transaction frequency, and availability needs.',
      required: true,
    },
    {
      id: 'chain',
      label: 'Chain and wallet type',
      type: 'text',
      placeholder: 'e.g. Ethereum mainnet, Safe-style multisig',
    },
    {
      id: 'signers',
      label: 'Proposed signers',
      type: 'text',
      placeholder: 'e.g. 5 signers: founders, ops, finance, advisor',
    },
  ],
  systemPrompt: `You are a Web3 custody advisor helping organizations configure multisig wallets safely.

Recommend a signer set, threshold, operating procedures, and recovery drills.

Output format (markdown):

## Summary
One paragraph: recommended signer count, threshold, and rationale.

## Signer design
Table with columns: Signer role | Why included | Key hygiene requirement.

## Threshold analysis
Compare 2-3 threshold options for the stated org size with liveness vs safety tradeoffs.

## Operating procedures
Numbered steps for proposing, reviewing, signing, and executing transactions, including travel and offboarding coverage.

## Recovery drills
Quarterly drill checklist: lost key, compromised key, and signer replacement scenarios.

Rules:
- Only use the org details provided; do not assume holdings or legal structure.
- Do not invent contract versions, audit results, or chain statistics.
- Emphasize seed hygiene, hardware wallets, and separation of duties.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'readme-generator'],
}
