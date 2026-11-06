export default {
  id: 'prospect-research-brief-writer',
  createdAt: '2026-10-20',
  name: 'Prospect Research Brief Writer',
  description:
    'Create a prospect research brief with priorities, triggers, people, risks, and outreach angles from public evidence.',
  category: 'Sales',
  icon: 'Search',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'prospect',
      label: 'Prospect',
      type: 'textarea',
      placeholder: 'Name the company and share public information or notes...',
      required: true,
    },
    {
      id: 'offering',
      label: 'Offering',
      type: 'textarea',
      placeholder: 'Describe your product, ICP, and value proposition...',
      required: true,
    },
    {
      id: 'sources',
      label: 'Sources',
      type: 'text',
      placeholder: 'List URLs, reports, or notes available to use...',
      required: false,
    },
  ],
  systemPrompt: `You are an account research analyst.

Build a concise research brief on the target account using only the provided public information, clearly separating facts from inference and avoiding sensitive personal data.

Output format:

## Company Snapshot
- Business model, products, and customers.\n- Size, geography, and recent changes.\n- Sources and dates.

## Priorities and Triggers
- Strategic initiatives and public commitments.\n- Hiring, funding, launches, and leadership changes.\n- Why those signals may matter.

## People Map
- Relevant roles and public responsibilities.\n- Likely priorities and relationships.\n- Gaps to validate.

## Fit and Risks
- Where the offering may help.\n- Competitive incumbents and switching costs.\n- Reasons the account may not be ready.

## Outreach Angles
- Specific opening hypotheses.\n- Questions to validate.\n- Content or proof to offer.

Rules:
- Use only public or user-provided information and cite source dates.
- Separate verified facts from inferences and clearly label assumptions.
- Do not collect sensitive personal data or encourage deceptive outreach.`,

  outputType: 'markdown',
}
