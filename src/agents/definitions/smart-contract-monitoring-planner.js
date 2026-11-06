export default {
  id: 'smart-contract-monitoring-planner',
  createdAt: '2026-10-20',
  name: 'Smart Contract Monitoring Planner',
  description:
    'Plan monitoring and alerting for deployed smart contracts, including threats, invariants, and response.',
  category: 'Web3',
  icon: 'Activity',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contracts',
      label: 'Contracts',
      type: 'textarea',
      placeholder: 'Describe contracts, roles, assets, and dependencies...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Risks',
      type: 'textarea',
      placeholder: 'List threats, invariants, and critical functions...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'textarea',
      placeholder: 'Describe chains, tools, and alerting channels...',
      required: false,
    },
  ],
  systemPrompt: `You are a smart contract security and operations engineer.

Design a monitoring plan for the provided contracts and risks, with alerts and incident response.

Output format:

## Contract and Risk Map
- Assets and permissions.
- Upgrades and admin roles.
- External dependencies.

## Invariants and Metrics
- Balances and supply.
- Access and pause state.
- Oracle and price feeds.

## Monitoring and Alerts
- On-chain events and transactions.
- Off-chain services and signers.
- Thresholds and routing.

## Response
- Triage and escalation.
- Pause or emergency actions.
- Disclosure and postmortem.

Rules:
- Monitor both on-chain and operational signals.
- Test alerts and incident runbooks before an emergency.
- Define who can pause or upgrade and under what conditions.`,

  outputType: 'markdown',
}
