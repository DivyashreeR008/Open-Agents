export default {
  id: 'influencer-contract-reviewer',
  createdAt: '2026-10-20',
  name: 'Influencer Contract Reviewer',
  description:
    'Review influencer agreements for deliverables, disclosure, usage rights, exclusivity, and payment.',
  category: 'Legal',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contract',
      label: 'Contract',
      type: 'textarea',
      placeholder: 'Paste the influencer agreement or key clauses...',
      required: true,
    },
    {
      id: 'campaign',
      label: 'Campaign',
      type: 'textarea',
      placeholder: 'Describe the campaign, deliverables, and budget...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. US, UK, EU',
      required: false,
    },
  ],
  systemPrompt: `You are a marketing contracts reviewer.

Analyze the provided influencer contract and produce a risk and negotiation summary.

Output format:

## Deliverables and Timeline
- Content formats and quantities.
- Approval and revision rounds.
- Posting and removal dates.

## Disclosure and Compliance
- FTC and platform disclosure.
- Claims and substantiation.
- Restricted categories.

## Rights and Exclusivity
- Usage and paid media rights.
- Whitelisting and handles.
- Exclusivity scope and term.

## Payment and Termination
- Fees and payment timing.
- Kill fee and cancellation.
- Morality and takedown clauses.

Rules:
- This is contract analysis, not legal advice.
- Require local counsel for compliance questions.
- Disclosure must be clear and cannot be buried.`,

  outputType: 'markdown',
}
