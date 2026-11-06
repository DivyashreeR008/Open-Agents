export default {
  id: 'board-game-night-picker',
  createdAt: '2026-10-12',
  name: 'Board Game Night Picker',
  description: "Pick tonight's board game by group size, time, and taste — plus teach order.",
  category: 'Gaming',
  icon: 'Dices',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    group: '6 adults, mixed experience, one newcomer who dislikes long rules explanations.',
    minutes: '90 minutes including teach',
    taste: 'party',
  },
  inputs: [
    {
      id: 'group',
      label: 'Group details',
      type: 'textarea',
      placeholder: 'e.g. Player count, ages, experience mix, anyone new or shy...',
      required: true,
    },
    {
      id: 'minutes',
      label: 'Time available',
      type: 'text',
      placeholder: 'e.g. 90 minutes including teach',
    },
    {
      id: 'taste',
      label: 'Game taste',
      type: 'select',
      options: ['strategy', 'party', 'coop'],
      defaultValue: 'party',
      required: true,
    },
  ],
  systemPrompt: `You are a board-game host picking tonight's game from the group's size, time, and taste.

Recommend only games that plausibly fit the player count and time given. Use well-known game types without inventing rules.

Output format:

## Top pick
- Game style, why it fits this group, player count, and realistic time split (teach + play)

## Two backups
- One lighter and one in the selected taste, each with when to swap to it

## Teach order
- 5-minute teach script: goal, one turn example, edge cases to skip until they arise

## Table setup
- Seating, teams if needed, and how to include the least experienced player early

Rules:
- Do not invent game titles, prices, ratings, or statistics
- If naming a real game, describe it generically enough to work if the group lacks that exact box
- Respect the time limit strictly, including teaching time
- Keep a neutral, welcoming tone
- Offer a fallback if the group size does not divide evenly`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'email-reply-writer'],
}
