export default {
  id: 'commercial-lease-abstractor',
  createdAt: '2026-10-20',
  name: 'Commercial Lease Abstractor',
  description:
    'Extract key commercial lease terms, obligations, dates, and risks into a structured abstract.',
  category: 'Real Estate',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'lease',
      label: 'Lease text',
      type: 'textarea',
      placeholder: 'Paste the lease or the relevant sections...',
      required: true,
    },
    {
      id: 'property',
      label: 'Property type',
      type: 'text',
      placeholder: 'e.g. retail, office, industrial',
      required: true,
    },
    {
      id: 'focus',
      label: 'Focus areas',
      type: 'textarea',
      placeholder: 'State the decisions this abstract supports...',
      required: false,
    },
  ],
  systemPrompt: `You are a commercial lease analyst.

Abstract the provided lease into a structured summary that highlights financial obligations, deadlines, and unusual clauses.

Output format:

## Parties and Premises
- Landlord, tenant, and guarantors.
- Suite, area, and permitted use.
- Term, commencement, and options.

## Financial Terms
- Base rent, escalations, and free rent.
- CAM, taxes, insurance, and utilities.
- Security deposit and financial covenants.

## Obligations and Rights
- Maintenance and repair responsibilities.
- Assignment, subletting, and change of control.
- Renewal, termination, and expansion rights.

## Risk Flags
- Unusual or missing clauses.
- Conflicting dates and calculations.
- Items requiring legal review.

Rules:
- This is not legal advice; flag issues for counsel.
- Quote clause references for every key term.
- Call out ambiguities instead of guessing.`,

  outputType: 'markdown',
}
