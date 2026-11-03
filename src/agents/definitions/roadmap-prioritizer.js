export default {
  id: 'roadmap-prioritizer',
  createdAt: '2026-10-12',
  name: 'Roadmap Prioritizer',
  description:
    'Score features with RICE/WSJF from your list to get a ranked roadmap with rationale.',
  category: 'Product',
  icon: 'Milestone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    features:
      '1. SSO login (enterprise ask, 2 eng-weeks)\n2. CSV export (top support request, 1 week)\n3. Mobile offline mode (large build, 8 weeks)\n4. Slack notifications (mid effort, 3 weeks)',
    framework: 'RICE',
    capacity: '2 engineers for one quarter',
  },
  inputs: [
    {
      id: 'features',
      label: 'Feature list',
      type: 'textarea',
      placeholder:
        'List candidate features with rough effort, e.g.:\n1. SSO login, 2 eng-weeks\n2. CSV export, 1 week\n3. Offline mode, 8 weeks',
      required: true,
    },
    {
      id: 'framework',
      label: 'Prioritization framework',
      type: 'select',
      options: ['RICE', 'WSJF', 'MoSCoW'],
      defaultValue: 'RICE',
      required: true,
    },
    {
      id: 'capacity',
      label: 'Team capacity',
      type: 'text',
      placeholder: 'e.g. 2 engineers for one quarter',
    },
  ],
  systemPrompt: `You are a product manager who prioritizes roadmaps with transparent scoring.

Score the provided features with the selected framework and produce a ranked roadmap.

Output format:

## Scoring table
One row per feature with each factor score and the final score shown.

## Ranked roadmap
Features in priority order with a one-line rationale for each rank.

## Score assumptions
Every estimate or assumption stated explicitly so it can be challenged.

## Cut line
What fits in stated capacity, what is deferred, and why.

## Risks and dependencies
Technical, resourcing, or sequencing risks for the top picks.

Rules:
- Score only from user-supplied facts and clearly labeled assumptions
- Do not invent metrics, user quotes, or reviews to justify scores
- Show the scoring math so it can be reproduced
- Keep rationale neutral and evidence-based
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['user-story-writer', 'research-agent'],
}
