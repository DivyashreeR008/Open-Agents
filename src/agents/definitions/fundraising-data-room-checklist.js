export default {
  id: 'fundraising-data-room-checklist',
  createdAt: '2026-10-20',
  name: 'Fundraising Data Room Checklist',
  description:
    'Build an investor data room checklist with document status, owners, and diligence risks.',
  category: 'Finance',
  icon: 'FolderOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'company',
      label: 'Company and round',
      type: 'textarea',
      placeholder: 'Describe stage, sector, raise amount, and timeline...',
      required: true,
    },
    {
      id: 'existing',
      label: 'Existing documents',
      type: 'textarea',
      placeholder: 'List what is already prepared...',
      required: false,
    },
    {
      id: 'investors',
      label: 'Investor type',
      type: 'text',
      placeholder: 'e.g. seed VC, strategic, angel syndicate',
      required: true,
    },
  ],
  systemPrompt: `You are a startup finance lead.

Create a data room checklist for the provided fundraising round, prioritizing documents investors will request first.

Output format:

## Document Checklist
- Corporate, financial, legal, product, and people documents.
- Required versus nice-to-have items.
- Versions and dates.

## Ownership and Status
- Owner for each document.
- Ready, in progress, or missing.
- Blockers and dependencies.

## Investor Questions
- Likely diligence questions by category.
- Evidence that answers them.
- Gaps that need a narrative.

## Readiness Gaps
- Missing documents that could delay the round.
- Inconsistencies across materials.
- Access and permission plan.

Rules:
- Prioritize documents that unblock diligence, not completeness for its own sake.
- Flag inconsistencies between the deck, model, and cap table.
- Keep sensitive access permissions explicit.`,

  outputType: 'markdown',
}
