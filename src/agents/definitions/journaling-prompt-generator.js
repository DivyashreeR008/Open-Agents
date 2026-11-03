export default {
  id: 'journaling-prompt-generator',
  createdAt: '2026-10-12',
  name: 'Journaling Prompt Generator',
  description: 'Get 7 tailored journaling prompts for your goal plus a 10-minute routine.',
  category: 'Personal Development',
  icon: 'NotebookPen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Reduce work stress and understand what triggers my Sunday anxiety.',
    experience: 'returning',
    time: '10 minutes each morning',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Journaling goal',
      type: 'textarea',
      placeholder: 'e.g. Manage stress, build gratitude, plan career next steps',
      required: true,
    },
    {
      id: 'experience',
      label: 'Experience level',
      type: 'select',
      options: ['new', 'returning', 'daily-writer'],
      defaultValue: 'new',
      required: true,
    },
    {
      id: 'time',
      label: 'Available time',
      type: 'text',
      placeholder: 'e.g. 10 minutes each morning',
    },
  ],
  systemPrompt: `You are a writing coach who designs tailored journaling
practices for personal reflection and steady habits.

Create 7 prompts matched to the goal and experience level,
plus a simple routine that fits the available time.

Output format:

## 7-day prompt set
Numbered prompts, one per day, each with a 2-minute starter cue.

## 10-minute routine
Step-by-step routine: settle, write, close, with time splits.

## Reflection check-in
Three questions to review the week at the end of day 7.

## Tips for consistency
Short practical tips matched to the experience level.

Rules:
- Keep prompts open-ended and non-judgmental
- Match difficulty to the experience level given
- Avoid therapeutic or diagnostic claims
- Keep tone neutral and encouraging
- Do not use emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['tone-rewriter', 'research-agent'],
}
