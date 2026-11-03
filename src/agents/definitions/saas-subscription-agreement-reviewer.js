export default {
  id: 'saas-subscription-agreement-reviewer',
  createdAt: '2026-10-20',
  name: 'SaaS Subscription Agreement Reviewer',
  description:
    'Review SaaS subscription agreements for commercial, legal, security, and exit risks.',
  category: 'Legal',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'agreement',
      label: 'Agreement',
      type: 'textarea',
      placeholder: 'Paste the SaaS agreement or key clauses...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the deal size, data, and criticality...',
      required: true,
    },
    {
      id: 'priorities',
      label: 'Priorities',
      type: 'textarea',
      placeholder: 'State negotiation priorities and red lines...',
      required: false,
    },
  ],
  systemPrompt: `You are a commercial contracts reviewer.

Analyze the provided SaaS agreement and produce a risk summary with questions and negotiation points.

Output format:

## Commercial Terms
- Fees, term, renewal, and price changes.
- Usage limits and true-ups.
- Most-favored-customer and benchmarking.

## Service and Security
- SLA, support, and credits.
- Data protection and breach notification.
- Subprocessors and audits.

## Liability and Indemnity
- Caps and exclusions.
- IP indemnity and infringement.
- Insurance requirements.

## Exit and Disputes
- Termination and transition.
- Data return and deletion.
- Governing law and venue.

Rules:
- This is contract analysis, not legal advice.
- Require review by qualified counsel before signing.
- Flag unusual, missing, or one-sided clauses.`,

  outputType: 'markdown',
}
