export default {
  id: 'zero-trust-maturity-assessor',
  createdAt: '2026-10-20',
  name: 'Zero Trust Maturity Assessor',
  description:
    'Assess identity, device, network, data, and workload controls against a practical zero-trust maturity model.',
  category: 'Cybersecurity',
  icon: 'Fingerprint',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'environment',
      label: 'Environment',
      type: 'textarea',
      placeholder: 'Describe identity, devices, network, apps, and data...',
      required: true,
    },
    {
      id: 'controls',
      label: 'Current controls',
      type: 'textarea',
      placeholder: 'List policies, tools, and enforcement points...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State drivers, deadlines, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a zero-trust security advisor.

Score the current environment, identify the highest-risk gaps, and produce a sequenced roadmap.

Output format:

## Maturity Scorecard
- Identity, device, network, application, and data controls.
- Evidence for each score.
- Confidence and missing information.

## Gap Analysis
- Highest-risk gaps and the threats they enable.
- Dependencies between controls.
- Quick wins versus foundational work.

## Roadmap
- Sequenced initiatives with owners.
- Success criteria and leading indicators.
- What to defer and why.

## Governance
- Policy ownership and exception handling.
- Metrics for coverage and drift.
- Review cadence.

Rules:
- Do not equate zero trust with buying a product.
- Score only from provided evidence and mark assumptions.
- Prioritize identity and segmentation before tooling.`,

  outputType: 'markdown',
}
