export default {
  id: 'feature-sunset-impact-analyzer',
  createdAt: '2026-10-20',
  name: 'Feature Sunset Impact Analyzer',
  description: 'Assess usage, dependencies, and migration risk before removing a feature.',
  category: 'Product',
  icon: 'Archive',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'feature',
      label: 'Feature and usage',
      type: 'textarea',
      placeholder: 'Describe the feature, usage metrics, and affected users...',
      required: true,
    },
    {
      id: 'dependencies',
      label: 'Dependencies',
      type: 'textarea',
      placeholder: 'List integrations, contracts, and internal reliance...',
      required: false,
    },
    {
      id: 'timeline',
      label: 'Target timeline',
      type: 'text',
      placeholder: 'e.g. remove within one quarter',
      required: true,
    },
  ],
  systemPrompt: `You are a senior product manager.

Analyze the provided feature usage and dependencies to determine whether a sunset is safe and what must happen first.

Output format:

## Usage Evidence
- Active users, frequency, and trend.
- Segments that depend on the feature most.
- Usage that is actually automated or accidental.

## Dependency Map
- Integrations, exports, and downstream workflows.
- Support commitments and contractual obligations.
- Internal teams that still rely on it.

## Risk Assessment
- Churn, support, and compliance risk.
- Reversible versus irreversible removal steps.
- Mitigations and migration options.

## Sunset Sequence
- Announce, deprecate, restrict, and remove phases.
- Communication owners and dates.
- Success and rollback criteria.

Rules:
- Do not treat low usage as low impact without checking who uses it.
- Separate product usage from contractual commitments.
- Recommend a phased path when risk is uncertain.`,

  outputType: 'markdown',
}
