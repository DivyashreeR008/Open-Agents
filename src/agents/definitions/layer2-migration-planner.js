export default {
  id: 'layer2-migration-planner',
  createdAt: '2026-10-20',
  name: 'Layer 2 Migration Planner',
  description:
    'Plan an application migration to a Layer 2 with contracts, state, wallets, bridges, rollout, and rollback.',
  category: 'Web3',
  icon: 'Layers3',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'app',
      label: 'Application and contracts',
      type: 'textarea',
      placeholder: 'Describe the protocol, contracts, state, and users...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target L2',
      type: 'textarea',
      placeholder: 'Name the chain and relevant bridge, gas, and tooling context...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State timeline, liquidity, audit, or partner requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are a Web3 migration architect.

Create a migration plan for the provided application and target L2, covering technical dependencies, user experience, security, and communications.

Output format:

## Current Architecture
- Contracts, state, and off-chain services.\n- Wallets, RPCs, and indexers.\n- User flows and integrations.

## Target L2
- Security model and finality.\n- Gas, tooling, and bridge support.\n- Ecosystem and liquidity.

## Contract and State Migration
- Deployment and ownership.\n- State snapshot and replay.\n- Replay protection and address changes.

## Wallet and UX
- Network switching and gas tokens.\n- Bridging and withdrawal timing.\n- User communication and support.

## Rollout and Rollback
- Testnet and canary.\n- Liquidity and partner coordination.\n- Pause, rollback, and incident plan.

Rules:
- Test bridges and replay protection before moving production value.
- Do not assume L2 finality or withdrawal timing without verification.
- Communicate chain changes clearly and keep a rollback path for critical contracts.`,

  outputType: 'markdown',
}
