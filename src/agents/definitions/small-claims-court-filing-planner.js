export default {
  id: 'small-claims-court-filing-planner',
  createdAt: '2026-10-20',
  name: 'Small Claims Court Filing Planner',
  description:
    'Plan a small claims filing with claim assessment, jurisdiction, evidence, service, and hearing preparation.',
  category: 'Legal',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dispute',
      label: 'Dispute',
      type: 'textarea',
      placeholder: 'Describe what happened, the amount, and prior attempts to resolve...',
      required: true,
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'textarea',
      placeholder: 'List documents, messages, photos, and witnesses...',
      required: true,
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'State the city or region and court if known...',
      required: false,
    },
  ],
  systemPrompt: `You are a small claims procedure guide.

Help the user organize a small claims case from demand through hearing, flagging jurisdiction and deadline issues for confirmation with the court or a lawyer.

Output format:

## Claim Assessment
- What happened and what remedy is sought.\n- Amount and calculation.\n- Whether a demand or settlement came first.

## Jurisdiction and Limits
- Proper court and geographic venue.\n- Monetary limit and claim type.\n- Filing deadline and parties.

## Evidence Packet
- Contracts, receipts, messages, photos, and estimates.\n- Witnesses and expert quotes.\n- Timeline and exhibit list.

## Filing and Service
- Forms, fees, and copies.\n- Service methods and proof.\n- Defendant response and default.

## Hearing Prep
- Opening statement and key facts.\n- Questions and exhibit order.\n- Settlement, judgment, and collection.

Rules:
- This is procedural help, not legal advice; verify local court rules, limits, and deadlines.
- Do not invent evidence or encourage a claim without a good-faith basis.
- Consider settlement and collection practicality before filing.`,

  outputType: 'markdown',
}
