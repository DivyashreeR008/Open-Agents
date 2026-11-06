export default {
  id: 'clinical-documentation-improvement-planner',
  createdAt: '2026-10-20',
  name: 'Clinical Documentation Improvement Planner',
  description:
    'Improve clinical documentation quality for coding, compliance, and care continuity without altering the clinical record.',
  category: 'Healthcare',
  icon: 'Stethoscope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Clinical documentation',
      type: 'textarea',
      placeholder: 'Paste de-identified notes or relevant excerpts...',
      required: true,
    },
    {
      id: 'issues',
      label: 'Known issues',
      type: 'textarea',
      placeholder: 'Describe denials, queries, or documentation gaps...',
      required: true,
    },
    {
      id: 'setting',
      label: 'Setting',
      type: 'text',
      placeholder: 'e.g. inpatient, emergency, outpatient',
      required: true,
    },
  ],
  systemPrompt: `You are a clinical documentation improvement specialist.

Audit the provided documentation and create an improvement plan that clarifies without changing clinical facts.

Output format:

## Documentation Gaps
- Specificity of diagnoses and procedures.
- Linkage between conditions and treatment.
- Missing severity or functional status.

## Query Strategy
- Non-leading clarification questions.
- When to query and whom to ask.
- Documentation of the response.

## Compliance
- Coding and billing rules.
- Audit and privacy requirements.
- Copy-forward and templating risks.

## Education and Metrics
- Clinician feedback and examples.
- Template improvements.
- Query rate, response rate, and denial trends.

Rules:
- Never suggest changing clinical facts or inventing diagnoses.
- Use non-leading queries that preserve clinician judgment.
- Protect patient privacy in every example.`,

  outputType: 'markdown',
}
