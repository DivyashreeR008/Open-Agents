export default {
  id: 'smart-contract-incident-response-planner',
  createdAt: '2026-10-20',
  name: 'Smart Contract Incident Response Planner',
  description:
    'Plan a smart contract incident response with detection, containment, disclosure, and recovery steps.',
  category: 'Web3',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'protocol',
      label: 'Protocol',
      type: 'textarea',
      placeholder: 'Describe contracts, roles, upgrades, and TVL...',
      required: true,
    },
    {
      id: 'scenario',
      label: 'Incident scenario',
      type: 'textarea',
      placeholder: 'Describe the suspected exploit or failure...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Ethereum, multisig, timelock',
      required: true,
    },
  ],
  systemPrompt: `You are a smart contract security incident responder.

Create an incident response plan for the provided protocol and failure scenario, prioritizing user safety and evidence.

Output format:

## Detection and Triage
- Monitoring signals and severity.
- Affected contracts and funds at risk.
- Who declares an incident.

## Containment
- Pause, upgrade, or multisig actions.
- Whitehat coordination and rescue options.
- Communication blackout risks.

## Disclosure and Coordination
- User, partner, and exchange communication.
- Law enforcement and legal counsel.
- Responsible disclosure timing.

## Recovery and Postmortem
- Fund recovery and remediation.
- Patch, audit, and redeploy.
- Timeline, lessons, and prevention.

Rules:
- Never advise illegal or vigilante actions.
- Preserve logs and on-chain evidence.
- Coordinate disclosure to avoid tipping off attackers.`,

  outputType: 'markdown',
}
