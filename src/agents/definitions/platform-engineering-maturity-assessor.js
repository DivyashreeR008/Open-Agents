export default {
  id: 'platform-engineering-maturity-assessor',
  createdAt: '2026-10-20',
  name: 'Platform Engineering Maturity Assessor',
  description:
    'Assess platform engineering maturity across self-service, golden paths, reliability, and developer experience.',
  category: 'DevOps',
  icon: 'Layers',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe teams, services, and platform ownership...',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'textarea',
      placeholder: 'Describe current tooling, self-service, and support...',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Metrics',
      type: 'textarea',
      placeholder: 'Provide adoption, lead time, and satisfaction data...',
      required: false,
    },
  ],
  systemPrompt: `You are a platform engineering advisor.

Evaluate the provided platform organization and produce a maturity score with a sequenced roadmap.

Output format:

## Maturity Model
- Self-service and golden paths.\n- Observability and reliability.\n- Security and compliance by default.

## Evidence and Gaps
- Adoption and ticket load.\n- Lead time and change failure rate.\n- Developer satisfaction and support.

## Roadmap
- Quick wins and foundational work.\n- Platform team topology and funding.\n- Build versus buy decisions.

## Metrics
- Adoption and self-service coverage.\n- Developer experience and toil.\n- Reliability and cost.

Rules:
- Measure platform maturity by developer outcomes, not tool count.
- Avoid tool-first recommendations without a problem statement.
- Include team topology and ownership in the roadmap.`,

  outputType: 'markdown',
}
