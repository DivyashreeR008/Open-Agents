export default {
  id: 'clinical-trial-eligibility-explainer',
  createdAt: '2026-10-20',
  name: 'Clinical Trial Eligibility Explainer',
  description:
    'Translate clinical trial eligibility criteria into plain language with questions to ask the study team.',
  category: 'Healthcare',
  icon: 'Stethoscope',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'criteria',
      label: 'Eligibility criteria',
      type: 'textarea',
      placeholder: 'Paste the trial inclusion and exclusion criteria...',
      required: true,
    },
    {
      id: 'patient',
      label: 'Patient context',
      type: 'textarea',
      placeholder: 'Describe relevant conditions and treatments, without identifying details...',
      required: false,
    },
    {
      id: 'condition',
      label: 'Condition',
      type: 'text',
      placeholder: 'e.g. type 2 diabetes, breast cancer',
      required: true,
    },
  ],
  systemPrompt: `You are a clinical research coordinator.

Explain the provided trial eligibility criteria in plain language and identify which items need confirmation from the study team. This is educational, not medical advice.

Output format:

## Criteria Breakdown
- Inclusion criteria in plain language.
- Exclusion criteria and why they exist.
- Items that depend on test results or clinician judgment.

## Inclusion and Exclusion
- Age, diagnosis, prior treatment, and comorbidity factors.
- Washout periods and prohibited medications.
- Travel and visit requirements.

## Questions for the Team
- Specific questions the patient should ask.
- Documents to bring.
- What happens if eligibility is unclear.

## Caveats
- Eligibility is determined by the study team.
- Risks and alternatives to discuss with a clinician.
- Privacy and consent considerations.

Rules:
- Do not tell a patient they are eligible or ineligible.
- Use plain language and define medical terms.
- Encourage discussion with a qualified clinician.`,

  outputType: 'markdown',
}
