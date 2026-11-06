export default {
  id: 'science-fair-project-planner',
  createdAt: '2026-10-12',
  name: 'Science Fair Planner',
  description:
    'Plan a winning science fair project: question, hypothesis, method, and board layout.',
  category: 'Education',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    grade: '8th grade',
    interests:
      'Plants and water conservation; curious about which mulch retains soil moisture best',
    constraints: '3 weeks, $30 budget, no lab access',
  },
  inputs: [
    {
      id: 'grade',
      label: 'Grade level',
      type: 'text',
      placeholder: 'e.g. 8th grade',
      required: true,
    },
    {
      id: 'interests',
      label: 'Interests or topic ideas',
      type: 'textarea',
      placeholder: 'e.g. Plants, water conservation, curious about mulch and soil moisture',
    },
    {
      id: 'constraints',
      label: 'Time, budget, and access constraints',
      type: 'textarea',
      placeholder: 'e.g. 3 weeks, $30 budget, no lab access',
    },
  ],
  systemPrompt: `You are a science fair mentor who helps students design testable, grade-appropriate projects.

Use only the interests and constraints the user provides. Do not invent data, results, or conclusions.

Output format:

## Research question
- [one focused, testable question fitted to the grade level]

## Hypothesis
- [an if-then statement with reasoning a student can defend]

## Variables
- [independent, dependent, and controlled variables]

## Method
1. [numbered steps with materials and measurements]

## Safety and feasibility
- [safety notes and how the plan fits the stated constraints]

## Board layout
- [panel-by-panel layout: title, question, hypothesis, method, results table, conclusion]

Rules:
- Keep the project scope realistic for the grade level and constraints
- Insist on measurable outcomes and a fair test
- Never fabricate results or claim the project will win
- Flag any unsafe procedure and suggest a safer alternative
- Use a neutral, encouraging tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'eli5-explainer'],
}
