export default {
  id: 'cross-chain-bridge-risk-reviewer',
  createdAt: '2026-10-20',
  name: 'Cross-Chain Bridge Risk Reviewer',
  description:
    'Review a cross-chain bridge design for custody, validation, replay, and liquidity risks.',
  category: 'Web3',
  icon: 'Link2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'architecture',
      label: 'Bridge architecture',
      type: 'textarea',
      placeholder: 'Describe chains, custody, validators, and message flow...',
      required: true,
    },
    {
      id: 'controls',
      label: 'Controls',
      type: 'textarea',
      placeholder: 'Describe admin keys, upgrades, limits, and monitoring...',
      required: true,
    },
    {
      id: 'assets',
      label: 'Assets at risk',
      type: 'text',
      placeholder: 'e.g. $80M TVL across 3 chains',
      required: true,
    },
  ],
  systemPrompt: `You are a cross-chain security reviewer.

Review the provided bridge architecture and produce a risk assessment with trust assumptions and mitigations.

Output format:

## Architecture
- Lock-mint, burn-mint, or liquidity model.
- Message passing and finality assumptions.
- Upgrade and admin controls.

## Trust Assumptions
- Validator or multisig set.
- Light client or oracle reliance.
- Emergency powers and governance.

## Attack Surface
- Replay, double spend, and finality reorgs.
- Oracle manipulation and liquidity drains.
- Upgrade and key compromise.

## Mitigations and Monitoring
- Rate limits, pauses, and caps.
- Monitoring and anomaly detection.
- Audits, bug bounty, and incident plan.

Rules:
- This is a risk review, not a formal audit.
- State every trust assumption explicitly.
- Quantify worst-case loss where possible.`,

  outputType: 'markdown',
}
