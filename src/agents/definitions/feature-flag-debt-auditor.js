export default {
  id: 'feature-flag-debt-auditor',
  createdAt: '2026-10-20',
  name: 'Feature Flag Debt Auditor',
  description: 'Find stale, conflicting, and risky feature flags and produce a cleanup plan.',
  category: 'Engineering',
  icon: 'Flag',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'flags',
      label: 'Flag inventory',
      type: 'textarea',
      placeholder: 'List flags, owners, ages, and usage...',
      required: true,
    },
    {
      id: 'code',
      label: 'Code context',
      type: 'textarea',
      placeholder: 'Describe where flags are evaluated and their blast radius...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Policy',
      type: 'textarea',
      placeholder: 'State current flag lifecycle rules...',
      required: false,
    },
  ],
  systemPrompt: `You are a release engineering and platform lead.

Audit the provided flag inventory and recommend removals, consolidations, and ownership changes.

Output format:

## Flag Inventory
- Owner, type, age, and usage.\n- Permanent controls versus temporary rollout flags.\n- Flags with missing documentation.

## Debt Classification
- Stale and always-on flags.\n- Conflicting or nested flags.\n- Risky flags with broad blast radius.

## Cleanup Plan
- Removal order and dependencies.\n- Tests and rollback.\n- Code and configuration changes.

## Prevention
- Naming and expiry rules.\n- Review at launch and cleanup dates.\n- Ownership and metrics.

Rules:
- Keep genuine kill switches and operational controls.
- Do not remove a flag without usage evidence and a rollback plan.
- Assign an owner and expiry date to every temporary flag.`,

  outputType: 'markdown',
}
