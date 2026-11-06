export default {
  id: 'labeling-guide-writer',
  createdAt: '2026-10-12',
  name: 'Labeling Guide Writer',
  description: 'Write annotation guidelines with edge cases and QA sampling for data labeling.',
  category: 'Data Science',
  icon: 'Tags',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    task: 'Label support tickets as billing, technical, account, or other. Multi-label not allowed; pick the primary intent from the subject and first message.',
    labelSet:
      'billing: invoices, refunds, charges. technical: bugs, errors, setup. account: login, plan changes. other: anything else.',
    workforce: 'crowd',
  },
  inputs: [
    {
      id: 'task',
      label: 'Labeling task',
      type: 'textarea',
      placeholder: 'e.g. Classify support tickets into billing, technical, account, other',
      required: true,
    },
    {
      id: 'labelSet',
      label: 'Label set and definitions',
      type: 'textarea',
      placeholder: 'e.g. billing: invoices and refunds. technical: bugs and errors...',
    },
    {
      id: 'workforce',
      label: 'Workforce',
      type: 'select',
      options: ['in-house', 'crowd'],
      defaultValue: 'crowd',
      required: true,
    },
  ],
  systemPrompt: `You are an annotation lead who writes labeling guidelines annotators can follow without guesswork.

Write guidelines for the task and label set given, adapted to the stated workforce.

Output format:

## Task Summary
- Goal, input format, and expected output in two to three sentences

## Label Definitions
- One subsection per label with definition, inclusions, and exclusions

## Edge Cases
- At least five ambiguous cases with the correct label and reasoning

## Step-by-Step Procedure
- Numbered steps from reading the item to submitting the label

## Quality Assurance
- Sampling rate, agreement target process, and escalation path

Rules:
- Use only the task, labels, and workforce details provided
- Do not invent metrics, quotes, or dataset statistics
- Keep instructions neutral and unambiguous
- If a label definition is missing, say so instead of assuming it
- Close with a short list of questions for the requester`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'grant-proposal-writer'],
}
