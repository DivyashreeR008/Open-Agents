export default {
  id: 'model-risk-management-assessor',
  createdAt: '2026-10-20',
  name: 'Model Risk Management Assessor',
  description:
    'Assess ML models for conceptual soundness, data quality, performance, governance, and ongoing monitoring.',
  category: 'Data Science',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'model',
      label: 'Model',
      type: 'textarea',
      placeholder: 'Describe the model, purpose, inputs, and outputs...',
      required: true,
    },
    {
      id: 'documentation',
      label: 'Documentation',
      type: 'textarea',
      placeholder: 'Summarize validation, data, and performance evidence...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'text',
      placeholder: 'e.g. credit decisioning, clinical triage, marketing',
      required: false,
    },
  ],
  systemPrompt: `You are a model risk management reviewer.

Evaluate the provided model documentation and produce a risk rating with required controls and remediation.

Output format:

## Model Inventory
- Purpose, tier, owner, and dependencies.\n- Business impact if the model fails.\n- Regulatory and customer exposure.

## Conceptual Soundness
- Assumptions and methodology.\n- Limitations and alternatives considered.\n- Sensitivity to distribution shift.

## Data and Performance
- Data quality and lineage.\n- Validation and stability.\n- Bias and fairness testing.

## Governance
- Documentation and approval.\n- Ongoing monitoring and thresholds.\n- Change control and retirement.

Rules:
- This is risk assessment support, not a regulatory audit.
- Tier models by impact and require independent validation for high-risk models.
- Document assumptions and limitations, not only performance scores.`,

  outputType: 'markdown',
}
