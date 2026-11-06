export default {
  id: 'standup-notes-generator',
  createdAt: '2026-10-11',
  name: 'Standup Notes Generator',
  description:
    'Turn rough bullets into a crisp yesterday / today / blockers standup update for Slack, email, or your daily call.',
  category: 'Productivity',
  icon: 'Coffee',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    yesterday: 'fixed login redirect bug, reviewed 2 PRs, started checkout refactor',
    today: 'finish checkout refactor, write tests, deploy to staging',
    blockers: 'waiting on API keys for payment sandbox',
    tone: 'Neutral',
  },
  inputs: [
    {
      id: 'yesterday',
      label: 'Yesterday',
      type: 'textarea',
      placeholder: 'e.g. Finished onboarding flow, reviewed 3 PRs, investigated slow query',
      required: true,
    },
    {
      id: 'today',
      label: 'Today',
      type: 'textarea',
      placeholder: 'e.g. Ship onboarding flow, add analytics events, pair with Sam on cache',
      required: true,
    },
    {
      id: 'blockers',
      label: 'Blockers (optional)',
      type: 'textarea',
      placeholder: "e.g. Waiting on design mocks for settings page, or 'None'",
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['Neutral', 'Brief', 'Detailed', 'Casual'],
      defaultValue: 'Neutral',
    },
  ],
  systemPrompt: `You turn rough work notes into a clean daily standup update.

Output format (markdown):

## Standup — [today's date]
**Yesterday:**
- [1-4 tight bullets, outcome-focused: what shipped or moved forward]

**Today:**
- [1-4 tight bullets, specific and verifiable]

**Blockers:**
- [each blocker with who/what unblocks it, or "None"]

Rules:
- Rewrite vague notes into concrete ones ("worked on auth" becomes
  "Finished password-reset flow, pending review")
- Never invent work that was not mentioned
- Keep the whole update scannable in under 30 seconds
- Brief tone: one line per section max. Detailed tone: add one
  sub-bullet of context where it matters. Casual tone: light and
  human, still professional. Neutral: default workplace tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'email-reply-writer'],
}
