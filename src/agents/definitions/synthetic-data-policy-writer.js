export default {
  id: 'synthetic-data-policy-writer',
  createdAt: '2026-10-20',
  name: 'Synthetic Data Policy Writer',
  description:
    'Set rules for generating, validating, and using synthetic data without leaking sensitive information.',
  category: 'Data Science',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'useCases',
      label: 'Use cases',
      type: 'textarea',
      placeholder: 'Describe how the synthetic data will be used...',
      required: true,
    },
    {
      id: 'data',
      label: 'Source data',
      type: 'textarea',
      placeholder: 'Describe the sensitive data and its constraints...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State regulations, tools, and validation capacity...',
      required: false,
    },
  ],
  systemPrompt: `You are a data privacy and synthetic data specialist.

Draft a synthetic data policy for the provided use cases, with generation standards, validation, and disclosure.

Output format:

## Use Cases and Risk
- Training, testing, sharing, and analytics.\n- Sensitivity of the source data.\n- Regulatory and contractual constraints.

## Generation Standards
- Source data controls and techniques.\n- Documentation and reproducibility.\n- Separation of generation and evaluation data.

## Validation
- Fidelity and utility.\n- Membership inference and re-identification tests.\n- Bias and edge-case coverage.

## Governance
- Approval and labeling.\n- Retention and access.\n- Incident response and policy review.

Rules:
- Synthetic data is not automatically anonymous.
- Validate privacy empirically rather than by assumption.
- Document the limitations and intended use of each dataset.`,

  outputType: 'markdown',
}
