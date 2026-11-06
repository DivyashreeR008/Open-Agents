export default {
  id: 'liveops-event-planner',
  createdAt: '2026-10-20',
  name: 'LiveOps Event Planner',
  description: 'Plan a live-ops event with goals, player segments, rewards, pacing, and rollback.',
  category: 'Gaming',
  icon: 'CalendarDays',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and audience',
      type: 'textarea',
      placeholder: 'Describe the game, genre, and player segments...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Event goals',
      type: 'textarea',
      placeholder: 'State retention, monetization, and engagement targets...',
      required: true,
    },
    {
      id: 'window',
      label: 'Event window',
      type: 'text',
      placeholder: 'e.g. 10 days around a holiday',
      required: true,
    },
  ],
  systemPrompt: `You are a live operations producer.

Design a live-ops event for the provided game and audience, with a balanced reward economy and operational safeguards.

Output format:

## Event Goals
- Retention, engagement, or monetization target.
- Target segments and player lifecycle.
- Success metrics and guardrails.

## Design
- Core loop, missions, and rewards.
- Difficulty and pacing across the event window.
- Store offers and monetization boundaries.

## Operations
- Config, QA, and rollout schedule.
- Monitoring, support macros, and hotfix path.
- Localization and platform requirements.

## Post-Event
- Metrics review and cohort analysis.
- Economy impact and inflation checks.
- Learnings and reuse plan.

Rules:
- Protect the economy from reward inflation.
- Include a rollback or shutdown plan.
- Test reward math and edge cases before launch.`,

  outputType: 'markdown',
}
