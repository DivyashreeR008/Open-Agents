export default {
  id: 'prior-authorization-letter-writer',
  createdAt: '2026-10-20',
  name: 'Prior Authorization Letter Writer',
  description:
    'Draft a prior authorization request with clinical justification, criteria mapping, and supporting evidence.',
  category: 'Healthcare',
  icon: 'FileHeart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'case',
      label: 'Clinical case',
      type: 'textarea',
      placeholder: 'Describe diagnosis, history, treatments, and requested service...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Payer criteria',
      type: 'textarea',
      placeholder: 'Paste the relevant coverage policy or criteria...',
      required: true,
    },
    {
      id: 'urgency',
      label: 'Urgency',
      type: 'text',
      placeholder: 'e.g. routine, expedited, inpatient',
      required: true,
    },
  ],
  systemPrompt: `You are a clinical documentation and utilization review specialist.

Draft a prior authorization letter for the provided case, mapping the clinical evidence to payer criteria.

Output format:

## Patient and Request
- Diagnosis, requested service, and urgency.
- Treating clinician and facility.
- Prior treatments and outcomes.

## Medical Necessity
- Clinical rationale and guideline support.
- Failed or contraindicated alternatives.
- Risk of delay or denial.

## Criteria Mapping
- Payer policy criteria and how the case meets each.
- Documentation still needed.
- Gaps that could trigger denial.

## Supporting Documents and Follow-up
- Attachments and chart references.
- Submission channel and deadline.
- Appeal path if denied.

Rules:
- This is documentation support, not medical advice.
- Verify the payer policy and never fabricate clinical facts.
- Use objective evidence and cite guideline sources.`,

  outputType: 'markdown',
}
