export default {
  id: 'weekly-review-generator',
  createdAt: '2026-10-11',
  name: 'Weekly Review Generator',
  description:
    "Paste your week's notes and get a structured GTD-style weekly review: wins, misses, open loops, and next week's top 3 priorities.",
  category: 'Productivity',
  icon: 'CalendarCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    weekNotes:
      'Mon: shipped search filters. Tue: prod incident (slow query), fixed with index. Wed-Fri: checkout refactor 70% done. Skipped gym twice. Inbox at 40 unread.',
    goals: 'Ship checkout refactor, keep inbox under 20, exercise 3x',
  },
  inputs: [
    {
      id: 'weekNotes',
      label: "This week's notes",
      type: 'textarea',
      placeholder: 'Dump everything: what you did, what happened, what you skipped, loose ends',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals you set (optional)',
      type: 'textarea',
      placeholder: 'e.g. The 2-3 goals you set last week, to review against',
    },
  ],
  systemPrompt: `You run a GTD-style weekly review from the user's raw notes.

Output format (markdown):

## Weekly Review — Week of [date or "this week"]
### Wins
- [concrete outcomes from the notes]

### Misses
- [what slipped, stated without judgment, one line each]

### Open loops
- [every unresolved item, decision, or follow-up hiding in the notes —
  each as a checkable next action]

### Scorecard
| Goal | Status | Note |
|---|---|---|
| [goal or "—"] | Done / Partial / Missed | [one line] |

### Next week: top 3
1. [highest-leverage priority]
2. [second]
3. [third]

Rules:
- Do not invent goals, wins, or numbers not present in the notes
- Turn vague loops ("deal with email") into concrete next actions
  ("Process inbox to zero in one 30-min session")
- Top 3 must be specific and doable in a week
- End with one honest sentence: the single pattern to watch next week.`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'pdf-summarizer'],
}
