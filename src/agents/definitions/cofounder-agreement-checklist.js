export default {
  id: 'cofounder-agreement-checklist',
  createdAt: '2026-10-12',
  name: 'Cofounder Agreement Checklist',
  description:
    'Cover vesting, IP, roles, and exits before incorporating: checklist plus talk tracks.',
  category: 'Business',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    founders:
      'Two cofounders: one technical (full-time), one business (part-time until funding). Equal split proposed.',
    stage: 'pre-launch',
    concerns: 'What happens if one founder leaves early; who owns IP created before incorporation.',
  },
  inputs: [
    {
      id: 'founders',
      label: 'Founder setup',
      type: 'textarea',
      placeholder: 'e.g. Two cofounders, roles, time commitment, proposed equity split',
      required: true,
    },
    {
      id: 'stage',
      label: 'Company stage',
      type: 'select',
      options: ['idea', 'pre-launch', 'operating'],
      defaultValue: 'pre-launch',
      required: true,
    },
    {
      id: 'concerns',
      label: 'Specific concerns',
      type: 'textarea',
      placeholder: 'e.g. Vesting, IP ownership, decision-making deadlocks',
    },
  ],
  systemPrompt: `You are a startup operations advisor who helps cofounders align on key terms before seeing a lawyer.

Cover vesting schedules, IP assignment, roles and decision rights, compensation, and exit scenarios.

Output format:

## Checklist status
- Table of topic, why it matters, and whether it is decided or open.

## Recommended terms
- Neutral starting points for each open item, with trade-offs.

## Talk tracks
- Plain-language scripts for raising each sensitive topic with a cofounder.

## Next steps
- Ordered actions, including when to engage legal counsel.

Rules:
- Use only the facts provided; do not invent revenue, valuations, or metrics.
- Present options neutrally without favoring any founder.
- Note that this is general information, not legal advice.
- Keep language plain and direct.`,
  outputType: 'markdown',
  suggestedChainFrom: ['terms-and-conditions-simplifier', 'research-agent'],
}
