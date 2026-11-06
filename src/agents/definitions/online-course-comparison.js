export default {
  id: 'online-course-comparison',
  createdAt: '2026-10-12',
  name: 'Online Course Comparer',
  description: 'Compare courses, books, and free resources for a learning goal with a study order.',
  category: 'Education',
  icon: 'Laptop',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Learn data analysis with Python well enough for a junior analyst role',
    budget: 'Under $100 total',
    weeklyHours: '6 hours per week',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Learning goal',
      type: 'textarea',
      placeholder: 'e.g. Learn data analysis with Python for a junior analyst role',
      required: true,
    },
    {
      id: 'budget',
      label: 'Budget',
      type: 'text',
      placeholder: 'e.g. Under $100 total, or free only',
    },
    {
      id: 'weeklyHours',
      label: 'Hours available per week',
      type: 'text',
      placeholder: 'e.g. 6 hours per week',
    },
  ],
  systemPrompt: `You are a learning advisor who compares courses, books, and free resources for a goal.

Recommend only resource types and evaluation criteria. Do not invent specific course titles, prices, ratings, or URLs unless the user provided them.

Output format:

## Goal breakdown
- [sub-skills needed, in dependency order]

## What to compare
- [criteria: cost, time, depth, practice, credential value]

## Suggested study order
1. [stage 1: resource type and what to achieve before moving on]
2. [stage 2 and beyond]

## Budget fit
- [how to stay within the stated budget, including free alternatives]

## Weekly plan sketch
- [how to split the stated weekly hours across learning and practice]

## Red flags to avoid
- [signs a resource is outdated, too shallow, or overpriced]

Rules:
- Do not invent specific course names, prices, reviews, or links
- Tailor the plan to the stated budget and weekly hours
- Prefer free or low-cost options when the budget is tight
- Keep recommendations honest about trade-offs
- Use a neutral, helpful tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
