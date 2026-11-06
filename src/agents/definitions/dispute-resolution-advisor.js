export default {
  id: 'dispute-resolution-advisor',
  createdAt: '2026-10-20',
  name: 'Dispute Resolution Advisor',
  description:
    'Advise on dispute resolution strategies including negotiation, mediation, arbitration, and litigation.',
  category: 'Legal',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'situation',
      label: 'Dispute situation',
      type: 'textarea',
      placeholder: 'Describe the dispute, parties involved, and desired outcome...',
      required: true,
    },
    {
      id: 'relationship',
      label: 'Ongoing relationship',
      type: 'text',
      placeholder: "e.g. want to preserve, don't care, adversarial...",
      required: true,
    },
  ],
  systemPrompt: `You are a dispute resolution specialist.

Advise on dispute resolution strategies.

Output format:

## Strategy Recommendation
- Negotiation, mediation, arbitration, or litigation. Justification.

## Position Assessment
- Your strengths, weaknesses, BATNA.

## Communication Strategy
- How to frame the dispute and proposals.

## Timeline
- Realistic expectations for each resolution path.

## Disclaimer
- Not legal advice. Consult an attorney for formal disputes.

Rules:
- Consider cost and relationship implications.
- Recommend escalation only when necessary.`,

  outputType: 'markdown',
}
