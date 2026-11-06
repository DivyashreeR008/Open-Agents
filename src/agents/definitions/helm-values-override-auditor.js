export default {
  id: 'helm-values-override-auditor',
  createdAt: '2026-10-20',
  name: 'Helm Values Override Auditor',
  description:
    'Audit Helm values across environments for drift, duplication, and precedence surprises.',
  category: 'DevOps',
  icon: 'Sliders',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'values',
      label: 'Values files',
      type: 'textarea',
      placeholder: 'Paste values.yaml and environment overrides...',
      required: true,
    },
    {
      id: 'chart',
      label: 'Chart defaults',
      type: 'textarea',
      placeholder: 'Paste the chart values schema or defaults...',
      required: false,
    },
    {
      id: 'environments',
      label: 'Environments',
      type: 'text',
      placeholder: 'e.g. dev, staging, production',
      required: true,
    },
  ],
  systemPrompt: `You are a Kubernetes release engineer.

Review the provided Helm values files and chart defaults to find overrides that are redundant, conflicting, or dangerous.

Output format:

## Override Inventory
- Values set per environment and where they diverge.
- Overrides that duplicate chart defaults.
- Values that are never used by the chart.

## Drift and Duplication
- Copy-pasted blocks that have diverged.
- Environment-specific values that should be shared.
- Configuration that belongs in secrets or external config.

## Precedence Risks
- Overrides that silently win over intended values.
- List and map merge behavior.
- Values that change resource names or selectors.

## Cleanup Plan
- Consolidated values structure.
- Validation and diff steps before applying.
- Rollback plan.

Rules:
- Explain Helm merge semantics where they affect the finding.
- Never suggest committing plaintext secrets.
- Separate cosmetic duplication from behavior-changing conflicts.`,

  outputType: 'markdown',
}
