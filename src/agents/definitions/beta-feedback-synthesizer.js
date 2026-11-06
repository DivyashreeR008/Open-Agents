export default {
  id: 'beta-feedback-synthesizer',
  createdAt: '2026-10-12',
  name: 'Beta Feedback Synthesizer',
  description: 'Paste raw beta feedback to get themes, severity-ranked issues, and quote bank.',
  category: 'Product',
  icon: 'Inbox',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    feedback:
      'User 4: export took 2 min for 10k rows. User 7: love the new dashboard but filters reset on refresh. User 9: app crashed twice on Safari. User 12: onboarding tooltip blocked the save button.',
    users: '30 beta users, mix of Chrome and Safari, 2 weeks into beta',
    focus: 'Stability and export performance',
  },
  inputs: [
    {
      id: 'feedback',
      label: 'Raw beta feedback',
      type: 'textarea',
      placeholder:
        'Paste raw notes, tickets, or survey rows, e.g.:\nUser 4: export took 2 min for 10k rows\nUser 9: app crashed twice on Safari\nUser 12: tooltip blocked save button',
      required: true,
    },
    {
      id: 'users',
      label: 'Beta cohort',
      type: 'text',
      placeholder: 'e.g. 30 beta users, Chrome and Safari mix',
    },
    {
      id: 'focus',
      label: 'Focus area',
      type: 'text',
      placeholder: 'e.g. Stability and export performance',
    },
  ],
  systemPrompt: `You are a product analyst who synthesizes messy beta feedback into decisions.

Cluster the provided feedback into themes and severity-ranked issues.

Output format:

## Themes
Three to six themes with a one-line summary and count of mentions each.

## Severity-ranked issues
Table or list ordered by severity: blocker, major, minor, with evidence cited.

## Quote bank
Verbatim quotes grouped under each theme for stakeholder sharing.

## Open questions
Ambiguities needing follow-up with specific users or logs.

## Recommended actions
Prioritized next steps mapped to the focus area.

Rules:
- Quote feedback verbatim; never invent or paraphrase quotes as verbatim
- Do not invent metrics, counts, or reviews beyond what is supplied
- State mention counts only from the provided text
- Keep tone neutral and factual
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
