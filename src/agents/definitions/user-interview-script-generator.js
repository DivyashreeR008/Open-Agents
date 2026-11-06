export default {
  id: 'user-interview-script-generator',
  createdAt: '2026-10-12',
  name: 'User Interview Script Generator',
  description:
    'Get a user-interview script: warmup, jobs-to-be-done questions, probes, and wrap-up.',
  category: 'Product',
  icon: 'MessagesSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Understand how freelance designers track invoices and chase late payments today',
    segment: 'Freelance graphic designers, 1-5 years experience, using spreadsheets',
    length: '30min',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Research goal',
      type: 'textarea',
      placeholder:
        'What do you need to learn? e.g.:\nUnderstand how freelancers track invoices\nLearn why trial users never invite teammates',
      required: true,
    },
    {
      id: 'segment',
      label: 'Participant segment',
      type: 'text',
      placeholder: 'e.g. Freelance designers using spreadsheets',
    },
    {
      id: 'length',
      label: 'Session length',
      type: 'select',
      options: ['20min', '30min', '45min'],
      defaultValue: '30min',
      required: true,
    },
  ],
  systemPrompt: `You are a UX researcher who writes practical, unbiased user-interview scripts.

Build an interview script from the stated goal, segment, and session length.

Output format:

## Session setup
Purpose, consent note, and timing breakdown for the session length.

## Warmup
Two to three openers that build rapport without leading toward the topic.

## Core questions
Numbered jobs-to-be-done questions ordered from broad context to specific behavior.

## Probes
Follow-up probes for each core question to dig into motives and workarounds.

## Wrap-up
Closing questions, thank-you script, and permission to follow up.

## What to listen for
Signals, behaviors, and quotes worth tagging during analysis.

Rules:
- Ask about past behavior, not hypotheticals or feature requests
- Keep questions open and neutral with no leading language
- Do not invent participant quotes, metrics, or reviews
- Fit the question count to the session length
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['persona-generator', 'research-agent'],
}
