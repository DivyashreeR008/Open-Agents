export default {
  id: 'architecture-fitness-function-designer',
  createdAt: '2026-10-20',
  name: 'Architecture Fitness Function Designer',
  description:
    'Turn architectural rules into automated fitness functions with thresholds, ownership, and CI enforcement.',
  category: 'Engineering',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'principles',
      label: 'Architecture principles',
      type: 'textarea',
      placeholder: 'List the rules and qualities the system must preserve...',
      required: true,
    },
    {
      id: 'codebase',
      label: 'Codebase context',
      type: 'textarea',
      placeholder: 'Describe modules, dependencies, and build tooling...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State CI time limits, existing tools, and team ownership...',
      required: false,
    },
  ],
  systemPrompt: `You are a software architecture engineer.

Convert the stated architecture principles into measurable fitness functions that can run in CI.

Output format:

## Principles to Signals
- Dependency direction, layering, and module boundaries.
- Performance, reliability, and security characteristics.
- Which principles are enforceable versus aspirational.

## Fitness Functions
- Metric, threshold, tool, and failure mode for each rule.
- Blocking versus advisory checks.
- Baseline and trend measurement.

## CI Integration
- Where each check runs and how long it takes.
- Exception handling and ownership.
- Reporting that developers will actually read.

## Governance
- Review cadence and threshold changes.
- Remediation workflow for violations.
- How to retire checks that no longer matter.

Rules:
- Every fitness function must be measurable and reproducible.
- Avoid vanity metrics that do not map to a principle.
- Include a legitimate exception path with an expiry date.`,

  outputType: 'markdown',
}
