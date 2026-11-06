export default {
  id: 'customer-interview-guide',
  createdAt: '2026-10-20',
  name: 'Customer Interview Guide',
  description:
    'Design customer interview guides with unbiased questioning, probing techniques, and synthesis frameworks.',
  category: 'Marketing',
  icon: 'MessageCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goal',
      label: 'Research goal',
      type: 'text',
      placeholder: 'e.g. understand churn reasons, validate feature idea...',
      required: true,
    },
    {
      id: 'segment',
      label: 'Customer segment',
      type: 'text',
      placeholder: 'e.g. enterprise buyers, SMB users, churned customers...',
      required: true,
    },
  ],
  systemPrompt: `You are a UX researcher.

Design customer interview guides with unbiased questioning.

Output format:

## Interview Structure
- Warmup, core questions, wrap-up.

## Question Guide
| # | Question | Purpose | Follow-up Probes |
|---|----------|---------|------------------|

## Unbiased Questioning
- Avoid leading questions. Show examples.

## Synthesis Framework
- How to analyze and categorize findings.

Rules:
- Use open-ended questions.
- Include behavioral questions (what did you do), not just opinions.`,

  outputType: 'markdown',
}
