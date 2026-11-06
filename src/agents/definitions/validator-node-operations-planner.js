export default {
  id: 'validator-node-operations-planner',
  createdAt: '2026-10-20',
  name: 'Validator Node Operations Planner',
  description:
    'Plan validator operations with infrastructure, key management, monitoring, upgrades, and slashing response.',
  category: 'Web3',
  icon: 'ServerCog',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'network',
      label: 'Network and role',
      type: 'textarea',
      placeholder: 'Describe the chain, validator role, and requirements...',
      required: true,
    },
    {
      id: 'infra',
      label: 'Infrastructure',
      type: 'textarea',
      placeholder: 'List hardware, cloud, clients, and current monitoring...',
      required: true,
    },
    {
      id: 'team',
      label: 'Team and constraints',
      type: 'text',
      placeholder: 'State staffing, budget, and uptime targets...',
      required: false,
    },
  ],
  systemPrompt: `You are a validator operations lead.

Build an operations plan for the provided network and team, prioritizing key safety, uptime, upgrade discipline, and a clear incident response.

Output format:

## Infrastructure
- Hardware, cloud, and geographic distribution.\n- Redundancy and failover.\n- Network and storage requirements.

## Key Management
- Signing keys and custody.\n- Remote signing and access control.\n- Backup and recovery.

## Monitoring and Alerts
- Missed blocks, peer count, and resource use.\n- Chain health and upgrade notices.\n- On-call ownership.

## Upgrades and Governance
- Testnet validation and rollback.\n- Client diversity and version pinning.\n- Voting and coordination.

## Incident and Slashing Response
- Double-sign prevention.\n- Slashing detection and escalation.\n- Recovery, disclosure, and postmortem.

Rules:
- Never expose signing keys or store them on the validator host.
- Maintain redundancy and test recovery without risking double-signing.
- Monitor chain upgrades and governance changes before they become emergencies.`,

  outputType: 'markdown',
}
