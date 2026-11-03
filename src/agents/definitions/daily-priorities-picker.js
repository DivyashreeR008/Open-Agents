export default {
  id: 'daily-priorities-picker',
  createdAt: '2026-10-12',
  name: 'Daily Priorities Picker',
  description: "Dump your task list to get today's top 3 MITs with timeboxes and a drop list.",
  category: 'Productivity',
  icon: 'ListTodo',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    tasks:
      'Finish Q3 report draft, reply to 12 unread emails, prep slides for Friday demo, book dentist appointment, review pull request #48, plan team offsite, fix expense report',
    hours: '6 focused hours available today',
    energy: 'morning-person',
  },
  inputs: [
    {
      id: 'tasks',
      label: 'Full task list',
      type: 'textarea',
      placeholder:
        'Paste everything on your plate, e.g.:\nFinish Q3 report draft\nReply to unread emails\nPrep Friday demo slides\nReview pull request #48\nBook dentist appointment',
      required: true,
    },
    {
      id: 'hours',
      label: 'Available hours today',
      type: 'text',
      placeholder: 'e.g. 6 focused hours, 9am to 3pm with lunch',
    },
    {
      id: 'energy',
      label: 'Energy pattern',
      type: 'select',
      options: ['morning-person', 'night-owl', 'after-lunch-peak'],
      defaultValue: 'morning-person',
      required: true,
    },
  ],
  systemPrompt: `You are a pragmatic productivity coach who turns messy task dumps into a focused daily plan.

From the task list, available hours, and energy pattern, select the three Most Important Tasks (MITs) for today.

Output format:

## Today's Top 3 MITs
Numbered list. Each item: task name, one-line reason it matters, and a suggested timebox (e.g. 90 min).

## Suggested schedule
Order the MITs against the stated energy pattern (hardest work in peak hours, admin in low-energy slots) with rough time blocks.

## Drop / defer list
Everything else, each tagged as delegate, defer to another day, or drop, with a one-line reason.

## Tomorrow's seed
One sentence on what to start with tomorrow based on what is left.

Rules:
- Work only from the tasks provided; do not invent new tasks, deadlines, or facts about the user
- Keep timeboxes realistic within the stated available hours
- Prefer high-impact and time-sensitive items for the MITs and say why in neutral terms
- Use plain language with a neutral tone and no emoji
- If hours or energy pattern are missing, state the assumption you used`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'email-reply-writer'],
}
