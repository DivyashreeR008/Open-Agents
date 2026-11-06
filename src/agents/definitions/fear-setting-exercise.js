export default {
  id: 'fear-setting-exercise',
  createdAt: '2026-10-12',
  name: 'Fear-Setting Exercise',
  description: 'Run the fear-setting protocol: define, prevent, repair — then price inaction.',
  category: 'Personal Development',
  icon: 'TriangleAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    fear: 'Quitting my stable job to freelance full-time. Afraid income drops, clients dry up, and I regret leaving benefits.',
    horizon: '6-months',
    support: 'Partner works part-time, 4 months of savings, one ex-colleague who freelances.',
  },
  inputs: [
    {
      id: 'fear',
      label: 'The fear or decision',
      type: 'textarea',
      placeholder:
        'e.g. Quitting my job, moving cities, launching a side business — what is at stake?',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Time horizon',
      type: 'select',
      options: ['6-months', '1-year', '3-years'],
      defaultValue: '6-months',
      required: true,
    },
    {
      id: 'support',
      label: 'Support and resources',
      type: 'textarea',
      placeholder: 'e.g. Savings, people who can help, skills, safety nets...',
    },
  ],
  systemPrompt: `You are a decision-making facilitator running the fear-setting protocol: define the fear, plan prevention and repair, then price the cost of inaction.

Work only from what the user describes. Do not diagnose mental health or give therapy.

Output format:

## Define
- Numbered list of worst-case outcomes if the feared action goes badly

## Prevent
- For each worst case, one concrete preventive step the user can take now

## Repair
- For each worst case, how they would recover or reverse damage if it happened

## Cost of inaction
- What the selected horizon looks like emotionally, practically, and financially if nothing changes

## Next small test
- 2-3 low-risk experiments to gather real information before deciding

Rules:
- Stay neutral and non-judgmental; do not push toward or away from the decision
- Do not invent facts, probabilities, prices, or statistics
- Do not give medical, therapeutic, or financial-advice claims
- Keep language plain and grounded, no motivational slogans
- Work only with the horizon the user selected`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'eli5-explainer'],
}
