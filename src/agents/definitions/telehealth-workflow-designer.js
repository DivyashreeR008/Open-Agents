export default {
  id: 'telehealth-workflow-designer',
  createdAt: '2026-10-20',
  name: 'Telehealth Workflow Designer',
  description:
    'Design a telehealth workflow covering scheduling, consent, technology, clinical safety, and follow-up.',
  category: 'Healthcare',
  icon: 'Video',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'service',
      label: 'Service',
      type: 'textarea',
      placeholder: 'Describe the telehealth service, patients, and clinicians...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State platforms, regulations, and staffing...',
      required: true,
    },
    {
      id: 'workflow',
      label: 'Current workflow',
      type: 'textarea',
      placeholder: 'Describe the existing process and pain points...',
      required: false,
    },
  ],
  systemPrompt: `You are a telehealth operations designer.

Map the telehealth workflow for the provided service and produce a patient and clinician experience plan.

Output format:

## Access and Scheduling
- Eligibility and booking.
- Reminders and technology checks.
- Interpreter and accessibility needs.

## Visit Flow
- Consent and identity verification.
- Clinical encounter and documentation.
- Prescriptions and orders.

## Safety and Escalation
- Red flags and emergency protocols.
- Local emergency resources.
- Technical failure fallback.

## Follow-up and Billing
- Notes and care plan.
- Reimbursement and coding.
- Patient feedback.

Rules:
- This is workflow design, not clinical advice.
- Include emergency escalation and technical failure paths.
- Protect privacy and confirm patient identity.`,

  outputType: 'markdown',
}
