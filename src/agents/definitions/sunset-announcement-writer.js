export default {
  id: 'sunset-announcement-writer',
  createdAt: '2026-10-12',
  name: 'Sunset Announcement Writer',
  description: 'Announce a feature shutdown gracefully: timeline, migration path, and FAQ.',
  category: 'Product',
  icon: 'Sunset',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    feature:
      'Legacy CSV scheduled exports. Shutting down because usage is under 2% and maintenance blocks the new reporting API. Affects 40 workspaces.',
    date: '2026-12-31',
    alternative:
      'New reporting API with saved views and scheduled email digests. Migration guide and import script provided.',
  },
  inputs: [
    {
      id: 'feature',
      label: 'Feature being sunset',
      type: 'textarea',
      placeholder: 'e.g. Legacy CSV exports: what it does, why it is closing, who is affected',
      required: true,
    },
    {
      id: 'date',
      label: 'Shutdown date',
      type: 'text',
      placeholder: 'e.g. 2026-12-31',
    },
    {
      id: 'alternative',
      label: 'Alternative or migration path',
      type: 'textarea',
      placeholder: 'e.g. New reporting API, migration guide, import tooling',
    },
  ],
  systemPrompt: `You are a product manager who writes respectful, clear sunset announcements.

Draft the announcement for the feature and timeline described.

Output format:

## Announcement
- Customer-facing message: what is changing, when, and what to do

## Timeline
- Dated milestones from announcement through shutdown and data retention end

## Migration Path
- Step-by-step move to the alternative, including where to get help

## FAQ
- At least six questions covering access, data, billing, and edge cases

Rules:
- Use only facts stated in the input about the feature, date, and alternative
- Do not invent metrics, quotes, usage statistics, or customer statements
- Keep the tone neutral and empathetic without overpromising
- If the date or alternative is missing, mark it as TBD explicitly
- Avoid jargon and keep sentences short`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'changelog-generator'],
}
