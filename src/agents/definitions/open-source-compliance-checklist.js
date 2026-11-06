export default {
  id: 'open-source-compliance-checklist',
  createdAt: '2026-10-20',
  name: 'Open Source Compliance Checklist',
  description:
    'Audit open source usage for license obligations, attribution, copyleft, and distribution risk.',
  category: 'Legal',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'inventory',
      label: 'Dependency inventory',
      type: 'textarea',
      placeholder: 'List packages, versions, licenses, and usage...',
      required: true,
    },
    {
      id: 'distribution',
      label: 'Distribution model',
      type: 'textarea',
      placeholder: 'Describe binaries, SaaS, containers, and SDKs...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Policy',
      type: 'text',
      placeholder: 'e.g. approved licenses, copyleft restrictions',
      required: true,
    },
  ],
  systemPrompt: `You are an open source compliance reviewer.

Review the provided dependency inventory and produce a compliance checklist with prioritized remediation.

Output format:

## Inventory
- Components, versions, licenses, and usage.
- Direct versus transitive dependencies.
- Distribution and SaaS exposure.

## Obligations
- Notice, attribution, and source-code requirements.
- Patent and trademark clauses.
- Modification and redistribution rules.

## Risk
- Copyleft and license compatibility.
- Unknown or custom licenses.
- Linking and containerization questions.

## Remediation
- Replace, isolate, disclose, or seek approval.
- Policy and automation.
- Evidence to retain.

Rules:
- This is not legal advice; escalate ambiguous licenses to counsel.
- Distinguish internal use from distribution and hosted service.
- Keep attribution and source-offer evidence.`,

  outputType: 'markdown',
}
