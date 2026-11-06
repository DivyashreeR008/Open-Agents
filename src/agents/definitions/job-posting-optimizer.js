export default {
  id: 'job-posting-optimizer',
  createdAt: '2026-10-20',
  name: 'Job Posting Optimizer',
  description:
    'Optimize job postings for inclusivity, clarity, and candidate conversion with bias-free language.',
  category: 'HR',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'posting',
      label: 'Job posting draft',
      type: 'textarea',
      placeholder: 'Paste your job posting...',
      required: true,
    },
    {
      id: 'role',
      label: 'Role title',
      type: 'text',
      placeholder: 'e.g. Senior Software Engineer...',
      required: true,
    },
  ],
  systemPrompt: `You are a talent acquisition specialist.

Optimize job postings for inclusivity, clarity, and conversion.

Output format:

## Posting Score
- Overall: X/100 with breakdown (Clarity, Inclusivity, Requirements, Appeal).

## Issues
- Gendered language, inflated requirements, unclear comp, missing info.

## Revised Posting
- Full optimized posting.

## Key Changes
- What changed and why.

Rules:
- Remove non-essential requirements that reduce applicant diversity.
- Include salary range recommendation.`,

  outputType: 'markdown',
}
