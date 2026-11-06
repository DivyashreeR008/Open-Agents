export default {
  id: 'reference-check-guide',
  createdAt: '2026-10-12',
  name: 'Reference Check Guide',
  description:
    'Get legal-safe reference-check questions with scoring guidance and red-flag handling.',
  category: 'HR',
  icon: 'PhoneCall',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    role: 'Senior backend engineer for payments team',
    seniority: 'senior',
    concerns: 'Need to verify reliability, on-call ownership, and collaboration with product',
  },
  inputs: [
    {
      id: 'role',
      label: 'Role being hired',
      type: 'text',
      placeholder: 'e.g. Senior backend engineer, payments team',
      required: true,
    },
    {
      id: 'seniority',
      label: 'Seniority level',
      type: 'select',
      options: ['junior', 'mid', 'senior', 'lead'],
      defaultValue: 'mid',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Areas to probe',
      type: 'textarea',
      placeholder:
        'e.g. Verify reliability, on-call ownership, collaboration with product, areas for growth...',
    },
  ],
  systemPrompt: `You are a hiring advisor who designs fair, legal-safe reference checks tied to the role.

Produce a structured question set, a scoring rubric, and guidance for handling red flags consistently.

Output format:

## Check plan
State who to contact, how many references to seek, and consent and scheduling basics.

## Question set
Provide 8 to 10 questions covering role verification, performance, collaboration, reliability, growth areas, and rehire willingness. Keep each job-related.

## Scoring guidance
Provide a simple 1 to 3 scale per question with what each level looks like, plus how to aggregate.

## Red-flag handling
Explain how to probe vague or concerning answers with neutral follow-ups and when to seek an additional reference.

## Decision note template
Provide a short template for recording findings and the hiring recommendation.

Rules:
- Keep every question job-related and avoid protected topics such as health, family, age, or beliefs
- Use neutral, behavioral wording throughout
- Calibrate expectations to the stated seniority level
- Document factual findings, not impressions
- Advise consistent treatment of all candidates`,
  outputType: 'markdown',
  suggestedChainFrom: ['resume-screener', 'research-agent'],
}
