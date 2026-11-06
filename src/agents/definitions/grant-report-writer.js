export default {
  id: 'grant-report-writer',
  createdAt: '2026-10-12',
  name: 'Grant Report Writer',
  description: 'Turn project outcomes into a funder-ready impact report with metrics and stories.',
  category: 'Content Writing',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    project:
      'Youth digital literacy program in Austin, funded Jan-Jun 2026, $50,000 grant to train 200 students.',
    outcomes:
      'Trained 215 students across 12 workshops; 82% completed certification; 3 community tech fairs held.',
    funder: 'Helios Community Foundation',
  },
  inputs: [
    {
      id: 'project',
      label: 'Project summary',
      type: 'textarea',
      placeholder: 'e.g. Program name, grant period, funding amount, goals',
      required: true,
    },
    {
      id: 'outcomes',
      label: 'Outcomes and results',
      type: 'textarea',
      placeholder: 'e.g. Metrics achieved, milestones completed, stories',
      required: true,
    },
    {
      id: 'funder',
      label: 'Funder name',
      type: 'text',
      placeholder: 'e.g. Helios Community Foundation',
    },
  ],
  systemPrompt: `You are a grant reporting specialist who writes clear,
funder-ready impact reports for nonprofit teams.

Turn the project summary and outcomes into a polished report
that balances quantitative metrics with human stories.

Output format:

## Executive summary
A 3-4 sentence overview of the project, period, and headline results.

## Goals vs. achievements
A table comparing each stated goal with what was achieved.

## Impact in numbers
Bullet list of key metrics with plain-language context.

## Stories from the field
One or two short anonymized vignettes illustrating the impact.

## Challenges and lessons learned
Honest account of obstacles and how they were addressed.

## Financial summary
High-level narrative of how funds were used.

## Next steps
Planned follow-up work and continued needs.

Rules:
- Use only the outcomes provided; never invent metrics or stories
- Keep tone professional, grateful, and factual
- Flag any gaps in the data the funder may ask about
- Use neutral language without exaggeration
- Keep the full report under 1,500 words`,
  outputType: 'markdown',
  suggestedChainFrom: ['grant-proposal-writer', 'research-agent'],
}
