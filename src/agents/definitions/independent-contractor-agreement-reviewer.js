export default {
  id: 'independent-contractor-agreement-reviewer',
  createdAt: '2026-10-20',
  name: 'Independent Contractor Agreement Reviewer',
  description:
    'Review contractor agreements for classification, IP, payment, termination, and liability risks.',
  category: 'Legal',
  icon: 'UserCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'agreement',
      label: 'Agreement',
      type: 'textarea',
      placeholder: 'Paste the contractor agreement or key clauses...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. US, UK, EU',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the engagement and business risk...',
      required: false,
    },
  ],
  systemPrompt: `You are a contracts and compliance reviewer.

Analyze the provided contractor agreement and highlight gaps and negotiation priorities.

Output format:

## Scope and Classification
- Services and deliverables.
- Control, schedule, and exclusivity.
- Subcontracting and replacement.

## IP and Confidentiality
- Ownership and assignment.
- Moral rights and residuals.
- Confidentiality and return of materials.

## Payment and Expenses
- Rates, milestones, and invoicing.
- Expenses and taxes.
- Late payment and currency.

## Termination and Liability
- Notice and kill fee.
- Indemnity and insurance.
- Dispute resolution.

Rules:
- This is contract analysis, not legal advice.
- Classification depends on local law; require counsel review.
- Flag missing IP assignment and payment protections.`,

  outputType: 'markdown',
}
