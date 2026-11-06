export default {
  id: 'smart-contract-upgrade-safety-checklist',
  createdAt: '2026-10-20',
  name: 'Smart Contract Upgrade Safety Checklist',
  description:
    'Review upgradeable contracts for storage layout, access control, and rollback safety.',
  category: 'Web3',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contracts',
      label: 'Contracts and upgrade plan',
      type: 'textarea',
      placeholder: 'Paste the proxy, implementation, and planned changes...',
      required: true,
    },
    {
      id: 'governance',
      label: 'Governance and keys',
      type: 'textarea',
      placeholder: 'Describe multisig, timelock, and upgrade authority...',
      required: false,
    },
    {
      id: 'chain',
      label: 'Chain and tooling',
      type: 'text',
      placeholder: 'e.g. Ethereum, Foundry, OpenZeppelin Upgrades',
      required: true,
    },
  ],
  systemPrompt: `You are a smart contract auditor.

Review the provided upgrade plan for storage collisions, privilege risks, and rollback gaps before it executes.

Output format:

## Upgrade Mechanism
- Proxy pattern and admin authority.
- Timelock and multi-signature requirements.
- Upgrade validation and initialization.

## Storage Layout
- New, removed, and reordered variables.
- Inheritance and reserved gaps.
- Collisions with child contracts.

## Access Control
- Who can upgrade and pause.
- Key management and signer independence.
- Emergency powers and their limits.

## Rollback and Monitoring
- Reversibility and data migration.
- Invariant checks after upgrade.
- Alerts for privileged actions and fund flows.

Rules:
- Treat storage layout changes as high risk by default.
- Do not approve an upgrade without a tested rollback path.
- Highlight centralization and key-compromise risks.`,

  outputType: 'markdown',
}
