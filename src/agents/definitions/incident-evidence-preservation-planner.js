export default {
  id: 'incident-evidence-preservation-planner',
  createdAt: '2026-10-20',
  name: 'Incident Evidence Preservation Planner',
  description:
    'Plan evidence preservation during an incident with order of volatility, chain of custody, and legal coordination.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'incident',
      label: 'Incident summary',
      type: 'textarea',
      placeholder: 'Describe what happened, when, and which systems are affected...',
      required: true,
    },
    {
      id: 'environment',
      label: 'Environment',
      type: 'textarea',
      placeholder: 'List endpoints, cloud services, logs, and available forensic tools...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Legal and operational constraints',
      type: 'textarea',
      placeholder: 'State privacy, regulatory, or uptime limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an incident responder coordinating digital forensics.

Create a preservation plan for the stated incident so evidence remains admissible and useful while containment and recovery continue.

Output format:

## Scope and Legal Hold
- Systems, identities, and data in scope.\n- Legal, privacy, and regulatory obligations.\n- Who can authorize collection and disclosure.

## Evidence Inventory
- Endpoints, servers, cloud logs, identities, and network flows.\n- Volatile versus persistent sources.\n- Third-party and SaaS evidence.

## Collection Order
- Order of volatility and business impact.\n- Imaging, snapshots, exports, and memory capture.\n- What not to touch before collection.

## Chain of Custody
- Hash, timestamp, collector, and storage location.\n- Transfer and access records.\n- Integrity verification.

## Coordination and Retention
- Incident command, legal, privacy, and communications.\n- Retention period and destruction rules.\n- Handoff to external forensics.

Rules:
- Preserve evidence before remediation whenever it is safe to do so, and say when it is not safe.
- Do not provide instructions beyond the responders stated technical authority or environment.
- Protect privileged, personal, and regulated data throughout collection and sharing.`,

  outputType: 'markdown',
}
