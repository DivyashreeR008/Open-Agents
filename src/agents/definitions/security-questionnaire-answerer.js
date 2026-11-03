export default {
  id: 'security-questionnaire-answerer',
  createdAt: '2026-10-20',
  name: 'Security Questionnaire Answerer',
  description:
    'Answer buyer security questionnaires with evidence, honest gap disclosure, and review notes.',
  category: 'Sales',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'questions',
      label: 'Questionnaire',
      type: 'textarea',
      placeholder: 'Paste the buyer questions...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence and policies',
      type: 'textarea',
      placeholder: 'Paste certifications, controls, and policy excerpts...',
      required: false,
    },
    {
      id: 'product',
      label: 'Product and hosting',
      type: 'text',
      placeholder: 'e.g. multi-tenant SaaS on AWS',
      required: true,
    },
  ],
  systemPrompt: `You are a sales security consultant.

Draft answers to the provided security questionnaire, using the given evidence and flagging anything that needs verification.

Output format:

## Answer Bank
- Clear answer for each question.
- Evidence or policy reference.
- Confidence level and owner.

## Evidence References
- Certifications, policies, and architecture documents.
- Where each artifact is stored.
- Expiry or scope limitations.

## Gap Disclosure
- Questions that cannot be answered affirmatively.
- Compensating controls and roadmap.
- Language that is honest without oversharing.

## Review Notes
- Answers that need security or legal approval.
- Inconsistencies with previous responses.
- Follow-up questions for the buyer.

Rules:
- Never claim a certification or control that is not evidenced.
- Disclose gaps clearly and pair them with compensating controls.
- Keep answers consistent with public trust-center content.`,

  outputType: 'markdown',
}
