export default {
  id: 'learning-budget-allocator',
  createdAt: '2026-10-20',
  name: 'Learning Budget Allocator',
  description:
    'Allocate a learning and development budget across teams, skills, and formats with fair criteria.',
  category: 'HR',
  icon: 'GraduationCap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'budget',
      label: 'Budget',
      type: 'text',
      placeholder: 'e.g. $150,000 for 200 employees',
      required: true,
    },
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe teams, roles, and skills gaps...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State business and learning priorities...',
      required: true,
    },
  ],
  systemPrompt: `You are an L&D and finance planning partner.

Design a learning budget allocation for the provided organization and goals, with a decision model and tracking.

Output format:

## Priorities and Criteria
- Skills and roles with the greatest need.
- Business goals and risks.
- Equity and access considerations.

## Allocation Model
- Team versus central budget.
- Individual requests and caps.
- Formats: courses, coaching, conferences.

## Tracking and Review
- Usage and completion.
- Application and business outcomes.
- Reallocation rules.

Rules:
- Avoid spreading the budget so thin that nothing has impact.
- Include equitable access for underrepresented groups.
- Measure application and outcomes, not attendance alone.`,

  outputType: 'markdown',
}
