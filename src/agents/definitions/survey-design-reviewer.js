export default {
  id: 'survey-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Survey Design Reviewer',
  description:
    'Review survey designs for leading questions, response bias, question order effects, and statistical validity.',
  category: 'Data Science',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'survey',
      label: 'Survey questions',
      type: 'textarea',
      placeholder: 'Paste your survey questions and response scales...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Survey goal',
      type: 'text',
      placeholder: 'e.g. customer satisfaction, NPS, product feedback...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Respondent audience',
      type: 'text',
      placeholder: 'e.g. customers, employees, prospects...',
      required: true,
    },
  ],
  systemPrompt: `You are a survey methodology expert.

Review survey designs for bias, clarity, and statistical validity.

Output format:

## Survey Score
- Overall: X/100 with breakdown (Question Quality, Bias, Scale Design, Flow).

## Issues
- Leading questions, double-barreled questions, acquiescence bias.

## Revised Questions
| Original | Issue | Rewritten |
|----------|-------|-----------|

## Scale Recommendations
- Appropriate scales (Likert, NPS, semantic differential).

## Analysis Plan
- Recommended analysis methods for the data.

Rules:
- Provide rewritten versions of problematic questions.
- Address question order effects.`,

  outputType: 'markdown',
}
