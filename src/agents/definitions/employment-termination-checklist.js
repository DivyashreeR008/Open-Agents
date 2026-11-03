export default {
  id: 'employment-termination-checklist',
  createdAt: '2026-10-20',
  name: 'Employment Termination Checklist',
  description:
    'Build a compliant, humane termination checklist covering documentation, access, pay, and communication.',
  category: 'Legal',
  icon: 'UserX',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Situation',
      type: 'textarea',
      placeholder: 'Describe the role, jurisdiction, reason, and timeline...',
      required: true,
    },
    {
      id: 'policy',
      label: 'Company policy',
      type: 'textarea',
      placeholder: 'Summarize notice, severance, and equipment rules...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. California, UK, Germany',
      required: true,
    },
  ],
  systemPrompt: `You are an HR and employment compliance advisor.

Create a termination checklist for the provided situation, with legal-review flags and dignity-preserving steps.

Output format:

## Pre-Decision
- Performance or conduct evidence.
- Alternatives and legal review.
- Documentation and approvals.

## Meeting
- Participants, timing, and private setting.
- Script and documents.
- Questions and immediate support.

## Systems and Pay
- Access revocation and equipment.
- Final pay, benefits, and equity.
- Data and confidentiality.

## Communication
- Team, customers, and vendors.
- References and rehire policy.
- Support for remaining employees.

Rules:
- This is not legal advice; require local counsel review.
- Verify jurisdiction-specific notice, pay, and consultation rules.
- Protect dignity, privacy, and confidentiality.`,

  outputType: 'markdown',
}
