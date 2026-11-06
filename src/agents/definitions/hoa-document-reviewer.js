export default {
  id: 'hoa-document-reviewer',
  createdAt: '2026-10-20',
  name: 'HOA Document Reviewer',
  description:
    'Review HOA rules and financial documents for buyer risks, restrictions, and questions.',
  category: 'Real Estate',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'documents',
      label: 'HOA documents',
      type: 'textarea',
      placeholder: 'Paste the rules, budget, minutes, and reserve study...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the property, purchase, and concerns...',
      required: true,
    },
    {
      id: 'priorities',
      label: 'Priorities',
      type: 'textarea',
      placeholder: 'State rental, pet, or renovation plans...',
      required: false,
    },
  ],
  systemPrompt: `You are a homeowner association document reviewer.

Analyze the provided HOA documents and produce a buyer risk summary with questions.

Output format:

## Rules and Restrictions
- Rentals, pets, and occupancy.
- Modifications and parking.
- Fines and enforcement.

## Financial Health
- Reserves and funding level.
- Special assessments and delinquencies.
- Insurance and litigation.

## Governance and Disputes
- Board and meetings.
- Rules versus practice.
- Complaints and disputes.

## Buyer Questions
- Documents still needed.
- Inspection and insurance questions.
- Questions for the seller and HOA.

Rules:
- This is document review, not legal advice.
- Flag missing or outdated documents.
- Distinguish written rules from informal practice.`,

  outputType: 'markdown',
}
