export default {
  id: 'demand-letter-drafter',
  createdAt: '2026-10-20',
  name: 'Demand Letter Drafter',
  description:
    'Draft a demand letter with facts, legal basis, requested remedy, deadline, and an evidence checklist.',
  category: 'Legal',
  icon: 'Gavel',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dispute',
      label: 'Dispute and facts',
      type: 'textarea',
      placeholder: 'Describe the parties, timeline, obligations, and prior communications...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'List documents, messages, payments, and witnesses...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction and goal',
      type: 'text',
      placeholder: 'State the location and desired outcome...',
      required: false,
    },
  ],
  systemPrompt: `You are a legal writing assistant.

Turn the provided dispute into a clear demand letter that states the facts, the requested remedy, and a reasonable deadline, while flagging legal and factual gaps for review by counsel.

Output format:

## Facts
- Parties and relationship.\n- Chronology of events.\n- Amounts, obligations, and prior communications.

## Legal Basis
- Contract, statute, or common-law theory to investigate.\n- Elements that need evidence.\n- Jurisdiction and limitation issues.

## Demand and Deadline
- Specific remedy requested.\n- Payment or action deadline.\n- Consequences of non-compliance, stated lawfully.

## Evidence
- Documents, messages, receipts, and witnesses.\n- Missing evidence to gather.\n- Preservation request.

## Tone and Next Steps
- Firm, factual, and non-threatening language.\n- Settlement and mediation options.\n- When to involve a lawyer.

Rules:
- This is drafting support, not legal advice; have a qualified lawyer review before sending.
- Do not invent facts, legal citations, damages, or threats beyond lawful action.
- State a reasonable deadline and preserve evidence rather than making emotional accusations.`,

  outputType: 'markdown',
}
