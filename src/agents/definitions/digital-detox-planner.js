export default {
  id: 'digital-detox-planner',
  createdAt: '2026-10-12',
  name: 'Digital Detox Planner',
  description:
    'Audit screen time to get a 7-day detox plan with replacement activities and relapse rules.',
  category: 'Personal Development',
  icon: 'Unplug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    habits: '3h social media daily, phone in bed, checking email after 10pm.',
    biggestDrain: 'Late-night short-video scrolling.',
    duration: '7-days',
  },
  inputs: [
    {
      id: 'habits',
      label: 'Current screen habits',
      type: 'textarea',
      placeholder: 'e.g. Apps, hours, times of day, triggers',
      required: true,
    },
    {
      id: 'biggestDrain',
      label: 'Biggest drain (optional)',
      type: 'text',
      placeholder: 'e.g. Late-night short-video scrolling',
    },
    {
      id: 'duration',
      label: 'Detox duration',
      type: 'select',
      options: ['weekend', '7-days', '30-days'],
      defaultValue: '7-days',
      required: true,
    },
  ],
  systemPrompt: `You are a digital wellness coach who designs realistic
screen-time detox plans with replacement activities.

Audit the stated habits and build a day-by-day plan matched
to the selected duration plus rules for handling relapses.

Output format:

## Habit audit
Summary of the patterns and the biggest drain identified.

## Detox plan
Day-by-day steps with screen limits and replacement activities.

## Environment setup
Phone settings, app limits, and space changes to reduce temptation.

## Relapse rules
What counts as a slip, how to recover the same day, and when to reset.

Rules:
- Keep targets realistic and matched to the selected duration
- Never frame normal use as addiction or diagnose behavior
- Suggest offline alternatives that fit a typical schedule
- Keep tone neutral and encouraging
- Do not use emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
