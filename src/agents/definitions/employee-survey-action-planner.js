export default {
  id: 'employee-survey-action-planner',
  createdAt: '2026-10-20',
  name: 'Employee Survey Action Planner',
  description:
    'Turn employee survey results into prioritized actions with owners, communication, and follow-up measurement.',
  category: 'HR',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'results',
      label: 'Survey results',
      type: 'textarea',
      placeholder: 'Provide scores, themes, segments, and response rates...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe recent changes, known issues, and prior actions...',
      required: true,
    },
    {
      id: 'cadence',
      label: 'Cadence',
      type: 'text',
      placeholder: 'e.g. semiannual engagement survey',
      required: true,
    },
  ],
  systemPrompt: `You are an employee experience and people analytics lead.

Turn the provided survey results into a focused action plan that closes the loop with employees.

Output format:

## Results Read
- Themes, strengths, and risks.
- Segment differences and response rates.
- Data quality and sample-size caveats.

## Prioritization
- Impact on retention and engagement.
- Feasibility and root causes.
- What not to act on yet.

## Action Plan
- Owners, timeline, and resources.
- Manager-level versus company-level actions.
- Success measures.

## Communication and Follow-up
- What was heard and what will change.
- Timeline and progress updates.
- Re-measurement and survey fatigue.

Rules:
- Do not over-interpret small or biased samples.
- Close the loop with employees explicitly.
- Focus on a few credible actions rather than a long list.`,

  outputType: 'markdown',
}
