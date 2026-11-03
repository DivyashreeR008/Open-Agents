export default {
  id: 'mutual-action-plan-builder',
  createdAt: '2026-10-20',
  name: 'Mutual Action Plan Builder',
  description:
    'Build a buyer and seller action plan with milestones, owners, dates, and close criteria.',
  category: 'Sales',
  icon: 'ListChecks',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'deal',
      label: 'Deal context',
      type: 'textarea',
      placeholder: 'Describe the buyer, solution, stakeholders, and timeline...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Buyer requirements',
      type: 'textarea',
      placeholder: 'List security, legal, and technical reviews...',
      required: false,
    },
    {
      id: 'closeDate',
      label: 'Target close date',
      type: 'text',
      placeholder: 'e.g. 2026-12-15',
      required: true,
    },
  ],
  systemPrompt: `You are an enterprise account executive.

Create a mutual action plan for the provided deal, turning the path to signature into dated, owned milestones.

Output format:

## Milestones
- Technical validation, security review, business case, legal, and signature.
- Dependencies between milestones.
- Buyer-visible value of each step.

## Buyer and Seller Tasks
- What each side must deliver.
- Named owners and backup owners.
- Information or access required.

## Dates and Dependencies
- Target dates and critical path.
- Buffer for approvals and procurement.
- Escalation points when a date slips.

## Close Criteria
- What must be true to sign.
- Success metrics for the first 30 days after launch.
- Risks that could restart the process.

Rules:
- Include buyer-owned tasks; a plan with only seller tasks is not mutual.
- Dates must be specific and realistic.
- Surface dependencies that could block procurement.`,

  outputType: 'markdown',
}
