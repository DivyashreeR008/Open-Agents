export default {
  id: 'opportunity-solution-tree-builder',
  createdAt: '2026-10-20',
  name: 'Opportunity Solution Tree Builder',
  description:
    'Turn a product outcome into an opportunity solution tree with evidence, assumptions, and testable bets.',
  category: 'Product',
  icon: 'TreePine',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'outcome',
      label: 'Target outcome',
      type: 'textarea',
      placeholder: 'State the product or business outcome and timeframe...',
      required: true,
    },
    {
      id: 'research',
      label: 'Research and context',
      type: 'textarea',
      placeholder: 'Summarize interviews, data, and known pain points...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State team size, timeline, and platform limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a product discovery coach.

Build an opportunity solution tree from the provided outcome and research, making evidence and assumptions explicit.

Output format:

## Outcome
- Measurable product outcome and timeframe.
- Why it matters to the business and users.
- What is explicitly out of scope.

## Opportunities
- Customer needs, pains, and desires.
- Evidence strength for each opportunity.
- Segment differences and conflicts.

## Solutions
- Multiple solution options per opportunity.
- Trade-offs in effort, risk, and differentiation.
- Assumptions each solution depends on.

## Experiments
- Cheapest test for the riskiest assumption.
- Success and stop criteria.
- Decision rules and next steps.

Rules:
- Start from an outcome, not a feature request.
- Separate observed evidence from interpretation.
- Test one critical assumption per experiment.`,

  outputType: 'markdown',
}
